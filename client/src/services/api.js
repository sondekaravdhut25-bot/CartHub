import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxied to the backend in dev via vite.config.js
});

// Attach the JWT to every request automatically, if the user is logged in
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("kiln_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read `error.message`
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
