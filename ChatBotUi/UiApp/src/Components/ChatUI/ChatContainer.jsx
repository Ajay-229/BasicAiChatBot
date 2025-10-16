import React from "react";
import {
  MainContainer,
  ChatContainer as CSChatContainer,
  MessageList,
  Message
} from "@chatscope/chat-ui-kit-react";

import MessageBubble from "./MessageBubble";
import "../../styles/ChatContainer.css";

/**
 * ChatContainer
 * - Uses MessageList -> Message (valid children)
 * - Puts custom bubble JSX inside Message via Message.CustomContent (kit supports custom content)
 * - Keeps the messages array simple; later this will be fed from state/backend
 */
const ChatContainer = () => {
  const messages = [
    { id: 1, sender: "ai", text: "Hello! How can I help you today?", time: "09:00" },
    { id: 2, sender: "user", text: "Tell me more about your features.", time: "09:01" },
    { id: 3, sender: "ai", text: "Sure! I can assist with answers, ideas, and summaries.", time: "09:02" },
  ];

  return (
    <div className="chat-container">
      <MainContainer>
        <CSChatContainer>
          <MessageList className="chat-scroll">
            {messages.map((msg) => (
              <Message
                key={msg.id}
                model={{
                  message: msg.text,
                  sentTime: msg.time,
                  sender: msg.sender === "user" ? "You" : "AI",
                  direction: msg.sender === "user" ? "outgoing" : "incoming"
                }}
              >
                {/* Use kit's custom content slot to render your styled bubble */}
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