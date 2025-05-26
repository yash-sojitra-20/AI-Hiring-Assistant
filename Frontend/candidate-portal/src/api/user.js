import api from "./api";

// User API calls

// Create a new user (Signup)
export const createUser = async (userData) => {
  try {
    const response = await api.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    // Send credentials as query parameters
    const response = await api.get("/user/login/", { params: credentials });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Get user details by ID (or profile)
export const getUser = async (userId) => {
  try {
    // Assuming an endpoint like /users/:userId or /profile if authenticated
    const endpoint = userId ? `/users/${userId}` : "/profile";
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Update user details by ID (or profile)
export const updateUser = async (userId, updateData) => {
  try {
    // Assuming an endpoint like /users/:userId or /profile if authenticated
    const endpoint = userId ? `/users/${userId}` : "/profile";
    const response = await api.put(endpoint, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
