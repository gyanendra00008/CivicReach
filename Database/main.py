import os 
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

database = client['ProblemsDB']
collection = database['ProblemsCollection']

def add_problem(pincode, title, category, description):
    """
    Agar pincode ka document pehle se hai, toh uske 'problems' array me 
    naya problem object add karega ($push).
    Agar nahi hai, toh naya document bana dega (upsert=True).
    """
    new_problem = {
        "title": title,
        "category": category,
        "description": description
    }
    
    result = collection.update_one(
        {"pincode": pincode},                  # Filter: kis pincode me add karna hai
        {"$push": {"problems": new_problem}},  # Action: problems array me object daalo
        upsert=True                            # Agar pincode na mile toh naya doc banao
    )
    
    if result.upserted_id:
        print(f"Naya Pincode ({pincode}) create hua jiski ID: {result.upserted_id}")
    else:
        print(f"Existing Pincode ({pincode}) ke array me problem add ho gayi!")

def get_problems_by_filter(pincode, category):
    """
    Pincode aur Category dono match karke saare documents dhundhta hai.
    """
    query = {
        "pincode": pincode,
        "problems.category": category
    }
    results = list(collection.find(query))
    if results:
        print(f"\n--- [Found {len(results)} Document(s) for Pincode: {pincode}, Category: {category}] ---")
        for doc in results:
            print(f"Pincode: {doc.get('pincode')}")
            print("Problems List:")
            for idx, prob in enumerate(doc.get('problems', []), 1):
                status = prob.get('status', 'Pending')  # Default status 'Pending'
                print(f"  {idx}. Title: {prob.get('title')}, Category: {prob.get('category')}, Status: [{status}]")
                print(f"     Description: {prob.get('description')}")
    else:
        print(f"\n❌ Pincode {pincode} aur Category '{category}' ke liye koi problem nahi mili.")


# ----------------------------------------------------------------------
# 3. Specific Problem ka Status Update karna (Positional $ Operator)
# ----------------------------------------------------------------------
def update_problem_status(pincode, title, new_status):
    """
    Kisi specific pincode ke andar specific problem ka status update karega.
    """
    filter_query = {
        "pincode": pincode,
        "problems.title": title
    }
    
    update_action = {
        "$set": {
            "problems.$.status": new_status
        }
    }
    
    result = collection.update_one(filter_query, update_action)
    
    if result.modified_count > 0:
        print(f"✅ Status updated to '{new_status}' for problem: '{title}'")
    else:
        print(f"❌ Koi matching problem nahi mili (Pincode: {pincode}, Title: '{title}')")


# ----------------------------------------------------------------------
# 4. Saara Data Print karna
# ----------------------------------------------------------------------
def show_all_data():
    print("\n--- [All Documents in Collection] ---")
    for doc in collection.find():
        print(doc)


# ======================================================================
# Testing the Functions:
# ======================================================================
if __name__ == "__main__":
    print("--- [1] Updating Status of Problems ---")
    # 'Sadak Tooti Hui Hai' ko 'Resolved' mark karte hain
    update_problem_status(262804, "Sadak Tooti Hui Hai", "Resolved")

    # 'Paani ki supply band hai' ko 'In Progress' mark karte hain
    update_problem_status(262804, "Paani ki supply band hai", "In Progress")

    print("\n--- [2] Checking Updated Data ---")
    get_problems_by_filter(262804, "Road")
    get_problems_by_filter(262804, "Paani")