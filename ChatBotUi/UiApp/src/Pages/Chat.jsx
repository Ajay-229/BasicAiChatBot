// src/Pages/Chat.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ChatHeader from "../Components/ChatUI/ChatHeader";
import ChatContainer from "../Components/ChatUI/ChatContainer";
import ChatFooter from "../Components/ChatUI/ChatFooter";
import { saveMessages, loadMessages } from "../Utils/ChatStorage"; // 🆕 Import storage helpers
import "../styles/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]); // user + AI messages
  const [isTyping, setIsTyping] = useState(false);

  // 🧠 Load messages from sessionStorage when chat mounts
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

  /**
   * Handles sending a new message to backend + updating UI
   */
  const handleSend = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // 1️⃣ Add user message immediately
    setMessages((prev) => {
      const updated = [...prev, { sender: "user", text: userMessage }];
      saveMessages(updated); // 🧩 Save to sessionStorage
      return updated;
    });

    try {
      setIsTyping(true);

      // 2️⃣ Send to backend
      const response = await axios.post("http://localhost:8080/api/chat", {
        message: userMessage,
      });

      // 3️⃣ Add AI reply
      const aiReply = response?.data?.reply || "No response from AI.";
      setMessages((prev) => {
        const updated = [...prev, { sender: "ai", text: aiReply }];
        saveMessages(updated); // 🧩 Save after AI reply too
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

  return (
    <div className="chat-wrapper">
      <div className="chat-page">
        <ChatHeader />
        <ChatContainer messages={messages} isTyping={isTyping} />
        <ChatFooter onSend={handleSend} />
      </div>
    </div>
  );
}