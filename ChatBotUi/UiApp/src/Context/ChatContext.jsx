import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { saveMessages, loadMessages } from "../Utils/ChatStorage";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // 🧠 Load chat and sessionId from sessionStorage
  useEffect(() => {
    const storedMessages = loadMessages();
    const storedSession = sessionStorage.getItem("chatSessionId");

    if (storedMessages.length > 0) setMessages(storedMessages);
    if (storedSession) setSessionId(storedSession);
  }, []);

  // 🆕 Create new session
  const createNewSession = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/chat/new");
      const newSessionId = res.data.sessionId;
      setSessionId(newSessionId);
      sessionStorage.setItem("chatSessionId", newSessionId);
      console.log("🆕 New chat session:", newSessionId);
      return newSessionId;
    } catch (error) {
      console.error("Failed to create new chat session:", error);
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

        // Ensure sessionId exists
        let activeSession = sessionId;
        if (!activeSession) {
          activeSession = await createNewSession();
        }

        const formattedMessages = [{ role: "user", content: userMessage }];

        const response = await axios.post(
          `http://localhost:8080/api/chat/${activeSession}`,
          { messages: formattedMessages }
        );

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
    },
    [messages, sessionId]
  );

  // 🆕 New Chat logic
  const handleNewChat = async () => {
    // Remove old data
    setMessages([]);
    saveMessages([]);
    sessionStorage.removeItem("chatMessages");
    sessionStorage.removeItem("chatSessionId");

    // Ask backend for a fresh session
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