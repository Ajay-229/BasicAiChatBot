import React, { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  Avatar,
  MessageInput
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import MainChatHeader from "./MainChatHeader";
import botAvatar from "../../Assets/botAvatar.png"
const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello! How can I assist you?",
      sender: "AI",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        message: text,
        sender: "user",
        direction: "outgoing"
      }
    ]);

    setIsTyping(true);

    try {
      // Call backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        {
          message: data.reply,
          sender: "AI",
          direction: "incoming"
        }
      ]);
    } catch (error) {
      // On error, add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          message: "Sorry, something went wrong.",
          sender: "AI",
          direction: "incoming"
        }
      ]);
      console.error("Error calling chat API:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <MainContainer>
      <MainChatHeader /> {/* Your custom global header */}

      <ChatContainer>
        <ConversationHeader>
          <Avatar src={botAvatar} name="AI Assistant" />
          <ConversationHeader.Content
            userName="AI Assistant"
            info={isTyping ? "Typing..." : "Online"}
          />
        </ConversationHeader>

        <MessageList typingIndicator={isTyping && <span>AI Assistant is typing...</span>}>
          {messages.map((msg, idx) => (
            <Message key={idx} model={msg} />
          ))}
        </MessageList>

        <MessageInput placeholder="Type a message..." onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  );
};

export default ChatBot;