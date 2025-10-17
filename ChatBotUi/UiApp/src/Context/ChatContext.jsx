import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { saveMessages, loadMessages } from "../Utils/ChatStorage";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // 🧠 Load chat from sessionStorage
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

  // ✉️ Send message to backend and update messages
  const handleSend = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => {
      const updated = [...prev, { sender: "user", text: userMessage }];
      saveMessages(updated);
      return updated;
    });

    try {
      setIsTyping(true);
      const response = await axios.post("http://localhost:8080/api/chat", {
        message: userMessage,
      });
      const aiReply = response?.data?.reply || "No response from AI.";
      setMessages((prev) => {
        const updated = [...prev, { sender: "ai", text: aiReply }];
        saveMessages(updated);
        return updated;
      });
    } catch (err) {
      console.error("Backend error:", err);
      setMessages((prev) => {
        const updated = [
          ...prev,
          { sender: "ai", text: "⚠️ Could not reach AI service. Please try again." },
        ];
        saveMessages(updated);
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  }, []);

  // 🆕 Clear chat + storage
  const handleNewChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chatMessages");
  };

  return (
    <ChatContext.Provider value={{ messages, isTyping, handleSend, handleNewChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Hook for easy usage in components
export const useChat = () => useContext(ChatContext); 