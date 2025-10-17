import React, { useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    // Find the message list container rendered by the kit
    const messageListEl = document.querySelector(".custom-message-list");
    if (messageListEl) {
      // Always scroll to the latest message after render
      messageListEl.scrollTo({
        top: messageListEl.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      <MainContainer>
        <CSChatContainer>
          <MessageList
            typingIndicator={
              isTyping ? <TypingIndicator content="AI is typing..." /> : null
            }
            className="custom-message-list"
          >
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.text,
                  sender: msg.sender === "user" ? "You" : "AI",
                  direction:
                    msg.sender === "user" ? "outgoing" : "incoming",
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
