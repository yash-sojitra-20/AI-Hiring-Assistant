import re

def extract_labels(text: str):
    text = text.lower()

    keywords = [
        # Programming languages
        "python", "java", "c++", "c#", "javascript", "typescript", "go", "rust", "php", "swift", "kotlin",

        # Frontend frameworks
        "react", "angular", "vue", "next.js", "svelte", "bootstrap", "tailwind",

        # Backend frameworks
        "node", "express", "django", "flask", "fastapi", "spring", "spring boot", "laravel", "ruby on rails",

        # Databases
        "mysql", "postgresql", "mongodb", "sqlite", "oracle", "redis", "cassandra", "dynamodb",

        # Cloud & DevOps
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible",

        # Data Science & ML
        "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "pytorch", "keras", "openai", "huggingface",

        # Big Data
        "hadoop", "spark", "kafka", "airflow",

        # APIs
        "rest api", "graphql", "grpc", "postman", "swagger",

        # Tools & Misc
        "git", "github", "gitlab", "bitbucket", "jira", "figma", "excel", "power bi", "tableau",

        # Other
        "nlp", "data analysis", "data visualization", "linux", "agile", "scrum"
    ]

    labels = []
    for kw in keywords:
        if kw in text and kw not in labels:
            labels.append(kw)

    # Extract first matched number of years of experience
    match = re.search(r'(\d+)\s*(\+)?\s*(years?|yrs?)', text)
    if match:
        years = match.group(1)
        labels.append(f"{years} year")
    else:
        labels.append("0 year")

    return labels
