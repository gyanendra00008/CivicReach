import os 
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

database = client['ProblemsDB']
collection = database['ProblemsCollection']

def add_problem(pincode, title, category, description, img_url , user_email):
    new_problem = {
        "title": title,
        "category": category,
        "description": description,
        "img_url":img_url,
        "user_email":user_email,
        "status":"pending"
    }
    
    result = collection.update_one(
        {"pincode": pincode},                 
        {"$push": {"problems": new_problem}}, 
        upsert=True                           
    )
    
    if result.upserted_id:
        print(f"Naya Pincode ({pincode}) create hua jiski ID: {result.upserted_id}")
    else:
        print(f"Existing Pincode ({pincode}) ke array me problem add ho gayi!")

def get_problems_by_filter(pincode, category):
    
    query = {
        "pincode": pincode,
        "problems.category": category
    }
    results = list(collection.find(query))
    if results:
        print(f"\nFound {len(results)} Document(s) for Pincode: {pincode}, Category: {category} :")
        for doc in results:
            print(f"Pincode: {doc.get('pincode')}")
            print("Problems List:")
            for idx, prob in enumerate(doc.get('problems', []), 1):
                status = prob.get('status', 'Pending')  # Default status 'Pending'
                print(f"  {idx}. Title: {prob.get('title')}, Category: {prob.get('category')}, Status: [{status}]")
                print(f"     Description: {prob.get('description')}")
    else:
        print(f"\n Pincode {pincode} aur Category '{category}' ke liye koi problem nahi mili.")



def update_problem_status(pincode, title, new_status):
    
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
        print(f" Status updated to '{new_status}' for problem: '{title}'")
    else:
        print(f" Koi matching problem nahi mili (Pincode: {pincode}, Title: '{title}')")

def delete_entry(pincode, title):
    filter_query = {
        "pincode": pincode
    }

    update_action = {
        "$pull": {
            "problems": {
                "title": title
            }
        }
    }

    result = collection.update_one(filter_query, update_action)

    if result.modified_count > 0:
        print(f"Problem '{title}' deleted from Pincode: {pincode}")
    else:
        print(f" Koi matching problem nahi mili (Pincode: {pincode}, Title: '{title}')")


def show_all_data():
    """
    Saara Data Print karna
    """
    print("\n--- [All Documents in Collection] ---")
    for doc in collection.find():
        print(doc)

# to fetch image


def get_image_url(pincode, title):
    query = {
        "pincode": pincode,
        "problems.title": title
    }

    document = collection.find_one(query)

    if document:
        for problem in document.get("problems", []):
            if problem.get("title") == title:
                image_url = problem.get("img_url")

                if image_url:
                    return image_url

                return None

    return None

if __name__ == "__main__":
    add_problem(500003 , "Road Khrab h ", "Road","This is problem description " ,"http://kuchhkuchh.com","gk154866@gmail.com")
    add_problem(500003 , "Road Khrab h ", "police","This is problem description " ,"http://kuchhkuchh.com","gk154866@gmail.com")
    add_problem(500004 , "Road Khrab h ", "Road","This is problem description " ,"http://kuchhkuchh.com","gk154866@gmail.com")
    get_problems_by_filter(500003,"Road")
    get_problems_by_filter(500003,"police")

    update_problem_status(262804 , "Sadak Tooti Hui Hai","nhi ho payega")

    # delete_entry(500003 ,"Road Khrab h " )