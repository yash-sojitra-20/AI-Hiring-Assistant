import os
from dotenv import load_dotenv
from typing import List, Dict
import google.generativeai as genai

# Load .env variables
load_dotenv()

# Set up Gemini API
genai.configure(api_key=os.getenv("GEMINI_API"))

model = genai.GenerativeModel("gemini-1.5-flash")

def extract_and_score_resume(resume_text: str, requirements: List[str]) -> Dict:
  resumeMatch = 0
  prompt = f"""
  You are an intelligent hiring assistant.

  Here is the candidate's resume:
  ---
  {resume_text}
  ---

  Here is the job requirement list:
  ---
  {requirements}
  ---
  1.Calculate `resumeMatch` (0-100) based on how closely the resume aligns with these job requirements and set to resumeMatch.
  2. Extract all the information and fill it into this JSON format (fill missing fields as  "N/A"):
  Note : Fill workExperience and education arrays with all relevant entries found in the resume (not just one).
  ```json
  {{
    "id": 1,
    "name": "",
    "email": "",
    "phone": "",
    "position": "",
    "location": "",
    "resumeMatch": 0,
    "appliedDate": "N/A",
    "status": "N/A",
    "avatar": "N/A",
    "experience": "",
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "summary": "",
    "skills": [],
    "workExperience": [
      {{
        "company": "",
        "position": "",
        "duration": "",
        "description": ""
      }}
    ],
    "education": [
      {{
        "degree": "",
        "school": "",
        "year": ""
      }}
    ]
  }}
  """
  response = model.generate_content(prompt)

  return response.text