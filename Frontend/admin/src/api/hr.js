import api from "./api";

// GET: Fetch all HR records
export const getAllHR = async () => {
  const response = await api.get("/hr");
  return response.data;
};

// GET: Fetch a single HR record by ID
export const getHRById = async (id) => {
  const response = await api.get(`/hr/${id}`);
  return response.data;
};

// POST: Create a new HR record
export const createHR = async (data) => {
  const response = await api.post("/hr/signup", data);
  return response.data;
};

// POST: HR Login (query string based)
export const loginHR = async ({ hr_email, hr_pass }) => {
  const response = await api.get(
    `/hr/login/?hr_email=${encodeURIComponent(
      hr_email
    )}&hr_pass=${encodeURIComponent(hr_pass)}`
  );
  return response.data;
};

// PUT: Update an existing HR record by ID
export const updateHR = async (id, data) => {
  const response = await api.put(`/hr/${id}`, data);
  return response.data;
};

// DELETE: Delete an HR record by ID
export const deleteHR = async (id) => {
  const response = await api.delete(`/hr/${id}`);
  return response.data;
};
