// src/Context/ChatContext.js
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { saveMessages, loadMessages } from "../Utils/ChatStorage";
import { chatApi } from "../Utils/Api/ChatApi";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // 🧠 Load chat + session from sessionStorage
  useEffect(() => {
    const storedMessages = loadMessages();
    const storedSession = sessionStorage.getItem("chatSessionId");

    if (storedMessages.length > 0) setMessages(storedMessages);
    if (storedSession) setSessionId(storedSession);
  }, []);

  // 🆕 Create new session
  const createNewSession = async () => {
    try {
      const newSessionId = await chatApi.createSession();
      setSessionId(newSessionId);
      sessionStorage.setItem("chatSessionId", newSessionId);
      console.log("🆕 New session:", newSessionId);
      return newSessionId;
    } catch (error) {
      console.error("Session creation failed:", error);
    }
  };

  // ✉️ Send message
  const handleSend = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return;

      const newMessages = [...messages, { sender: "user", text: userMessage }];
      setMessages(newMessages);
      saveMessages(newMessages);

      try {
        setIsTyping(true);

        // Ensure session exists
        let activeSession = sessionId;
        if (!activeSession) activeSession = await createNewSession();

        // Convert message to backend format
        const formattedMessages = [{ role: "user", content: userMessage }];

        // Call backend via chatApi
        const aiReply = await chatApi.sendMessage(activeSession, formattedMessages);

        const updated = [...newMessages, { sender: "ai", text: aiReply }];
        setMessages(updated);
        saveMessages(updated);
      } catch (error) {
        console.error("Backend error:", error);
        const fallback = [
          ...messages,
          { sender: "ai", text: "⚠️ Could not reach AI service. Please try again." },
        ];
        setMessages(fallback);
        saveMessages(fallback);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, sessionId]
  );

  // 🧹 New Chat
  const handleNewChat = async () => {
    setMessages([]);
    saveMessages([]);
    sessionStorage.removeItem("chatMessages");
    sessionStorage.removeItem("chatSessionId");

    const newSession = await createNewSession();
    setSessionId(newSession);
  };

  return (
    <ChatContext.Provider
      value={{ messages, isTyping, handleSend, handleNewChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);