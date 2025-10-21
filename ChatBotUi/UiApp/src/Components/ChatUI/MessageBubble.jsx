// src/Components/ChatUI/MessageBubble.jsx
import React from "react";
import { Copy as CopyIcon, TrashCan as DeleteIcon } from "@carbon/icons-react";
import "../../styles/MessageBubble.css";
import { useChat } from "../../Context/ChatContext";

const MessageBubble = ({ id, sender, text }) => {
  const isUser = sender === "user";
  const { handleDeleteMessage } = useChat();

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
        <pre className="message-text">{text}</pre>
      </div>

      <div className={`message-actions ${isUser ? "user-actions" : "ai-actions"}`}>
        <div className="icon-wrapper">
          <button onClick={handleCopy} className="icon-btn">
            <CopyIcon size={16} />
            <span className="tooltip">Copy</span>
          </button>

          {/* Delete only for user messages; pass stable id */}
          {isUser && (
            <button onClick={() => handleDeleteMessage(id)} className="icon-btn delete-btn">
              <DeleteIcon size={16} />
              <span className="tooltip">Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;