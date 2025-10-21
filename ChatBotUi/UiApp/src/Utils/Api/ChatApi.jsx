// src/Utils/ChatApi.jsx
import axios from "axios";

// 🌐 Base configuration
const api = axios.create({
  baseURL: "http://localhost:8080/api/chat",
  timeout: 10000, // ⏳ Prevent hanging requests
  headers: {
    "Content-Type": "application/json",
  },
});

// 🎯 Centralized API handler for all chat-related backend operations
export const chatApi = {
  // 🆕 Create a new chat session
  async createSession() {
    try {
      const res = await api.post("/new");
      return res.data.sessionId;
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      throw error;
    }
  },

  // 💬 Send message to backend for a specific session
  async sendMessage(sessionId, messages) {
    try {
      const res = await api.post(`/${sessionId}`, { messages });
      return res.data.reply;
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      throw error;
    }
  },

  // 📜 Fetch the complete chat history for a session
  async getSession(sessionId) {
    try {
      const res = await api.get(`/${sessionId}`);
      return res.data;
    } catch (error) {
      console.error("❌ Failed to fetch session:", error);
      throw error;
    }
  },

  // 🗑️ Delete a chat session (for "New Chat" or clear-all)
  async deleteSession(sessionId) {
    try {
      await api.delete(`/${sessionId}`);
    } catch (error) {
      console.error("❌ Failed to delete session:", error);
      throw error;
    }
  },
};