// Key used in sessionStorage
const CHAT_KEY = "chatMessages";

// Save chat messages to sessionStorage
export const saveMessages = (messages) => {
  try {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};

// Load chat messages from sessionStorage
export const loadMessages = () => {
  try {
    const stored = sessionStorage.getItem(CHAT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

// Clear chat messages from sessionStorage
export const clearMessages = () => {
  try {
    sessionStorage.removeItem(CHAT_KEY);
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
};