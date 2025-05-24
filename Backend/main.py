from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bson import ObjectId
from db import collection, jd_collection
from label_extractor import extract_labels
import pdfplumber
from docx import Document
from datetime import datetime
from fastapi import Query
import io
import base64


app = FastAPI()

# PDF reader
def read_pdf(file_bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        return "\n".join([page.extract_text() or "" for page in pdf.pages])

# DOCX reader
def read_docx(file_bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

# Upload resume with user_name
@app.post("/upload-resume/")
async def upload_resume(
        user_name: str = Form(...),
        interview_date: str = Form(...),  # expecting "YYYY-MM-DD"
        interview_time: str = Form(...),  # expecting "HH:MM" 24h format
        file: UploadFile = File(...)
):
    # Basic validation of date and time (optional, but recommended)
    try:
        interview_datetime = datetime.strptime(f"{interview_date} {interview_time}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date or time format. Use YYYY-MM-DD for date and HH:MM (24h) for time.")

    file_bytes = await file.read()

    if file.content_type == "application/pdf":
        text = read_pdf(file_bytes)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text = read_docx(file_bytes)
    else:
        raise HTTPException(status_code=415, detail="Unsupported file type")

    labels = extract_labels(text)

    doc = {
        "user_name": user_name,
        "filename": file.filename,
        "content": text,
        "labels": labels,
        "file_data": file_bytes,
        "content_type": file.content_type,
        "interview_date": interview_date,
        "interview_time": interview_time,
        "interview_datetime": interview_datetime.isoformat()  # ISO formatted combined datetime
    }

    result = await collection.insert_one(doc)
    return {
        "message": "Resume uploaded",
        "id": str(result.inserted_id),
        "labels": labels,
        "interview_date": interview_date,
        "interview_time": interview_time
    }

# Get all resume labels
@app.get("/get-labels/")
async def get_labels():
    cursor = collection.find({})
    data = []
    async for doc in cursor:
        data.append({
            "id": str(doc["_id"]),
            "user_name": doc.get("user_name", ""),
            "filename": doc["filename"],
            "labels": doc["labels"]
        })
    return data

# Download resume by ID
@app.get("/download-resume/{resume_id}")
async def download_resume(resume_id: str):
    doc = await collection.find_one({"_id": ObjectId(resume_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    return StreamingResponse(
        io.BytesIO(doc["file_data"]),
        media_type=doc["content_type"],
        headers={"Content-Disposition": f"attachment; filename={doc['filename']}"}
    )

# Download resume by filename
@app.get("/download-resume-by-name/{filename}")
async def download_resume_by_name(filename: str):
    doc = await collection.find_one({"filename": filename})
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found with that filename")

    return StreamingResponse(
        io.BytesIO(doc["file_data"]),
        media_type=doc["content_type"],
        headers={"Content-Disposition": f"attachment; filename={doc['filename']}"}
    )

@app.get("/get-all-users/")
async def get_all_users():
    cursor = collection.find({})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string

        # Encode binary file_data to base64 string
        encoded_file_data = base64.b64encode(doc["file_data"]).decode("utf-8")

        doc["file_data"] = encoded_file_data
        data.append(doc)
    return data


# Clear all resumes
@app.delete("/clear/")
async def clear_resumes():
    result = await collection.delete_many({})
    return {"message": "All resumes cleared", "count": result.deleted_count}

# JD Model
class JDModel(BaseModel):
    hr_name: str
    jd_labels: list[str]
    priority_labels: list[str]
    interview_start_date: str | None = None  # Format: YYYY-MM-DD
    interview_end_date: str | None = None


# Upload JD (HR side)
@app.post("/upload-jd/")
async def upload_jd(jd_data: JDModel):
    normalized = []
    for label in jd_data.jd_labels:
        if "year" in label.lower() or "yr" in label.lower():
            normalized.append(label.lower().split()[0] + " year")
        else:
            normalized.append(label.lower())
    priorities = [p.lower() for p in jd_data.priority_labels]

    # Optional date validation
    interview_start = None
    interview_end = None
    if jd_data.interview_start_date:
        try:
            interview_start = datetime.strptime(jd_data.interview_start_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid interview_start_date. Use YYYY-MM-DD format.")
    if jd_data.interview_end_date:
        try:
            interview_end = datetime.strptime(jd_data.interview_end_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid interview_end_date. Use YYYY-MM-DD format.")

    doc = {
        "hr_name": jd_data.hr_name.lower(),
        "jd_labels": normalized,
        "priority_labels": priorities,
        "interview_start_date": interview_start.isoformat() if interview_start else None,
        "interview_end_date": interview_end.isoformat() if interview_end else None
    }

    result = await jd_collection.insert_one(doc)
    return {"message": "JD uploaded", "id": str(result.inserted_id)}

# Get JD by ID
@app.get("/get-jd-by-id/{id}")
async def get_jd_by_id(id: str):
    doc = await jd_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="JD not found")
    doc["_id"] = str(doc["_id"])
    return doc

# Get JD by HR name
@app.get("/get-jd-by-name/{hr_name}")
async def get_jd_by_name(hr_name: str):
    doc = await jd_collection.find_one({"hr_name": hr_name.lower()})
    if not doc:
        raise HTTPException(status_code=404, detail="JD not found")
    doc["_id"] = str(doc["_id"])
    return doc

# Get all HR (JD) details
@app.get("/get-all-jds/")
async def get_all_jds():
    cursor = jd_collection.find({})
    data = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
        data.append(doc)
    return data

