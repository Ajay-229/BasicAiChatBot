// src/Utils/ChatApi.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/chat",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const chatApi = {
  cancelSource: null, // 🔄 store cancel token source

  // 🆕 Create session
  async createSession() {
    try {
      const res = await api.post("/new");
      return res.data.sessionId;
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      throw error;
    }
  },

  // 💬 Send message with cancel support
  async sendMessage(sessionId, messages) {
    try {
      this.cancelSource = axios.CancelToken.source();
      const res = await api.post(`/${sessionId}`, { messages }, { cancelToken: this.cancelSource.token });
      return res.data.reply;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("⚠️ Request cancelled by user.");
        return null;
      }
      console.error("❌ Failed to send message:", error);
      throw error;
    } finally {
      this.cancelSource = null;
    }
  },

  // ✋ Cancel AI request
  cancelMessage() {
    if (this.cancelSource) {
      this.cancelSource.cancel("User deleted the message during AI response.");
      this.cancelSource = null;
    }
  },

  async getSession(sessionId) {
    try {
      const res = await api.get(`/${sessionId}`);
      return res.data;
    } catch (error) {
      console.error("❌ Failed to fetch session:", error);
      throw error;
    }
  },

  async deleteSession(sessionId) {
    try {
      await api.delete(`/${sessionId}`);
    } catch (error) {
      console.error("❌ Failed to delete session:", error);
      throw error;
    }
  },
};