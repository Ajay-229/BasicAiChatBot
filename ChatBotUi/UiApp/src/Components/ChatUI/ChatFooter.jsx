// src/Components/ChatUI/ChatFooter.jsx
import { React, useState, useRef } from "react";
import { Send } from "@carbon/icons-react";
import "../../styles/ChatFooter.css";

const ChatFooter = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "36px";
      }
    }
  };

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    const maxHeight = window.innerHeight * 0.3;
    textarea.style.height = textarea.value.trim()
      ? Math.min(textarea.scrollHeight, maxHeight) + "px"
      : "36px";
  };

  return (
    <footer className="chat-footer">
      <textarea
        ref={textareaRef}
        className="chat-input"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows={1}
      />
      <button className="send-btn" onClick={handleSend}>
        <Send size={20} />
      </button>
    </footer>
  );
};

export default ChatFooter;