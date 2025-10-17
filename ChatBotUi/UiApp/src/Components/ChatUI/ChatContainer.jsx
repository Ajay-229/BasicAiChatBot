import React from "react";
import {
  MainContainer,
  ChatContainer as CSChatContainer,
  MessageList,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import MessageBubble from "./MessageBubble";
import "../../styles/ChatContainer.css";

const ChatContainer = ({ messages, isTyping }) => {
  return (
    <div className="chat-container">
      <MainContainer>
        <CSChatContainer>
          <MessageList className="chat-scroll">
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.text,
                  sender: msg.sender === "user" ? "You" : "AI",
                  direction: msg.sender === "user" ? "outgoing" : "incoming",
                }}
              >
                <Message.CustomContent>
                  <MessageBubble sender={msg.sender} text={msg.text} />
                </Message.CustomContent>
              </Message>
            ))}
            {isTyping && (
              <TypingIndicator content="AI is typing..." />
            )}
          </MessageList>
        </CSChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatContainer;