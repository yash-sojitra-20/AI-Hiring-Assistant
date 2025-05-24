import re

def extract_labels(text: str):
    text = text.lower()

    keywords = [
        # Programming languages
        "python", "java", "c++", "c#", "javascript", "typescript", "go", "rust", "php", "swift", "kotlin",
        "scala", "perl", "shell", "bash",

        # Frontend frameworks
        "react", "angular", "vue", "next.js", "svelte", "bootstrap", "tailwind", "ember.js",

        # Backend frameworks
        "node", "express", "django", "flask", "fastapi", "spring", "spring boot", "laravel", "ruby on rails",
        "asp.net", "symfony",

        # Databases
        "mysql", "postgresql", "mongodb", "sqlite", "oracle", "redis", "cassandra", "dynamodb",
        "elasticsearch", "mariadb",

        # Cloud & DevOps
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible",
        "ci/cd", "circleci", "gitlab ci",

        # Data Science & ML
        "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "pytorch", "keras", "openai", "huggingface",
        "xgboost", "lightgbm", "catboost",

        # Big Data
        "hadoop", "spark", "kafka", "airflow",
        "flink", "zeppelin",

        # APIs
        "rest api", "graphql", "grpc", "postman", "swagger",
        "openapi",

        # Tools & Misc
        "git", "github", "gitlab", "bitbucket", "jira", "figma", "excel", "power bi", "tableau",
        "confluence", "slack", "notion",

        # Other
        "nlp", "data analysis", "data visualization", "linux", "agile", "scrum", "kanban",
        "microservices", "docker-compose"
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
