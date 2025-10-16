// src/Pages/Chat.jsx
import React from 'react';
import ChatHeader from "../Components/ChatUI/ChatHeader";
import ChatContainer from "../Components/ChatUI/ChatContainer";
import ChatFooter from "../Components/ChatUI/ChatFooter";
import "../styles/Chat.css";

export default function Chat() {
  const handleSend = (message) => {
    console.log("User sent:", message);
    // Later: integrate with backend (Phase 3)
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-page">
        <ChatHeader />
        <ChatContainer />
        <ChatFooter onSend={handleSend} />
      </div>
    </div>
  );
}