// src/Components/ChatUI/ChatHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "@carbon/icons-react";
import "../styles/ChatHeader.css";

const ChatHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="chat-header">
      <div className="chat-header-inner">
        {/* Back Button */}
        <button onClick={() => navigate("/")} className="back-btn">
          <ArrowLeft size={20} />
          <span className="back-text">Back</span>
        </button>

        {/* Title */}
        <h1 className="chat-title">AI Chat Assistant</h1>

        {/* Settings Button */}
        <button className="settings-btn">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;