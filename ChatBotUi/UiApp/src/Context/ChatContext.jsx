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

  // ✉️ Send message + entire history to backend
  const handleSend = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message to local state immediately
    const newMessages = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    setMessages(newMessages);
    saveMessages(newMessages);

    try {
      setIsTyping(true);

      // 🧩 Convert messages to API format for Hugging Face
      const formattedMessages = newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // 🚀 Send the entire message history
      const response = await axios.post("http://localhost:8080/api/chat", {
        messages: formattedMessages,
      });

      const aiReply = response?.data?.reply || "No response from AI.";

      const updated = [...newMessages, { sender: "ai", text: aiReply }];
      setMessages(updated);
      saveMessages(updated);
    } catch (err) {
      console.error("Backend error:", err);
      const fallback = [
        ...messages,
        { sender: "ai", text: "⚠️ Could not reach AI service. Please try again." },
      ];
      setMessages(fallback);
      saveMessages(fallback);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

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