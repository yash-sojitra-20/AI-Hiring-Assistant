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


def generate_questions_with_answers(labels: List[str]) -> List[Dict[str, str]]:
    """
    Generate 5 technical question-answer pairs based on provided labels.

    Args:
        labels (List[str]): List of technical topics or skills

    Returns:
        List[Dict[str, str]]: A list of dictionaries with 'question' and 'answer' keys
    """
    try:
        if not labels:
            raise ValueError("Labels list cannot be empty.")

        prompt = (
            f"Generate 5 technical interview question-answer pairs for these technologies: "
            f"{', '.join(labels)}. Format the output strictly as a JSON array like this:\n"
            f"""[
  {{
    "question": "What is ...?",
    "answer": "..."
  }},
  ...
]"""
        )

        response = model.generate_content(prompt)

        if not response or not response.text:
            raise ValueError("Empty response from Gemini API")

        try:
            # Attempt direct JSON parse
            result = json.loads(response.text)
            if not isinstance(result, list):
                raise ValueError("Parsed response is not a list")
            return result

        except json.JSONDecodeError:
            # Try extracting JSON substring if needed
            json_str = response.text[response.text.find("["):response.text.rfind("]") + 1]
            result = json.loads(json_str)
            return result

    except Exception as e:
        logger.error(f"Error in generate_questions_with_answers: {e}")
        return [{"question": "N/A", "answer": f"Error occurred: {str(e)}"}]


# Example usage
if __name__ == "_main_":
    topics = ["Java", "Spring Boot", "React"]
    qa_pairs = generate_questions_with_answers(topics)
    print(json.dumps(qa_pairs,indent=2))