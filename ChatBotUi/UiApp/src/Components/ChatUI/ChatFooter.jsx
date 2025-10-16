import React, { useState } from "react";
import { MessageInput } from "@chatscope/chat-ui-kit-react";
import "../../styles/ChatFooter.css";

const ChatFooter = () => {
  const [message, setMessage] = useState("");

  const handleSend = (msg) => {
    if (!msg.trim()) return;
    console.log("Send:", msg); // Placeholder for backend call (Phase 3)
    setMessage("");
  };

  return (
    <footer className="chat-footer">
      <div className="footer-inner">
        <MessageInput
          placeholder="Type your message..."
          value={message}
          onChange={setMessage}
          onSend={handleSend}
          attachButton={false}     // hide file attach for now
          sendButton={true}        // show built-in send button
        />
      </div>
    </footer>
  );
};

export default ChatFooter;