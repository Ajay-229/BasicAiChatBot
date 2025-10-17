// src/Components/ChatUI/MessageBubble.jsx
import React from "react";
import { Copy as CopyIcon } from "@carbon/icons-react";
import "../../styles/MessageBubble.css";

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      <div className="message-bubble">
        <p>{text}</p>
      </div>

      {/* ✅ Action bar — one line for all icons */}
      <div className="message-actions">
        <div className="icon-wrapper">
          <button onClick={handleCopy} className="icon-btn">
            <CopyIcon size={16} />
            <span className="tooltip">Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;