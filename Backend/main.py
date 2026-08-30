import os
import uuid
from datetime import datetime
from typing import Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import requests
from dotenv import load_dotenv

# Automatically look for .env in current, parent, or authentication directories
env_paths = [
    Path(".env"),
    Path("../.env"),
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent / "authentication" / ".env",
]
for path in env_paths:
    if path.exists():
        load_dotenv(path)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
database = client["ProblemsDB"]
collection = database["ProblemsCollection"]

app = FastAPI(
    title="CivicReach FastAPI Backend",
    description="Backend API for CivicReach Problems, Geolocation & Authority Routing",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Request Models
class ProblemCreate(BaseModel):
    pincode: int | str
    district: Optional[str] = "Unknown District"
    state: Optional[str] = "Unknown State"
    title: str
    category: str
    description: str
    img_url: Optional[str] = ""
    user_email: str


class ProblemStatusUpdate(BaseModel):
    problem_id: Optional[str] = None
    pincode: Optional[int | str] = None
    title: Optional[str] = None
    new_status: str  # 'pending', 'in-review', 'resolved'


# Geolocation helper
def get_location_details(lat: float, lon: float):
    """
    Reverse Geocoding using OpenStreetMap Nominatim API with complete address parsing.
    Accurately resolves District, State, City, Postcode, and Formatted Address across India.
    """
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"
    headers = {"User-Agent": "CivicReach_GeoApp/1.0 (contact@civicreach.app)"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "address" in data:
                addr = data["address"]
                state = addr.get("state") or addr.get("state_code") or "Unknown State"
                district = (
                    addr.get("state_district")
                    or addr.get("district")
                    or addr.get("county")
                    or addr.get("city_district")
                    or addr.get("city")
                    or addr.get("town")
                    or addr.get("suburb")
                    or "Unknown District"
                )
                city = (
                    addr.get("city")
                    or addr.get("town")
                    or addr.get("village")
                    or addr.get("suburb")
                    or addr.get("neighbourhood")
                    or district
                )
                raw_pincode = addr.get("postcode") or addr.get("postal_code") or "postcode not found"
                if raw_pincode != "postcode not found":
                    pincode = str(raw_pincode).split(",")[0].strip().replace(" ", "")
                else:
                    pincode = "postcode not found"

                display_name = data.get("display_name", "")

                return {
                    "district": district,
                    "state": state,
                    "city": city,
                    "pincode": pincode,
                    "formatted_address": display_name,
                }
    except Exception as e:
        print("Geocoding error:", e)
    return None


# Legacy helper returning list for backward compatibility
def getlocation(lat: float, lon: float):
    res = get_location_details(lat, lon)
    if res:
        return [res["district"], res["state"], res["pincode"]]
    return []


@app.get("/")
def health_check():
    return {"status": "ok", "service": "CivicReach FastAPI Backend (Unified)", "version": "1.1.0"}


# 1. Reverse Geocoding Route (Supports both /Location/{lan}/{lon} and /Location/{lat}/{lon})
@app.get("/Location/{lat}/{lon}")
@app.get("/Location/{lan}/{lon}")
def convert_coordinates(lat: Optional[float] = None, lan: Optional[float] = None, lon: float = 0.0):
    actual_lat = lat if lat is not None else lan
    if actual_lat is None:
        raise HTTPException(status_code=400, detail="Latitude is required")

    user_location = get_location_details(actual_lat, lon)
    if user_location:
        return {
            "status": "success",
            "district": user_location["district"],
            "state": user_location["state"],
            "city": user_location["city"],
            "pincode": user_location["pincode"],
            "formatted_address": user_location["formatted_address"],
        }
    return {"status": "error", "message": "Could not determine location"}


# 2. Get Problems by User Email (Citizen Dashboard)
@app.get("/api/problems/user/{email}")
def get_user_problems(email: str):
    normalized_email = email.strip().lower()

    pipeline = [
        {"$unwind": "$problems"},
        {
            "$match": {
                "problems.user_email": {
                    "$regex": f"^{normalized_email}$",
                    "$options": "i",
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "pincode": "$pincode",
                "district": {"$ifNull": ["$problems.district", "$district"]},
                "state": {"$ifNull": ["$problems.state", "$state"]},
                "id": {
                    "$ifNull": [
                        "$problems.id",
                        {"$toString": {"$ifNull": ["$problems._id", "$problems.title"]}},
                    ]
                },
                "title": "$problems.title",
                "category": "$problems.category",
                "description": "$problems.description",
                "img_url": "$problems.img_url",
                "user_email": "$problems.user_email",
                "status": {"$ifNull": ["$problems.status", "pending"]},
                "createdAt": {
                    "$ifNull": [
                        "$problems.createdAt",
                        "$problems.created_at",
                    ]
                },
            }
        },
    ]

    try:
        results = list(collection.aggregate(pipeline))

        for item in results:
            if not item.get("createdAt"):
                item["createdAt"] = datetime.utcnow().isoformat()
            if not item.get("status"):
                item["status"] = "pending"

        results.reverse()
        return {"status": "success", "count": len(results), "problems": results}
    except Exception as e:
        print("Error fetching user problems:", e)
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch user problems: {str(e)}"
        )


# 3. Add New Problem (Routing by Pincode, District & Category)
@app.post("/api/problems", status_code=status.HTTP_201_CREATED)
def create_problem(problem: ProblemCreate):
    try:
        pincode_clean = int(str(problem.pincode).strip().replace(" ", ""))
    except ValueError:
        pincode_clean = str(problem.pincode).strip()

    problem_id = str(uuid.uuid4())[:8]
    new_problem = {
        "id": problem_id,
        "title": problem.title.strip(),
        "category": problem.category.strip(),
        "description": problem.description.strip(),
        "img_url": problem.img_url or "",
        "user_email": problem.user_email.strip().lower(),
        "district": (problem.district or "Unknown District").strip(),
        "state": (problem.state or "Unknown State").strip(),
        "status": "pending",
        "createdAt": datetime.utcnow().isoformat(),
    }

    try:
        result = collection.update_one(
            {"pincode": pincode_clean},
            {
                "$set": {
                    "district": new_problem["district"],
                    "state": new_problem["state"],
                },
                "$push": {"problems": new_problem},
            },
            upsert=True,
        )

        return {
            "status": "success",
            "message": "Problem routed and saved to database successfully",
            "problem": {**new_problem, "pincode": pincode_clean},
        }
    except Exception as e:
        print("Error creating problem:", e)
        raise HTTPException(
            status_code=500, detail=f"Failed to save problem: {str(e)}"
        )


# 4. Authority Routing API: Get Problems by District & Category
@app.get("/api/problems/authority")
def get_authority_problems(
    district: Optional[str] = None,
    category: Optional[str] = None,
    pincode: Optional[str] = None,
    status_filter: Optional[str] = None,
):
    try:
        pipeline = [
            {"$unwind": "$problems"},
            {
                "$project": {
                    "_id": 0,
                    "pincode": "$pincode",
                    "district": {"$ifNull": ["$problems.district", "$district"]},
                    "state": {"$ifNull": ["$problems.state", "$state"]},
                    "id": {"$ifNull": ["$problems.id", "$problems.title"]},
                    "title": "$problems.title",
                    "category": "$problems.category",
                    "description": "$problems.description",
                    "img_url": "$problems.img_url",
                    "user_email": "$problems.user_email",
                    "status": {"$ifNull": ["$problems.status", "pending"]},
                    "createdAt": {
                        "$ifNull": [
                            "$problems.createdAt",
                            "$problems.created_at",
                        ]
                    },
                }
            },
        ]

        all_problems = list(collection.aggregate(pipeline))

        # Filter in Python for flexible regex and partial matches
        filtered = []
        for p in all_problems:
            # District filter
            if district and isinstance(district, str) and district.strip().lower() not in ["all", "all districts"]:
                d_str = str(p.get("district") or "").lower()
                if district.strip().lower() not in d_str:
                    continue

            # Category filter (e.g. "Roads" matches "Road & infrastructure")
            if category and isinstance(category, str) and category.strip().lower() not in ["all", "all categories"]:
                c_str = str(p.get("category") or "").lower()
                req_cat = category.strip().lower()
                if req_cat not in c_str and c_str not in req_cat:
                    # check partial overlap
                    req_tokens = req_cat.split()
                    if not any(token in c_str for token in req_tokens if len(token) > 3):
                        continue

            # Pincode filter
            if pincode and isinstance(pincode, str) and pincode.strip():
                if str(p.get("pincode")) != pincode.strip():
                    continue

            # Status filter
            if status_filter and isinstance(status_filter, str) and status_filter.strip().lower() != "all":
                if (p.get("status") or "").lower() != status_filter.strip().lower():
                    continue

            filtered.append(p)

        filtered.reverse()
        return {
            "status": "success",
            "count": len(filtered),
            "filters": {
                "district": district if isinstance(district, str) else None,
                "category": category if isinstance(category, str) else None,
                "pincode": pincode if isinstance(pincode, str) else None,
                "status": status_filter if isinstance(status_filter, str) else None,
            },
            "problems": filtered,
        }
    except Exception as e:
        print("Error querying authority problems:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 5. Get All Problems (Global View)
@app.get("/api/problems/all")
def get_all_problems():
    try:
        pipeline = [
            {"$unwind": "$problems"},
            {
                "$project": {
                    "_id": 0,
                    "pincode": "$pincode",
                    "district": {"$ifNull": ["$problems.district", "$district"]},
                    "state": {"$ifNull": ["$problems.state", "$state"]},
                    "id": {"$ifNull": ["$problems.id", "$problems.title"]},
                    "title": "$problems.title",
                    "category": "$problems.category",
                    "description": "$problems.description",
                    "img_url": "$problems.img_url",
                    "user_email": "$problems.user_email",
                    "status": {"$ifNull": ["$problems.status", "pending"]},
                    "createdAt": {
                        "$ifNull": [
                            "$problems.createdAt",
                            "$problems.created_at",
                        ]
                    },
                }
            },
        ]
        results = list(collection.aggregate(pipeline))
        results.reverse()
        return {"status": "success", "count": len(results), "problems": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 6. Update Status by Authority (By problem_id or pincode + title)
@app.patch("/api/problems/status")
@app.patch("/api/problems/{problem_id}/status")
def update_status(
    data: ProblemStatusUpdate,
    problem_id: Optional[str] = None,
):
    target_id = problem_id or data.problem_id
    new_status = data.new_status.lower()

    # If problem_id is provided, match by problems.id
    if target_id:
        result = collection.update_one(
            {"problems.id": target_id},
            {"$set": {"problems.$.status": new_status}},
        )
        if result.modified_count > 0:
            return {
                "status": "success",
                "message": f"Problem ID '{target_id}' status updated to '{new_status}'",
            }

    # Fallback to matching by pincode & title
    if data.pincode and data.title:
        try:
            pincode_val = int(data.pincode)
        except ValueError:
            pincode_val = data.pincode

        result = collection.update_one(
            {"pincode": pincode_val, "problems.title": data.title},
            {"$set": {"problems.$.status": new_status}},
        )
        if result.modified_count > 0:
            return {
                "status": "success",
                "message": f"Status updated to '{new_status}' for problem '{data.title}'",
            }

    raise HTTPException(
        status_code=404, detail="Problem not found for given ID / Pincode + Title"
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
