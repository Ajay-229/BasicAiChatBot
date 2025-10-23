import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from "react";
import { saveMessages, loadMessages, clearMessages } from "../Utils/Session/ChatStorage";
import { ChatApi } from "../Utils/Api/ChatApi";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  const isTypingRef = useRef(isTyping);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);

  useEffect(() => {
    const stored = loadMessages();
    const normalized = stored.map(m => m.id ? m : { ...m, id: uuidv4() });
    if (normalized.length > 0) {
      setMessages(normalized);
      saveMessages(normalized);
    }
    const storedSession = sessionStorage.getItem("chatSessionId");
    if (storedSession) setSessionId(storedSession);
  }, []);

  const createNewSession = async () => {
    try {
      const newSessionId = await ChatApi.createSession();
      setSessionId(newSessionId);
      sessionStorage.setItem("chatSessionId", newSessionId);
      console.log("🆕 New session:", newSessionId);
      return newSessionId;
    } catch (error) {
      console.error("Session creation failed:", error.message);
      return null;
    }
  };

  const handleSend = useCallback(async (userMessage) => {
    if (!userMessage?.trim()) return;

    const userMsg = { id: uuidv4(), sender: "user", text: userMessage, createdAt: new Date().toISOString() };
    setMessages(prev => { const next = [...prev, userMsg]; saveMessages(next); return next; });

    try {
      setIsTyping(true);
      let activeSession = sessionId ?? await createNewSession();
      if (!activeSession) throw new Error("No chat session available");

      const aiReply = await ChatApi.sendMessage(activeSession, [{ role: "user", content: userMessage }]);
      if (aiReply === null) return;

      const aiMsg = { id: uuidv4(), sender: "ai", text: aiReply, createdAt: new Date().toISOString(), parentId: userMsg.id };
      setMessages(prev => { const next = [...prev, aiMsg]; saveMessages(next); return next; });

    } catch (error) {
      console.error("Backend error:", error.message);
      const fallback = { id: uuidv4(), sender: "ai", text: `⚠️ ${error.message}`, createdAt: new Date().toISOString() };
      setMessages(prev => { const next = [...prev, fallback]; saveMessages(next); return next; });
    } finally {
      setIsTyping(false);
    }
  }, [sessionId]);

  const handleDeleteMessage = useCallback((messageId) => {
    setMessages(prev => {
      const target = prev.find(m => m.id === messageId);
      if (!target) return prev;
      let updated = [...prev];
      if (target.sender === "user") {
        if (isTypingRef.current && updated[updated.length - 1].id === messageId) {
          ChatApi.cancelMessage();
          setIsTyping(false);
        }
        updated = updated.filter(m => m.id !== messageId && m.parentId !== messageId);
      } else if (target.sender === "ai" && target.parentId) {
        updated = updated.filter(m => m.id !== target.id && m.id !== target.parentId);
      }
      saveMessages(updated);
      return updated;
    });
    setIsTyping(false);
  }, []);

  const handleStartEdit = (messageId, text) => { setEditingMessageId(messageId); setEditText(text); };
  const handleCancelEdit = () => { setEditingMessageId(null); setEditText(""); };
  const handleSaveEdit = async () => { if (!editText.trim()) return; await handleSend(editText); setEditingMessageId(null); setEditText(""); };

  const handleNewChat = async () => {
    setMessages([]); saveMessages([]); clearMessages(); sessionStorage.removeItem("chatSessionId");
    const newSession = await createNewSession(); setSessionId(newSession);
  };

  return (
    <ChatContext.Provider value={{
      messages, isTyping, handleSend, handleNewChat, handleDeleteMessage,
      editingMessageId, editText, setEditText, handleStartEdit, handleCancelEdit, handleSaveEdit
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);