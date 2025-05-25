# file: scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timedelta
import logging
import asyncio
import time  # Import the time module
from bson import ObjectId
from app.candidate_selector import select_top_candidates
from app.notification_service import send_coding_round_emails
from db import job_user_collection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()

print("\n\nScheduler initialized.\n\n")

def start_resume_collection(job_id):
    logging.info(f"[Job {job_id}] Resume collection started.")

def end_resume_collection(job_id: str):
    try:
        print("\n\nEnding resume collection for job:\n\n")

        # Call the async function using asyncio.run
        selected_candidates = asyncio.run(select_top_candidates(job_id, 0.5))

        if selected_candidates:
            logger.info(f"Selected {len(selected_candidates)} candidates for job {job_id}")
            print("\n\nSelected candidates:\n\n")

            # Call the async function using asyncio.run
            asyncio.run(send_coding_round_emails(job_id, selected_candidates))
            print("\n\nSending coding round emails...\n\n")

            # Update status
            for candidate_id in selected_candidates:
                job_user_collection.update_one(
                    {"_id": ObjectId(candidate_id)},
                    {"$set": {"status": 2}}
                )
            return selected_candidates
        else:
            logger.warning(f"No candidates selected for job {job_id}")
            return []

    except Exception as e:
        logger.error(f"Error in end_resume_collection for job {job_id}: {e}")
        return []

def start_coding_round(job_id):
    logging.info(f"[Job {job_id}] Coding round started.")

def end_coding_round(job_id):
    logging.info(f"[Job {job_id}] Coding round ended. Evaluating submissions...")

def start_interview_round(job_id):
    logging.info(f"[Job {job_id}] Interview round started.")

def schedule_workflow(job_id, timings):
    """
    Schedule all automation steps based on job timing config.
    Args:
        job_id: ID of the job posting
        timings: dict with keys:
            - resume_start
            - resume_end
            - coding_start
            - coding_end
            - interview_start
    """
    scheduler.add_job(start_resume_collection, DateTrigger(run_date=timings['resume_start']), args=[job_id])
    scheduler.add_job(end_resume_collection, DateTrigger(run_date=timings['resume_end']), args=[job_id])
    scheduler.add_job(start_coding_round, DateTrigger(run_date=timings['coding_start']), args=[job_id])
    scheduler.add_job(end_coding_round, DateTrigger(run_date=timings['coding_end']), args=[job_id])
    scheduler.add_job(start_interview_round, DateTrigger(run_date=timings['interview_start']), args=[job_id])

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logging.info("Scheduler started.")

# # Example usage:
# if __name__ == "__main__":
#     start_scheduler()
#     now = datetime.now()
#     schedule_workflow(
#         job_id="123",
#         timings={
#             "resume_start": now + timedelta(seconds=10),
#             "resume_end": now + timedelta(seconds=20),
#             "coding_start": now + timedelta(seconds=30),
#             "coding_end": now + timedelta(seconds=40),
#             "interview_start": now + timedelta(seconds=50),
#         },
#     )
#
#     # Wait 1 minute to see everything fire
#     try:
#         time.sleep(60)
#     except KeyboardInterrupt:
#         print("Interrupted.")