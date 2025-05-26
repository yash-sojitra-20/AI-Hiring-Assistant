import api from "./api";

// Job API calls

// Fetch all job listings
export const getAllJobs = async (userId) => {
  try {
    const response = await api.get(`/job/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Fetch a single job by ID
export const getJobById = async (jobId, userId) => {
  try {
    const response = await api.get(`/job/byJobId/${jobId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    throw error;
  }
};

// Create a new job (assuming this is for an admin/recruiter)
export const createJob = async (jobData) => {
  try {
    const response = await api.post("/jobs", jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const createFeedback = async (jobId, userId, feedbackData) => {
  try {
    console.log("........hello............");
    const response = await api.post(
      `/job/${jobId}/${userId}/score`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating feedback for job with ID ${jobId}:`, error);
    throw error;
  }
};

// Update a job by ID
export const updateJob = async (jobId, updateData) => {
  try {
    const response = await api.put(`/jobs/${jobId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${jobId}:`, error);
    throw error;
  }
};

// Delete a job by ID
export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job with ID ${jobId}:`, error);
    throw error;
  }
};
