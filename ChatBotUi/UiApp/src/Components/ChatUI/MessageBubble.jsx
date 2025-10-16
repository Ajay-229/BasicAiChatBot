import React from "react";
import "../../styles/MessageBubble.css";

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      <div className="message-bubble">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;