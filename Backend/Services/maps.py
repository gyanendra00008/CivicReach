from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

# lat = "27.8"
# lon = "80.2"

# class Cordinates(BaseModel):
#     lat:float
#     lon:float



def getlocation(lat:float , lon :float):
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"

    headers = {'User-Agent': 'Gyanendra_Testing_GeoApp/1.0 (gk154866@gmail.com)'}

    response  = requests.get(url , headers=headers);

    if response.status_code == 200:
        data = response.json()
        
        if 'address' in data:
            state = data['address'].get('state', 'State not found')
            district = data['address'].get('state_district', data['address'].get('county', 'District not found'))
            pincode = data['address'].get('postcode', 'postcode not found')
            print(f"State: {state}")
            print(f"District: {district}")
            return [district , state, pincode]
        else:
            print("Location found, but address details are missing.")
            return []
    else:
        print(f"Request failed with Status Code: {response.status_code}")
        print("Server Response:", response.text)
        return []


# getlocation(lat , lon)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False, 
    allow_headers=["*"],
    allow_origins=["*"],
    allow_methods=["*"],
)
@app.get("/Location/{lan}/{lon}")
def Convert(lan:float , lon:float):
    userLocation=getlocation(lan , lon)

    if userLocation:
        return {
            "status": "success",
            "district": userLocation[0],
            "state": userLocation[1],
            "pincode":userLocation[2]
        }
    else:
        return {
            "status": "error",
            "message": "Could not determine location"
        }
