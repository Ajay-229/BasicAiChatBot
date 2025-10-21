import React, { useLayoutEffect, useRef } from "react";
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

  // ✅ Auto-scroll + layout fix
  useLayoutEffect(() => {
    const messageListEl = document.querySelector(".custom-message-list");

    if (messageListEl) {
      const wrapper = messageListEl.querySelector(".cs-message-list__scroll-wrapper");
      if (wrapper) {
        wrapper.style.height = "auto";
        wrapper.style.minHeight = "0";
        wrapper.style.maxHeight = "none";
        wrapper.style.overflow = "visible";
        wrapper.style.padding = "0";
        wrapper.style.margin = "0";
      }

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
            ref={messageListRef}
            typingIndicator={
              isTyping ? <TypingIndicator content="AI is typing..." /> : null
            }
            className="custom-message-list"
          >
            {messages.map((msg) => (
              <Message
                key={msg.id || msg.text} // ✅ use stable id
                model={{
                  message: msg.text,
                  sender: msg.sender === "user" ? "You" : "AI",
                  direction: msg.sender === "user" ? "outgoing" : "incoming",
                }}
              >
                <Message.CustomContent>
                  <MessageBubble id={msg.id} sender={msg.sender} text={msg.text} />
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