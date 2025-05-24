from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Path, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from datetime import datetime, timedelta
from db import hr_collection, job_collection, user_collection, job_user_collection
import io
import pdfplumber

app = FastAPI()

# Utility: Pydantic Mongo ObjectId compatibility
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        return str(v)

# ------------------ MODELS ------------------

class HRModel(BaseModel):
    hr_username: str
    hr_pass: str

class JobModel(BaseModel):
    job_des: List[str]
    job_title: str
    job_department: str
    job_type: str  # "full day" or "half day"
    job_applicant: int
    posted_date: str
    open_date: str
    problem_statements: List[str]
    hr_id: str

class UserModel(BaseModel):
    user_name: str
    user_pass: str

class JobUserModel(BaseModel):
    job_id: str
    user_id: str
    status: int
    resume_detail: dict
    resume_score: int

# ------------------ HR ------------------

@app.post("/hr/")
async def create_hr(hr: HRModel):
    result = await hr_collection.insert_one(hr.dict())
    return {"message": "HR created", "id": str(result.inserted_id)}

@app.get("/hr/")
async def get_all_hrs():
    cursor = hr_collection.find({})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        data.append(doc)
    return data

@app.get("/hr/login/")
async def get_hr_by_credentials(
        hr_username: str = Query(..., description="HR's username"),
        hr_pass: str = Query(..., description="HR's password")
):
    hr = await hr_collection.find_one({"hr_username": hr_username, "hr_pass": hr_pass})
    if not hr:
        raise HTTPException(status_code=404, detail="HR not found or invalid credentials")
    hr["_id"] = str(hr["_id"])
    return hr

# ------------------ JOB ------------------

@app.post("/job/")
async def create_job(job: JobModel):
    try:
        posted = datetime.strptime(job.posted_date, "%Y-%m-%d")
        opened = datetime.strptime(job.open_date, "%Y-%m-%d")
        closed = opened + timedelta(days=3)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    doc = job.dict()
    doc["posted_date"] = posted.isoformat()
    doc["open_date"] = opened.isoformat()
    doc["close_date"] = closed.isoformat()
    doc["hr_id"] = ObjectId(doc["hr_id"])

    result = await job_collection.insert_one(doc)
    return {"message": "Job created", "id": str(result.inserted_id)}

@app.get("/job/")
async def get_all_jobs():
    cursor = job_collection.find({})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["hr_id"] = str(doc["hr_id"])
        data.append(doc)
    return data

@app.get("/job/byHrId/{hr_id}")
async def get_jobs_by_hr_id(hr_id: str = Path(..., description="HR's ObjectId as string")):
    cursor = job_collection.find({"hr_id": ObjectId(hr_id)})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["hr_id"] = str(doc["hr_id"])
        data.append(doc)
    return data

# ------------------ USER ------------------

@app.post("/user/")
async def create_user(user: UserModel):
    result = await user_collection.insert_one(user.dict())
    return {"message": "User created", "id": str(result.inserted_id)}

@app.get("/user/")
async def get_all_users():
    cursor = user_collection.find({})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        data.append(doc)
    return data

@app.get("/user/login/")
async def get_user_by_credentials(
        user_name: str = Query(..., description="User's username"),
        user_pass: str = Query(..., description="User's password")
):
    user = await user_collection.find_one({"user_name": user_name, "user_pass": user_pass})
    if not user:
        raise HTTPException(status_code=404, detail="User not found or invalid credentials")
    user["_id"] = str(user["_id"])
    return user

# ------------------ JOB-USER ------------------

@app.post("/job-user/")
async def create_job_user(
        job_id: str = Form(...),
        user_id: str = Form(...),
        status: int = Form(...),
        resume_score: int = Form(...),
        resume_detail: str = Form(...),  # JSON as stringified
        resume: UploadFile = File(...)
):
    file_bytes = await resume.read()

    # Extract resume content if PDF
    resume_content = None
    if resume.content_type == "application/pdf":
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                resume_content = "\n".join(page.extract_text() or "" for page in pdf.pages)
        except Exception as e:
            print("PDF parsing failed:", e)

    doc = {
        "job_id": ObjectId(job_id),
        "user_id": ObjectId(user_id),
        "resume_file": file_bytes,
        "resume_filename": resume.filename,
        "resume_content_type": resume.content_type,
        "resume_content": resume_content,  # Add extracted text
        "status": status,
        "resume_score": resume_score,
        "resume_detail": eval(resume_detail)  # Caution: eval can be dangerous
    }
    result = await job_user_collection.insert_one(doc)
    return {"message": "Job application submitted", "id": str(result.inserted_id)}

@app.get("/job-user/")
async def get_all_job_users():
    cursor = job_user_collection.find({})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["job_id"] = str(doc["job_id"])
        doc["user_id"] = str(doc["user_id"])
        doc["resume_file"] = None  # Don't send raw binary
        data.append(doc)
    return data

@app.get("/job-user/download/{id}")
async def download_resume(id: str):
    doc = await job_user_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")
    return StreamingResponse(
        io.BytesIO(doc["resume_file"]),
        media_type=doc["resume_content_type"],
        headers={"Content-Disposition": f"attachment; filename={doc['resume_filename']}"}
    )

# Get job-user document by _id
@app.get("/job-user/byId/{id}")
async def get_job_user_by_id(id: str = Path(..., description="The ID of the job-user document")):
    doc = await job_user_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="JobUser document not found")
    doc["_id"] = str(doc["_id"])
    doc["job_id"] = str(doc["job_id"])
    doc["user_id"] = str(doc["user_id"])
    doc["resume_file"] = None  # don't send raw binary
    return doc

# Get all job-user documents by job_id
@app.get("/job-user/byJobId/{job_id}")
async def get_job_users_by_job_id(job_id: str = Path(..., description="Job ID to filter by")):
    cursor = job_user_collection.find({"job_id": ObjectId(job_id)})
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["job_id"] = str(doc["job_id"])
        doc["user_id"] = str(doc["user_id"])
        doc["resume_file"] = None
        results.append(doc)
    return results

# Get all job-user documents by user_id
@app.get("/job-user/byUserId/{user_id}")
async def get_job_users_by_user_id(user_id: str = Path(..., description="User ID to filter by")):
    cursor = job_user_collection.find({"user_id": ObjectId(user_id)})
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["job_id"] = str(doc["job_id"])
        doc["user_id"] = str(doc["user_id"])
        doc["resume_file"] = None
        results.append(doc)
    return results