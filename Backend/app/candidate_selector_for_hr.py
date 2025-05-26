from typing import List
import logging
from bson import ObjectId
from db import job_user_collection

logger = logging.getLogger(__name__)

async def shortlist_candidates_for_hr(job_id: str, percentage: float = 1.0) -> List[str]:
    """
    Shortlist top candidates for HR based on resume score and update their status.
    Args:
        job_id: Job ID to filter candidates.
        percentage: Percentage of top candidates to shortlist (default 100%).
    Returns:
        List of user IDs for shortlisted candidates.
    """
    try:
        # Fetch all applications for the given job ID
        cursor = job_user_collection.find({"job_id": ObjectId(job_id)})
        applications = []
        async for doc in cursor:
            applications.append({
                "user_id": str(doc["user_id"]),
                "score": doc.get("resume_score", 0),
                "_id": doc["_id"]  # Keep the document _id for updates
            })

        if not applications:
            logger.warning(f"No applications found for job {job_id}")
            return []

        # Sort applications by score in descending order
        applications.sort(key=lambda x: x["score"], reverse=True)

        # Calculate the number of candidates to shortlist
        num_to_shortlist = max(1, int(len(applications) * percentage))
        shortlisted_candidates = applications[:num_to_shortlist]
        non_shortlisted_candidates = applications[num_to_shortlist:]

        # Update status for shortlisted candidates
        shortlisted_ids = [candidate["_id"] for candidate in shortlisted_candidates]
        if shortlisted_ids:
            await job_user_collection.update_many(
                {"_id": {"$in": shortlisted_ids}},
                {"$set": {"status": "shortlisted for HR"}}
            )
            logger.info(f"Shortlisted {len(shortlisted_ids)} candidates for HR")

        # Update status for non-shortlisted candidates
        non_shortlisted_ids = [candidate["_id"] for candidate in non_shortlisted_candidates]
        if non_shortlisted_ids:
            await job_user_collection.update_many(
                {"_id": {"$in": non_shortlisted_ids}},
                {"$set": {"status": "not shortlisted in HR"}}
            )
            logger.info(f"Marked {len(non_shortlisted_ids)} candidates as not shortlisted in HR")

        # Return the user IDs of shortlisted candidates
        return [candidate["user_id"] for candidate in shortlisted_candidates]

    except Exception as e:
        logger.error(f"Error shortlisting candidates for HR: {e}")
        return []