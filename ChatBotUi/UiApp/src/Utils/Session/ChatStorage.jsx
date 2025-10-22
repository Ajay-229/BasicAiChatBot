// src/Utils/ChatStorage.js
import { v4 as uuidv4 } from "uuid";

const CHAT_KEY = "chatMessages";

// ✅ Save chat messages to sessionStorage
export const saveMessages = (messages) => {
  try {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};

// ✅ Load chat messages (and ensure each has a stable id)
export const loadMessages = () => {
  try {
    const stored = sessionStorage.getItem(CHAT_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // add missing ids for older stored messages
    const normalized = parsed.map((msg) =>
      msg.id ? msg : { ...msg, id: uuidv4() }
    );

    // re-save after normalization (so ids persist)
    saveMessages(normalized);
    return normalized;
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

// ✅ Clear chat messages
export const clearMessages = () => {
  try {
    sessionStorage.removeItem(CHAT_KEY);
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
};