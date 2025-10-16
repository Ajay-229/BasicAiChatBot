import React from "react";
import {
  MainContainer,
  ChatContainer as CSChatContainer,
  MessageList
} from "@chatscope/chat-ui-kit-react";

import MessageBubble from "./MessageBubble";
import "../../styles/ChatContainer.css";

const ChatContainer = () => {
  const messages = [
    { id: 1, sender: "ai", text: "Hello! How can I help you today?" },
    { id: 2, sender: "user", text: "Tell me more about your features." },
    { id: 3, sender: "ai", text: "Sure! I can assist with answers, ideas, and summaries." },
  ];

  return (
    <div className="chat-container">
      <MainContainer>
        <CSChatContainer>
          <MessageList className="chat-scroll">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} sender={msg.sender} text={msg.text} />
            ))}
          </MessageList>
        </CSChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatContainer;