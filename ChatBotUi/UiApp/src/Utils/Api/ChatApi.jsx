// src/Utils/ChatApi.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/chat",
  headers: { "Content-Type": "application/json" },
});

export const chatApi = {
  cancelController: null, // use AbortController instead of CancelToken

  // 🆕 Create new session
  async createSession() {
    try {
      const res = await api.post("/new");
      return res.data.sessionId;
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      throw error;
    }
  },

  // 💬 Send message (supports cancel + manual timeout)
  async sendMessage(sessionId, messages) {
    try {
      // create abort controller
      this.cancelController = new AbortController();
      const { signal } = this.cancelController;

      // ⏱ manual timeout: 2 minutes
      const timeout = setTimeout(() => {
        this.cancelController.abort("AI response took too long (2 min).");
      }, 120000);

      // make request
      const res = await api.post(`/${sessionId}`, { messages }, { signal });

      // clear timeout on success
      clearTimeout(timeout);

      return res.data.reply;
    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError") {
        console.warn("⚠️ Request cancelled or timed out:", error.message);
        return null;
      }
      console.error("❌ Failed to send message:", error);
      throw error;
    } finally {
      this.cancelController = null;
    }
  },

  // ✋ Cancel AI request manually
  cancelMessage() {
    if (this.cancelController) {
      this.cancelController.abort("User deleted message during AI response.");
      this.cancelController = null;
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