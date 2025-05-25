# # test_candidate_selector.py
# import asyncio
# from app.candidate_selector import select_top_candidates
#
# async def test_select_top_candidates():
#     # Replace with a valid job_id from your database
#     job_id = "683317de93ffda21261a5074"  # Example ObjectId
#     percentage = 0.5  # Select top 50% of candidates
#
#     # Call the function
#     selected_candidates = await select_top_candidates(job_id, percentage)
#
#     # Print the results
#     print("Selected Candidates:", selected_candidates)
#
# # Run the test
# if __name__ == "__main__":
#     asyncio.run(test_select_top_candidates())