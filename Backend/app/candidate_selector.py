from typing import List
import logging
from bson import ObjectId
from db import job_user_collection

logger = logging.getLogger(__name__)

async def select_top_candidates(job_id: str, percentage: float = 1.0) -> List[str]:
    """
    Select top candidates based on resume score and update their status to shortlisted
    Args:
        job_id: Job ID to filter candidates
        percentage: Percentage of top candidates to select (default 100%)
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
                "score": doc.get("resume_score", 2),
                "_id": doc["_id"]  # Keep the document _id for updates
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

        # Update status to "shortlisted" for selected candidates
        selected_doc_ids = [app["_id"] for app in selected_candidates]

        # Bulk update operation
        update_result = await job_user_collection.update_many(
            {"_id": {"$in": selected_doc_ids}},
            {"$set": {"status": "shortlisted"}}
        )

        logger.info(f"Updated status for {update_result.modified_count} shortlisted candidates")

        # Optional: Update status to "not_selected" for non-selected candidates
        non_selected_doc_ids = [app["_id"] for app in applications[num_to_select:]]
        if non_selected_doc_ids:
            await job_user_collection.update_many(
                {"_id": {"$in": non_selected_doc_ids}},
                {"$set": {"status": "not_selected"}}
            )
            logger.info(f"Updated status for {len(non_selected_doc_ids)} non-selected candidates")

        logger.info(f"Selected {len(selected_ids)} candidates from {len(applications)} applications")
        return selected_ids

    except Exception as e:
        logger.error(f"Error selecting top candidates for job {job_id}: {e}")
        return []