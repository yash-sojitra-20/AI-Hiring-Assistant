import axios from "axios";

// Create an Axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Use Vite env variable
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for request/response if needed
api.interceptors.request.use(
  (config) => {
    // Example: Attach token if available
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default api;
