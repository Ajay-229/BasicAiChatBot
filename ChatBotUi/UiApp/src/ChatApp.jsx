// src/ChatApp.jsx
import React, { useState } from 'react';
import { ChatContainer, MessageList, Message, MessageInput, ConversationHeader } from '@chatscope/chat-ui-kit-react';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, how can I assist you?",
      sender: "chatbot",
      direction: "incoming",
      position: "single"
    }
  ]);

  const handleSendMessage = async (message) => {
    // Add user message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { message, sender: "user", direction: "outgoing", position: "single" }
    ]);

  console.log(message);

    try {
      // Send user message to backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      // Add AI reply message
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.reply, sender: "chatbot", direction: "incoming", position: "single" }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally add an error message to chat UI
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: "Sorry, something went wrong.", sender: "chatbot", direction: "incoming", position: "single" }
      ]);
    }
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