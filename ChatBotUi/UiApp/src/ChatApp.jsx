// src/ChatApp.jsx
import React, { useState } from 'react';
import { ChatContainer, MessageList, Message, MessageInput, ConversationHeader } from '@chatscope/chat-ui-kit-react';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'; // Don't forget to import the styles!

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, how can I assist you?",
      sender: "chatbot",
      direction: "incoming",
      position: "single"
    }
  ]);

  const handleSendMessage = (message) => {
    setMessages([
      ...messages,
      { message, sender: "user", direction: "outgoing", position: "single" }
    ]);
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <ChatContainer>
        <ConversationHeader>
          <ConversationHeader.Back />
          <ConversationHeader.Content userName="ChatBot" info="Online" />
        </ConversationHeader>
        <MessageList>
          {messages.map((msg, index) => (
            <Message key={index} model={msg} />
          ))}
        </MessageList>
        <MessageInput placeholder="Type a message..." onSend={handleSendMessage} />
      </ChatContainer>
    </div>
  );
};

export default ChatApp;