import re

EXPERIENCE_KEYWORDS = ["year", "yr", "experience", "exp"]

def normalize_experience(label: str) -> float:
    """Extracts number from labels like '2 years', '3+ yr exp'"""
    label = label.lower()
    if any(kw in label for kw in EXPERIENCE_KEYWORDS):
        match = re.search(r'(\d+(\.\d+)?)', label)
        if match:
            return float(match.group(1))
    return 0.0
