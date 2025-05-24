from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb+srv://tirthbhadani4:oXVmHYziVVZLxjeF@cluster0.cyili3l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client["resume_app"]

hr_collection = db["hr"]
job_collection = db["job"]
user_collection = db["user"]
job_user_collection = db["job_user"]
