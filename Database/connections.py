
import os
import certifi
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Load environment variables from .env file
load_dotenv()

uri = os.getenv("MONGO_URI")

if not uri:
    raise ValueError("MONGO_URI not found in environment variables. Please check your .env file.")

# Create a new client and connect to the server
client = MongoClient(
    uri,
    server_api=ServerApi('1'),
    tlsCAFile=certifi.where()
)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("✅ Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("❌ Connection error:", e)