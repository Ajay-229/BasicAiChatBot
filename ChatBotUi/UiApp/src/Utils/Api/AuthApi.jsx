import { axiosInstance } from "./AxiosConfig";

// Helper to extract readable messages from Axios errors
function extractMessage(error) {
  if (!error) return "Unknown error";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return data.message || data.error || JSON.stringify(data);
  }
  return error.message || "Request failed";
}

export const AuthApi = {
  async signup({ username, firstName, lastName, email, password }) {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        username, firstName, lastName, email, password
      });
      return res.data;
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Signup failed:", msg);
      throw new Error(msg);
    }
  },

  async login({ emailOrUsername, password }) {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: emailOrUsername, password
      });
      return res.data;
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Login failed:", msg);
      throw new Error(msg);
    }
  },

  async checkUnique(field, value) {
    try {
      const res = await axiosInstance.get("/auth/check-unique", { params: { field, value } });
      return res.data; // { exists: true/false, message: "..." }
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Uniqueness check failed:", msg);
      return { exists: false, error: msg };
    }
  }
};