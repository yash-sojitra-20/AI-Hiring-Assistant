import os
import json
import logging
from typing import Dict, Any
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


def score_transcript(transcript: str) -> Dict[str, Any]:
    """
    Score the given interview transcript based on technical correctness and quality of answers.

    Args:
        transcript (str): Full transcript of an interview including questions and user answers.

    Returns:
        Dict[str, Any]: A dictionary with a score and optional feedback
    """
    try:
        if not transcript.strip():
            raise ValueError("Transcript cannot be empty.")

        prompt = f"""
        You are a senior technical interviewer. Below is the transcript of a technical interview:

        ---
        {transcript}
        ---

        1. Evaluate the candidate's responses in terms of technical correctness, depth, and clarity.
        2. Assign a score out of 100.
        3. Provide 2-3 bullet points of constructive feedback.

        Respond strictly in this JSON format:
        {{
            "score": 85,
            "feedback": [
                "Answer to question 2 lacked detail on database indexing.",
                "Great explanation of REST principles."
            ]
        }}
        """

        response = model.generate_content(prompt)

        if not response or not response.text:
            raise ValueError("Empty response from Gemini API")

        try:
            result = json.loads(response.text)
            result["score"] = max(0, min(100, float(result.get("score", 0))))
            return result

        except json.JSONDecodeError:
            json_str = response.text[response.text.find("{"):response.text.rfind("}") + 1]
            result = json.loads(json_str)
            result["score"] = max(0, min(100, float(result.get("score", 0))))
            return result

    except Exception as e:
        logger.error(f"Error in score_transcript: {e}")
        return {
            "score": 0,
            "feedback": [f"Error occurred while processing: {str(e)}"]
        }


# Example usage
if __name__ == "__main__":
    sample_transcript = """
    AI: What is a REST API?
    Candidate: REST stands for Representational State Transfer. It is an architecture that uses HTTP methods like GET, POST...

    AI: Can you explain how Spring Boot simplifies development?
    Candidate: Spring Boot auto-configures dependencies and provides embedded servers, which makes it faster to set up...
    """
    result = score_transcript(sample_transcript)
    print(json.dumps(result,indent=2))