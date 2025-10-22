// src/Utils/Api/AuthApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api/auth",
  headers: { "Content-Type": "application/json" },
});

function extractMessageFromAxiosError(error) {
  // axios error shape: error.response?.data might be string or object
  if (!error) return "Unknown error";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    // common patterns: { message: "..." } or { error: "..."}
    return data.message || data.error || JSON.stringify(data);
  }
  // fallback to error.message or generic
  return error.message || "Request failed";
}

export const AuthApi = {
  // Signup with first & last name
  async signup({ username, firstName, lastName, email, password }) {
    try {
      const res = await api.post("/signup", {
        username,
        firstName,
        lastName,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("❌ Signup failed:", error);
      // normalize into an Error instance so frontend can read .message
      const msg = extractMessageFromAxiosError(error);
      throw new Error(msg);
    }
  },

  // Login via username OR email
  async login({ emailOrUsername, password }) {
    try {
      const res = await api.post("/login", {
        email: emailOrUsername,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("❌ Login failed:", error);
      const msg = extractMessageFromAxiosError(error);
      throw new Error(msg);
    }
  },

  // ✅ Check if email or username already exists
  async checkUnique(field, value) {
    try {
      const res = await api.get(`/check-unique?field=${field}&value=${value}`);
      return res.data; // { exists: true/false, message: "..." } expected
    } catch (error) {
      console.error("❌ Uniqueness check failed:", error);
      const msg = extractMessageFromAxiosError(error);
      // return a consistent object so frontend can show a reason
      return { exists: false, error: msg };
    }
  },
};