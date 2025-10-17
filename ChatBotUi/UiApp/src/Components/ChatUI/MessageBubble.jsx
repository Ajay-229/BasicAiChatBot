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
      <div className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        {/* ✅ Preserve formatting (newlines, tabs, spaces) */}
        <pre className="message-text">{text}</pre>
      </div>

      {/* ✅ Actions below bubble */}
      <div className={`message-actions ${isUser ? "user-actions" : "ai-actions"}`}>
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