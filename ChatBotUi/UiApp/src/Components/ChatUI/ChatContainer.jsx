import React, { useEffect, useRef } from "react";
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
  const messageListRef = useRef(null);

  // 🧠 Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <MainContainer>
        <CSChatContainer>
          {/* ✅ MessageList itself is scrollable */}
          <MessageList
            ref={messageListRef}
            typingIndicator={
              isTyping ? <TypingIndicator content="AI is typing..." /> : null
            }
            className="chat-scroll"
          >
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
          </MessageList>
        </CSChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatContainer;