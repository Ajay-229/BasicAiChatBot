import { axiosInstance } from "./AxiosConfig";

function extractMessage(error) {
  if (!error) return "Unknown error";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return data.message || data.error || JSON.stringify(data);
  }
  return error.message || "Request failed";
}

export const ChatApi = {
  cancelController: null,

  async createSession() {
    try {
      const res = await axiosInstance.post("/chat/new");
      if (res?.data?.sessionId) return res.data.sessionId;
      throw new Error("No sessionId returned from server");
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Create session failed:", msg);
      throw new Error(msg);
    }
  },

  async sendMessage(sessionId, messages) {
    if (!sessionId) throw new Error("sendMessage called without sessionId");

    const controller = new AbortController();
    this.cancelController = controller;
    const signal = controller.signal;
    const TIMEOUT_MS = 120000;
    let timeoutId;

    try {
      timeoutId = setTimeout(() => this.cancelController?.abort(), TIMEOUT_MS);
      const res = await axiosInstance.post(`/chat/${sessionId}`, { messages }, { signal });
      return res?.data?.reply ?? null;
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Send message failed:", msg);
      throw new Error(msg);
    } finally {
      clearTimeout(timeoutId);
      if (this.cancelController === controller) this.cancelController = null;
    }
  },

  cancelMessage() {
    if (this.cancelController) {
      try {
        this.cancelController.abort();
      } catch (e) {
        console.warn("Abort call threw:", e);
      }
      this.cancelController = null;
    }
  },

  async getSession(sessionId) {
    try {
      const res = await axiosInstance.get(`/chat/${sessionId}`);
      return res.data;
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Get session failed:", msg);
      throw new Error(msg);
    }
  },

  async deleteSession(sessionId) {
    try {
      await axiosInstance.delete(`/chat/${sessionId}`);
    } catch (error) {
      const msg = extractMessage(error);
      console.error("❌ Delete session failed:", msg);
      throw new Error(msg);
    }
  }
};