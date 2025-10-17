import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ChatHeader from "../Components/ChatUI/ChatHeader";
import ChatContainer from "../Components/ChatUI/ChatContainer";
import ChatFooter from "../Components/ChatUI/ChatFooter";
import Sidebar from "../Components/ChatUI/Sidebar";
import { saveMessages, loadMessages } from "../Utils/ChatStorage";
import "../styles/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // 🧠 Load chat from sessionStorage
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

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
    <div className="chat-wrapper">
      <div className="chat-layout">
        <Sidebar onNewChat={handleNewChat} />
        <div className="chat-page">
          <ChatHeader />
          <ChatContainer messages={messages} isTyping={isTyping} />
          <ChatFooter onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}