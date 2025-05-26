// Utility to fetch job details for use in AIVoicePanel and CodingTest
import { getJobById } from "../api/job";

export const fetchJobDetails = async (jobId) => {
  let userId = null;
  const userString =
    localStorage.getItem("candidate") || localStorage.getItem("user");
  if (userString) {
    try {
      const user = JSON.parse(userString);
      userId = user.id;
    } catch (e) {}
  }
  if (!userId) return null;
  return await getJobById(jobId, userId);
};

// Existing function for CodingTest (kept for compatibility)
export const fetchCodingProblem = async (jobId) => {
  const job = await fetchJobDetails(jobId);
  if (job && job.problem_statements && job.problem_statements.length > 0) {
    return job.problem_statements[0];
  }
  return null;
};
