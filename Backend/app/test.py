from resume_parser import extract_and_score_resume

# Sample data
resume_text = """
John Doe
Email: john.doe@example.com
Phone: 123-456-7890
LinkedIn: linkedin.com/in/johndoe
Experience: Software Engineer at XYZ Corp from 2018-2023, developed web apps.
Education: B.Sc. Computer Science from ABC University, 2014-2018
Skills: Python, JavaScript, SQL, Docker
"""

requirements = [
    "Proficient in Python",
    "Experience with Docker",
    "Strong knowledge of SQL",
    "Bachelor's degree in Computer Science"
]

# Call the function
result = extract_and_score_resume(resume_text, requirements)
print(result)