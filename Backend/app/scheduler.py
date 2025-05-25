from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timedelta
import logging
import asyncio
from bson import ObjectId
from app.candidate_selector import select_top_candidates
from app.notification_service import send_coding_round_emails
from db import job_user_collection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()

print("\n\nScheduler initialized.\n\n")

def start_resume_collection(job_id):
    logging.info(f"[Job {job_id}] Resume collection started.")

async def end_resume_collection(job_id: str):
    try:
        print(f"\n\nEnding resume collection for job: {job_id}\n\n")
        logger.info(f"Selecting top candidates for job: {job_id}")

        selected_candidates = await select_top_candidates(job_id, 0.5)

        if selected_candidates:
            logger.info(f"Selected {len(selected_candidates)} candidates for job {job_id}")
            await send_coding_round_emails(job_id, selected_candidates)

            # The status is already updated in select_top_candidates function
            # No need to update again here unless you want a different status
            logger.info(f"Candidates already marked as shortlisted in select_top_candidates")

        else:
            logger.warning(f"No candidates selected for job {job_id}")

    except Exception as e:
        logger.error(f"Error selecting top candidates for job {job_id}: {e}")

def start_coding_round(job_id):
    logging.info(f"[Job {job_id}] Coding round started.")

def end_coding_round(job_id):
    logging.info(f"[Job {job_id}] Coding round ended. Evaluating submissions...")

def start_interview_round(job_id):
    logging.info(f"[Job {job_id}] Interview round started.")

def schedule_workflow(job_id, timings):
    scheduler.add_job(start_resume_collection, DateTrigger(run_date=timings['resume_start']), args=[job_id])
    scheduler.add_job(end_resume_collection, DateTrigger(run_date=timings['resume_end']), args=[job_id])
    scheduler.add_job(start_coding_round, DateTrigger(run_date=timings['coding_start']), args=[job_id])
    scheduler.add_job(end_coding_round, DateTrigger(run_date=timings['coding_end']), args=[job_id])
    scheduler.add_job(start_interview_round, DateTrigger(run_date=timings['interview_start']), args=[job_id])

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logging.info("Scheduler started.")

# Optional: Add a function to stop the scheduler gracefully
def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logging.info("Scheduler stopped.")