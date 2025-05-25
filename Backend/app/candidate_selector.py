# app/candidate_selector.py
from typing import List
import logging
from bson import ObjectId
from db import job_user_collection

logger = logging.getLogger(__name__)



async def select_top_candidates(job_id: str, percentage: float = 1.0) -> List[str]:
    """
    Select top candidates based on resume score
    Args:
        job_id: Job ID to filter candidates
        percentage: Percentage of top candidates to select (default 20%)
    Returns:
        List of user IDs for top candidates
    """

    print("\n\nSelecting top candidates for job:\n\n")

    try:
        # Get all applications for this job
        cursor = job_user_collection.find({"job_id": ObjectId(job_id)})
        applications = []
        async for doc in cursor:
            applications.append({
                "user_id": str(doc["user_id"]),
                "score": doc.get("resume_score", 2)
            })

        if not applications:
            logger.warning(f"No applications found for job {job_id}")
            return []

        # Sort by score in descending order
        applications.sort(key=lambda x: x["score"], reverse=True)

        # Select top percentage
        num_to_select = max(1, int(len(applications) * percentage))
        selected_candidates = applications[:num_to_select]

        # Extract user IDs of selected candidates
        selected_ids = [app["user_id"] for app in selected_candidates]

        logger.info(f"Selected {len(selected_ids)} candidates from {len(applications)} applications")
        return selected_ids

    except Exception as e:
        logger.error(f"Error selecting top candidates for job {job_id}: {e}")
        return []