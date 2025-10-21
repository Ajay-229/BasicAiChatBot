// src/Context/ChatContext.js
import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from "react";
import { saveMessages, loadMessages, clearMessages } from "../Utils/ChatStorage";
import { chatApi } from "../Utils/Api/ChatApi";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Keep a ref to latest isTyping for safety inside callbacks
  const isTypingRef = useRef(isTyping);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  // Load messages from storage and ensure stable ids exist
  useEffect(() => {
    const stored = loadMessages();
    // If messages in storage don't have ids (older format), assign them
    const normalized = stored.map((m) => {
      if (!m.id) {
        // preserve possible parentId if present; otherwise add id
        return { ...m, id: uuidv4() };
      }
      return m;
    });

    if (normalized.length > 0) {
      setMessages(normalized);
      saveMessages(normalized);
    }

    const storedSession = sessionStorage.getItem("chatSessionId");
    if (storedSession) setSessionId(storedSession);
  }, []);

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

  // send a user message, create user message id, create AI reply with parentId
  const handleSend = useCallback(
    async (userMessage) => {
      if (!userMessage || !userMessage.trim()) return;

      // Build user message with stable id
      const userMsg = { id: uuidv4(), sender: "user", text: userMessage, createdAt: new Date().toISOString() };

      // Add user message immediately (functional update so we don't rely on captured 'messages')
      setMessages((prev) => {
        const next = [...prev, userMsg];
        saveMessages(next);
        return next;
      });

      try {
        setIsTyping(true);
        let activeSession = sessionId;
        if (!activeSession) activeSession = await createNewSession();
        // createCancelSource handled inside chatApi.sendMessage
        const formattedMessages = [{ role: "user", content: userMessage }];

        const aiReply = await chatApi.sendMessage(activeSession, formattedMessages);

        // If request was canceled, aiReply === null
        if (aiReply === null) {
          // request cancelled (delete likely already handled)
          setIsTyping(false);
          return;
        }

        const aiMsg = {
          id: uuidv4(),
          sender: "ai",
          text: aiReply,
          createdAt: new Date().toISOString(),
          parentId: userMsg.id,
        };

        // Append AI reply
        setMessages((prev) => {
          const next = [...prev, aiMsg];
          saveMessages(next);
          return next;
        });
      } catch (error) {
        console.error("Backend error:", error);
        // Append fallback AI error message after the user message
        const fallback = {
          id: uuidv4(),
          sender: "ai",
          text: "⚠️ Could not reach AI service. Please try again.",
          parentId: userMsg.id,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => {
          const next = [...prev, fallback];
          saveMessages(next);
          return next;
        });
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId]
  );

  // Delete by message id (stable)
  // Delete by message id (stable)
const handleDeleteMessage = useCallback(
  (messageId) => {
    setMessages((prevMessages) => {
      const target = prevMessages.find((m) => m.id === messageId);
      if (!target) return prevMessages;

      let updated = [...prevMessages];

      // 🟦 CASE 1: User message deletion
      if (target.sender === "user") {
        // If AI is typing a response for this user message
        if (isTypingRef.current && updated[updated.length - 1].id === messageId) {
          chatApi.cancelMessage(); // stops backend
          setIsTyping(false);      // stops typing indicator
        }

        // 🗑️ Delete the user message itself
        updated = updated.filter((m) => m.id !== messageId);

        // 🗑️ Also delete any AI reply with parentId === user message id
        updated = updated.filter((m) => m.parentId !== messageId);
      } 
      // 🟩 CASE 2: AI message deletion (edge case)
      else if (target.sender === "ai" && target.parentId) {
        // Delete both AI message and its linked user message
        updated = updated.filter(
          (m) => m.id !== target.id && m.id !== target.parentId
        );
      }

      saveMessages(updated); // persist updated list
      return updated;
    });

    setIsTyping(false); // safety reset
  },
  []
);

  const handleNewChat = async () => {
    setMessages([]);
    saveMessages([]);
    clearMessages();
    sessionStorage.removeItem("chatSessionId");

    const newSession = await createNewSession();
    setSessionId(newSession);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        handleSend,
        handleNewChat,
        handleDeleteMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);