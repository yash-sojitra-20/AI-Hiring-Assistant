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
    message["Subject"] = "Congratulations! You’ve Been Selected for the Next Round"

    content = """
    Dear Candidate,

    Congratulations!

    We are pleased to inform you that you have been shortlisted for the next round of our selection process.

    Further details regarding the next steps will be shared with you shortly. Please stay tuned and be prepared.

    If you have any questions, feel free to reach out.

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