# file: scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime , timedelta
import logging
import time

# Import your existing services here
# from app.resume_processor import process_resumes
# from app.email_service import send_coding_round_emails, send_interview_invites
# from app.evaluator import evaluate_submissions

logging.basicConfig(level=logging.INFO)
scheduler = BackgroundScheduler()

# These are placeholders for your actual task functions
def start_resume_collection(job_id):
    logging.info(f"[Job {job_id}] Resume collection started.")
    # Trigger logic if needed


def end_resume_collection(job_id):
    logging.info(f"[Job {job_id}] Resume collection ended. Starting resume evaluation...")
    # process_resumes(job_id)
    # select top candidates
    # send_coding_round_emails(job_id)


def start_coding_round(job_id):
    logging.info(f"[Job {job_id}] Coding round started.")


def end_coding_round(job_id):
    logging.info(f"[Job {job_id}] Coding round ended. Evaluating submissions...")
    # evaluate_submissions(job_id)
    # send_interview_invites(job_id)


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
#     # This can be triggered manually or when server starts
#     start_scheduler()
#     now = datetime.now()
#     schedule_workflow(
#         job_id=123,
#         # timings={
#         #     "resume_start": datetime(2025, 5, 23, 9, 0),
#         #     "resume_end": datetime(2025, 5, 23, 18, 0),
#         #     "coding_start": datetime(2025, 5, 24, 9, 0),
#         #     "coding_end": datetime(2025, 5, 24, 18, 0),
#         #     "interview_start": datetime(2025, 5, 25, 10, 0),
#         # },
#         # timings={
#         #     "resume_start": now + timedelta(minutes=1),
#         #     "resume_end": now + timedelta(minutes=2),
#         #     "coding_start": now + timedelta(minutes=3),
#         #     "coding_end": now + timedelta(minutes=4),
#         #     "interview_start": now + timedelta(minutes=5),
#         # },
#         timings={
#             "resume_start": now + timedelta(seconds=10),
#             "resume_end": now + timedelta(seconds=20),
#             "coding_start": now + timedelta(seconds=30),
#             "coding_end": now + timedelta(seconds=40),
#             "interview_start": now + timedelta(seconds=50),
#         },
#     )

#     # 🧪 For testing: wait 1 minute to see everything fire
#     try:
#         time.sleep(60)
#     except KeyboardInterrupt:
#         print("Interrupted.")
