// src/Components/ChatUI/ChatFooter.jsx
import React, { useState } from "react";
import { Send } from "@carbon/icons-react";
import "../../styles/ChatFooter.css";

const ChatFooter = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  // Handle Enter key (send message)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow handler with compact reset
  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset first
    const maxHeight = window.innerHeight * 0.3; // 30% of viewport

    if (!textarea.value.trim()) {
      // When empty → reset to compact height
      textarea.style.height = "36px";
    } else {
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  };

  return (
    <footer className="chat-footer">
      <textarea
        className="chat-input"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <button className="send-btn" onClick={handleSend}>
        <Send size={20} />
      </button>
    </footer>
  );
};

export default ChatFooter;