// src/Context/ChatContext.js
import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from "react";
import { saveMessages, loadMessages, clearMessages } from "../Utils/Session/ChatStorage";
import { chatApi } from "../Utils/Api/ChatApi";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // 🟩 New: editing states
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  // Keep ref to latest typing state
  const isTypingRef = useRef(isTyping);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  // Load from storage
  useEffect(() => {
    const stored = loadMessages();
    const normalized = stored.map((m) => (!m.id ? { ...m, id: uuidv4() } : m));
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

  // --- Existing Send Logic ---
  const handleSend = useCallback(
    async (userMessage) => {
      if (!userMessage || !userMessage.trim()) return;

      const userMsg = { id: uuidv4(), sender: "user", text: userMessage, createdAt: new Date().toISOString() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        saveMessages(next);
        return next;
      });

      try {
        setIsTyping(true);
        let activeSession = sessionId;
        if (!activeSession) activeSession = await createNewSession();

        const aiReply = await chatApi.sendMessage(activeSession, [{ role: "user", content: userMessage }]);
        if (aiReply === null) {
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

        setMessages((prev) => {
          const next = [...prev, aiMsg];
          saveMessages(next);
          return next;
        });
      } catch (error) {
        console.error("Backend error:", error);
        const fallback = {
          id: uuidv4(),
          sender: "ai",
          text: "⚠️ Could not reach AI service. Please try again.",
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

  // --- Delete Logic ---
  const handleDeleteMessage = useCallback((messageId) => {
    setMessages((prevMessages) => {
      const target = prevMessages.find((m) => m.id === messageId);
      if (!target) return prevMessages;
      let updated = [...prevMessages];

      if (target.sender === "user") {
        if (isTypingRef.current && updated[updated.length - 1].id === messageId) {
          chatApi.cancelMessage();
          setIsTyping(false);
        }
        updated = updated.filter((m) => m.id !== messageId && m.parentId !== messageId);
      } else if (target.sender === "ai" && target.parentId) {
        updated = updated.filter((m) => m.id !== target.id && m.id !== target.parentId);
      }

      saveMessages(updated);
      return updated;
    });
    setIsTyping(false);
  }, []);

  // --- 🟦 NEW: Edit Message Handlers ---
  const handleStartEdit = (messageId, text) => {
    setEditingMessageId(messageId);
    setEditText(text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    await handleSend(editText); // send as new message
    setEditingMessageId(null);
    setEditText("");
  };

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

        // 🟩 expose edit handlers and state
        editingMessageId,
        editText,
        setEditText,
        handleStartEdit,
        handleCancelEdit,
        handleSaveEdit,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);