from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Path, Query, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime, timedelta
from db import hr_collection, job_collection, user_collection, job_user_collection
import io
import json
import logging
import pdfplumber
from app.resume_parser import extract_and_score_resume

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.scheduler import start_scheduler, schedule_workflow

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ MODELS ------------------

class HRModel(BaseModel):
    hr_username: str
    hr_pass: str

class JobModel(BaseModel):
    job_des: List[str]
    job_title: str
    job_department: str
    job_type: str
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
    resume_detail: Dict[str, Any]
    resume_score: float

# ------------------ HR Routes ------------------

@app.post("/hr/")
async def create_hr(hr: HRModel):
    try:
        result = await hr_collection.insert_one(hr.dict())
        return {"message": "HR created", "id": str(result.inserted_id)}
    except Exception as e:
        logger.error(f"Error creating HR: {e}")
        raise HTTPException(status_code=500, detail="Failed to create HR")

@app.get("/hr/")
async def get_all_hrs() -> List[Dict[str, Any]]:
    try:
        cursor = hr_collection.find({})
        data = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            data.append(doc)
        return data
    except Exception as e:
        logger.error(f"Error fetching HRs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch HRs")

@app.get("/hr/login/")
async def get_hr_by_credentials(
        hr_username: str = Query(...),
        hr_pass: str = Query(...)
) -> dict:
    try:
        hr = await hr_collection.find_one({"hr_username": hr_username, "hr_pass": hr_pass})
        if not hr:
            raise HTTPException(status_code=404, detail="Invalid HR credentials")
        hr["_id"] = str(hr["_id"])
        return hr
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in HR login: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

# ------------------ Job Routes ------------------

@app.post("/job/")
async def create_job(job: JobModel):
    try:
        posted = datetime.strptime(job.posted_date, "%Y-%m-%d")
        opened = datetime.strptime(job.open_date, "%Y-%m-%d")
        closed = opened + timedelta(days=3)

        doc = job.dict()
        doc["posted_date"] = posted.isoformat()
        doc["open_date"] = opened.isoformat()
        doc["close_date"] = closed.isoformat()
        doc["hr_id"] = ObjectId(doc["hr_id"])

        result = await job_collection.insert_one(doc)

        # When added job --> schedular will start and does it work...
        # To bhadani Tirth : we have to just add proper timings JSON
        start_scheduler()
        now = datetime.now()
        timings={
                "resume_start": now + timedelta(minutes=1),
                "resume_end": now + timedelta(minutes=2),
                "coding_start": now + timedelta(minutes=3),
                "coding_end": now + timedelta(minutes=4),
                "interview_start": now + timedelta(minutes=5),
            }
        # schedule_workflow(job_id, timings_dict_from_db)
        schedule_workflow(result.inserted_id, timings)

        return {"message": "Job created", "id": str(result.inserted_id)}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # doc = job.dict()
    # doc["posted_date"] = posted.isoformat()
    # doc["open_date"] = opened.isoformat()
    # doc["close_date"] = closed.isoformat()
    # doc["hr_id"] = ObjectId(doc["hr_id"])

    # result = await job_collection.insert_one(doc)

    # # When added job --> schedular will start and does it work...
    # # To bhadani Tirth : we have to just add proper timings JSON
    # start_scheduler()
    # now = datetime.now()
    # timings={
    #         "resume_start": now + timedelta(minutes=1),
    #         "resume_end": now + timedelta(minutes=2),
    #         "coding_start": now + timedelta(minutes=3),
    #         "coding_end": now + timedelta(minutes=4),
    #         "interview_start": now + timedelta(minutes=5),
    #     }
    # # schedule_workflow(job_id, timings_dict_from_db)
    # schedule_workflow(result.inserted_id, timings)

    # return {"message": "Job created", "id": str(result.inserted_id)}
    #     raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    # except Exception as e:
    #     logger.error(f"Error creating job: {e}")
    #     raise HTTPException(status_code=500, detail="Failed to create job")

@app.get("/job/")
async def get_all_jobs() -> List[Dict[str, Any]]:
    try:
        cursor = job_collection.find({})
        data = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["hr_id"] = str(doc["hr_id"])
            data.append(doc)
        return data
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")

@app.get("/job/byHrId/{hr_id}")
async def get_jobs_by_hr_id(hr_id: str = Path(...)) -> List[Dict[str, Any]]:
    try:
        cursor = job_collection.find({"hr_id": ObjectId(hr_id)})
        data = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["hr_id"] = str(doc["hr_id"])
            data.append(doc)
        return data
    except Exception as e:
        logger.error(f"Error fetching jobs by HR ID: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")

# ------------------ User Routes ------------------

@app.post("/user/")
async def create_user(user: UserModel):
    try:
        result = await user_collection.insert_one(user.dict())
        return {"message": "User created", "id": str(result.inserted_id)}
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@app.get("/user/")
async def get_all_users() -> List[Dict[str, Any]]:
    try:
        cursor = user_collection.find({})
        data = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            data.append(doc)
        return data
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@app.get("/user/login/")
async def get_user_by_credentials(
        user_name: str = Query(...),
        user_pass: str = Query(...)
) -> dict:
    try:
        user = await user_collection.find_one({"user_name": user_name, "user_pass": user_pass})
        if not user:
            raise HTTPException(status_code=404, detail="Invalid user credentials")
        user["_id"] = str(user["_id"])
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in user login: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

# ------------------ Job-User Routes ------------------

@app.post("/job-user/")
async def create_job_user(
        job_id: str = Form(...),
        user_id: str = Form(...),
        status: int = Form(...),
        resume: UploadFile = File(...)
):
    try:
        # Validate file
        if not resume.filename or not resume.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a PDF")

        file_bytes = await resume.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        # Extract text from PDF
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                resume_content = "\n".join(page.extract_text() or "" for page in pdf.pages)
            if not resume_content:
                raise HTTPException(status_code=400, detail="Could not extract text from resume")
        except Exception as e:
            logger.error(f"PDF parsing error: {e}")
            raise HTTPException(status_code=400, detail="Failed to parse PDF")

        # Get job requirements
        job_doc = await job_collection.find_one({"_id": ObjectId(job_id)})
        if not job_doc:
            raise HTTPException(status_code=404, detail="Job not found")

        job_description = job_doc.get("job_des", "")
        if not job_description:
            raise HTTPException(status_code=400, detail="No job description found for job")
        requirements = [job_description]
        # print("Requirements (from job description):", requirements)

# Process resume scoring
        try:
            scoring_result = extract_and_score_resume(resume_content, requirements)
            if isinstance(scoring_result, str):
                scoring_result = json.loads(scoring_result)
            resume_score = float(scoring_result.get("resumeMatch", 0))
        except Exception as e:
            logger.error(f"Scoring error: {e}")
            resume_score = 0
            scoring_result = {"error": "Failed to score resume", "details": str(e)}

        # Create document
        doc = {
            "job_id": ObjectId(job_id),
            "user_id": ObjectId(user_id),
            "resume_file": file_bytes,
            "resume_filename": resume.filename,
            "resume_content_type": resume.content_type,
            "resume_content": resume_content,
            "status": status,
            "resume_score": resume_score,
            "resume_detail": scoring_result,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await job_user_collection.insert_one(doc)

        return {
            "message": "Application submitted successfully",
            "id": str(result.inserted_id),
            "resume_score": resume_score,
            "resume_detail": scoring_result
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating job application: {e}")
        raise HTTPException(status_code=500, detail=f"Application submission failed: {str(e)}")

@app.get("/job-user/")
async def get_all_job_users() -> List[Dict[str, Any]]:
    try:
        cursor = job_user_collection.find({})
        data = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["job_id"] = str(doc["job_id"])
            doc["user_id"] = str(doc["user_id"])
            doc["resume_file"] = None
            data.append(doc)
        return data
    except Exception as e:
        logger.error(f"Error fetching applications: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch applications")

@app.get("/job-user/download/{id}")
async def download_resume(id: str):
    try:
        doc = await job_user_collection.find_one({"_id": ObjectId(id)})
        if not doc or "resume_file" not in doc:
            raise HTTPException(status_code=404, detail="Resume not found")

        return StreamingResponse(
            io.BytesIO(doc["resume_file"]),
            media_type=doc["resume_content_type"],
            headers={"Content-Disposition": f"attachment; filename={doc['resume_filename']}"}
        )
    except Exception as e:
        logger.error(f"Error downloading resume: {e}")
        raise HTTPException(status_code=500, detail="Failed to download resume")

@app.get("/job-user/byId/{id}")
async def get_job_user_by_id(id: str) -> dict:
    try:
        doc = await job_user_collection.find_one({"_id": ObjectId(id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Application not found")
        doc["_id"] = str(doc["_id"])
        doc["job_id"] = str(doc["job_id"])
        doc["user_id"] = str(doc["user_id"])
        doc["resume_file"] = None
        return doc
    except Exception as e:
        logger.error(f"Error fetching application: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch application")

@app.get("/job-user/byJobId/{job_id}")
async def get_job_users_by_job_id(job_id: str) -> List[dict]:
    try:
        cursor = job_user_collection.find({"job_id": ObjectId(job_id)})
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["job_id"] = str(doc["job_id"])
            doc["user_id"] = str(doc["user_id"])
            doc["resume_file"] = None
            results.append(doc)
        return results
    except Exception as e:
        logger.error(f"Error fetching applications by job ID: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch applications")

@app.get("/job-user/byUserId/{user_id}")
async def get_job_users_by_user_id(user_id: str) -> List[dict]:
    try:
        cursor = job_user_collection.find({"user_id": ObjectId(user_id)})
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["job_id"] = str(doc["job_id"])
            doc["user_id"] = str(doc["user_id"])
            doc["resume_file"] = None
            results.append(doc)
        return results
    except Exception as e:
        logger.error(f"Error fetching applications by user ID: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch applications")

@app.patch("/job-user/status/{id}")
async def update_job_user_status(id: str, status: int = Body(..., embed=True)):
    try:
        result = await job_user_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Application not found or status unchanged")

        return {"message": "Status updated successfully", "id": id, "new_status": status}
    except Exception as e:
        logger.error(f"Error updating status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")