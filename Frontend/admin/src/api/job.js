import api from "./api";

// GET: Fetch all jobs
export const getAllJobs = async (id) => {
  const response = await api.get(`/job/byHrId/${id}`);
  return response.data;
};

// GET: Fetch a single job by ID
export const getJobById = async (id) => {
  const response = await api.get(`/job/${id}`);
  return response.data;
};

// POST: Create a new job
export const createJob = async (data) => {
  const response = await api.post("/job/", data);
  return response.data;
};

// PUT: Update an existing job by ID
export const updateJob = async (id, data) => {
  const response = await api.put(`/job/${id}`, data);
  return response.data;
};

// DELETE: Delete a job by ID
export const deleteJob = async (id) => {
  const response = await api.delete(`/job/${id}`);
  return response.data;
};
