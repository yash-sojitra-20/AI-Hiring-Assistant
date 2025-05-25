# app/notification_service.py
import logging
from typing import List
from bson import ObjectId
from db import user_collection
from app.email_sender import send_status_update_email

logger = logging.getLogger(__name__)

async def send_coding_round_emails(job_id: str, selected_candidates: List[str]):
    """
    Send emails to selected candidates for coding round
    Args:
        job_id: Job ID
        selected_candidates: List of selected user IDs
    """

    print("\n\nSending coding round emails for job:\n\n")

    try:
        # Convert string IDs to ObjectId
        user_ids = [ObjectId(id) for id in selected_candidates]

        # Get user details including emails
        cursor = user_collection.find({"_id": {"$in": user_ids}})

        # Send emails to each selected candidate
        async for user in cursor:
            try:
                email = user.get("email")
                if email:
                    await send_status_update_email(email)
                    logger.info(f"Sent coding round email to {email}")
                else:
                    logger.warning(f"No email found for user {user['_id']}")
            except Exception as e:
                logger.error(f"Failed to send email to user {user['_id']}: {e}")
                continue

    except Exception as e:
        logger.error(f"Error sending coding round emails for job {job_id}: {e}")