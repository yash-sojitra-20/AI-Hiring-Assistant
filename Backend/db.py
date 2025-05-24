from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client.resume_db

# Collection for user resumes
collection = db.resumes

# Collection for HR job descriptions
jd_collection = db.job_descriptions
