# app/email_sender.py
import os
from email.message import EmailMessage
from aiosmtplib import send
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

async def send_status_update_email(to_email: str):

    print("\n\nSending status update email to:\n\n")

    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = to_email
    message["Subject"] = "Congratulations! You're Selected for Coding Round"

    content = """
    Dear Candidate,

    Congratulations! Your resume has been shortlisted and you have been selected for the coding round.
    
    Please prepare for the upcoming coding assessment. Further details will be shared soon.

    Best regards,
    HR Team
    """

    message.set_content(content)

    await send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASS,
        start_tls=True
    )