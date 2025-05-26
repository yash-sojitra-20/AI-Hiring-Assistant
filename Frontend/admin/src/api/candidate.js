import api from "./api";

// GET: Fetch all candidates
export const getAllCandidates = async (id) => {
  const response = await api.get(`/job-user/byJobId/${id}`);
  return response.data;
};

// GET: Fetch a single candidate by ID
export const getCandidateById = async (id) => {
  const response = await api.get(`/job-user/byId/${id}`);
  return response.data;
};

export const getCandidateResume = async (id) => {
  const response = await api.get(`/job-user/download/${id}`, {
    responseType: "blob",
  });
  return response.data;
};

// POST: Create a new candidate
export const createCandidate = async (data) => {
  const response = await api.post("/candidate", data);
  return response.data;
};

// PUT: Update an existing candidate by ID
export const updateCandidate = async (id, data) => {
  const response = await api.put(`/candidate/${id}`, data);
  return response.data;
};

// DELETE: Delete a candidate by ID
export const deleteCandidate = async (id) => {
  const response = await api.delete(`/candidate/${id}`);
  return response.data;
};
