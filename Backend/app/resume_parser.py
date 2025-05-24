import os
import json
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get API key
GEMINI_API_KEY = os.getenv("GEMINI_API")
if not GEMINI_API_KEY:
  raise ValueError("GEMINI_API key not found in environment variables")

try:
  # Configure Gemini API
  genai.configure(api_key=GEMINI_API_KEY)
  model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
  logger.error(f"Failed to initialize Gemini API: {e}")
  raise

def extract_and_score_resume(resume_text: str, requirements: List[str]) -> Dict[str, Any]:
  """
  Extract information from resume and score it against requirements.

  Args:
      resume_text (str): The text content of the resume
      requirements (List[str]): List of job requirements

  Returns:
      Dict[str, Any]: Parsed resume information and scoring
  """
  try:
    # Validate inputs
    if not resume_text or not requirements:
      raise ValueError("Resume text and requirements cannot be empty")

    # Create prompt
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

        1. Calculate `resumeMatch` (0-100) based on how closely the resume aligns with these job requirements.
        2. Extract all the information and fill it into this JSON format (fill missing fields as "N/A").
        Note: Fill workExperience and education arrays with all relevant entries found in the resume.

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

    # Generate response
    response = model.generate_content(prompt)
    if not response or not response.text:
      raise ValueError("Empty response from Gemini API")

    # Parse JSON response
    try:
      result = json.loads(response.text)

      # Validate resumeMatch
      if not isinstance(result.get("resumeMatch"), (int, float)):
        raise ValueError("Invalid resumeMatch value")

      # Ensure resumeMatch is between 0 and 100
      result["resumeMatch"] = max(0, min(100, float(result["resumeMatch"])))

      return result

    except json.JSONDecodeError:
      # Try to extract JSON from text response
      try:
        json_str = response.text[response.text.find("{"):response.text.rfind("}") + 1]
        result = json.loads(json_str)
        result["resumeMatch"] = max(0, min(100, float(result.get("resumeMatch", 0))))
        return result
      except (json.JSONDecodeError, ValueError) as e:
        logger.error(f"Failed to parse JSON response: {e}")
        raise ValueError(f"Invalid JSON response: {e}")

  except Exception as e:
    logger.error(f"Error in extract_and_score_resume: {e}")
    return {
      "id": 1,
      "name": "N/A",
      "email": "N/A",
      "phone": "N/A",
      "position": "N/A",
      "location": "N/A",
      "resumeMatch": 0,
      "appliedDate": "N/A",
      "status": "N/A",
      "avatar": "N/A",
      "experience": "N/A",
      "linkedin": "N/A",
      "github": "N/A",
      "portfolio": "N/A",
      "summary": "N/A",
      "skills": [],
      "workExperience": [],
      "education": [],
      "error": str(e)
    }