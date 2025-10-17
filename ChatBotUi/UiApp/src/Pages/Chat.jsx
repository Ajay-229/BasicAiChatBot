import React, { useState, useCallback } from "react";
import axios from "axios";
import ChatHeader from "../Components/ChatUI/ChatHeader";
import ChatContainer from "../Components/ChatUI/ChatContainer";
import ChatFooter from "../Components/ChatUI/ChatFooter";
import "../styles/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]); // user + AI messages
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Handles sending a new message to backend + updating UI
   */
  const handleSend = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // 1️⃣ Add user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      setIsTyping(true);

      // 2️⃣ Send to backend
      const response = await axios.post("http://localhost:8080/api/chat", {
        message: userMessage,
      });

      // 3️⃣ Add AI reply
      const aiReply = response?.data?.reply || "No response from AI.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error("Backend error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Could not reach AI service. Please try again.",
        },
      ]);
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
