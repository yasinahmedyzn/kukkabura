import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change this if your API URL is different
});

// Always set Authorization header if token exists
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Optional: Add interceptor to refresh token dynamically on every request
api.interceptors.request.use(
  (config) => {
    const freshToken = localStorage.getItem("token");
    if (freshToken) {
      config.headers.Authorization = `Bearer ${freshToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
