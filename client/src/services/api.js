// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api", // proxied to the backend in dev via vite.config.js
// });

// // Attach the JWT to every request automatically, if the user is logged in
// api.interceptors.request.use((config) => {
//   const stored = localStorage.getItem("kiln_user");
//   if (stored) {
//     const { token } = JSON.parse(stored);
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Normalize error messages so components can just read `error.message`
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message = error.response?.data?.message || error.message || "Something went wrong";
//     return Promise.reject(new Error(message));
//   }
// );

// export default api;

import axios from "axios";

// In dev, Vite's proxy (vite.config.js) forwards "/api" to localhost:5000.
// That proxy does NOT exist in production — so once deployed, requests need
// an absolute URL to the deployed backend, set via VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({ baseURL });

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