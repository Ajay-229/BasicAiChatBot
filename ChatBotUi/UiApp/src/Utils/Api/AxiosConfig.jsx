import axios from "axios";

// Use proxy in dev or env variable in production
const BASE_URL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT only if user exists and token is valid
axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token && config.url.startsWith("/chat")) {
        config.headers["Authorization"] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);
    return Promise.reject(error);
  }
);