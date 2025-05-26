# import asyncio
# from app.candidate_selector_for_hr import shortlist_candidates_for_hr
#
# async def test_shortlist_candidates_for_hr():
#     """
#     Test the shortlist_candidates_for_hr function using asyncio.
#     """
#     # Mock inputs
#     job_id = "6833633503305ef4d8b1a9a8"  # Replace with a valid job_id from your database
#     percentage = 0.5  # Top 50% of candidates
#
#     # Call the function
#     shortlisted_users = await shortlist_candidates_for_hr(job_id, percentage)
#
#     # Assertions
#     assert isinstance(shortlisted_users, list), "The result should be a list"
#     assert all(isinstance(user_id, str) for user_id in shortlisted_users), "All user IDs should be strings"
#     print(f"Shortlisted User IDs: {shortlisted_users}")
#
# # Run the test
# if __name__ == "__main__":
#     asyncio.run(test_shortlist_candidates_for_hr())