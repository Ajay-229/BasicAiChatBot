import React from "react";
import ChatHeader from "../Components/ChatHeader";
import ChatContainer from "../Components/ChatUI/ChatContainer";
import ChatFooter from "../Components/ChatUI/ChatFooter";
import Sidebar from "../Components/Sidebar";
import { ChatProvider, useChat } from "../Context/ChatContext";
import "../styles/Chat.css";

// 🧩 Inner Chat UI (uses Context)
const ChatContent = () => {
  const { messages, isTyping, handleSend, handleNewChat } = useChat();

  return (
    <div className="chat-wrapper">
      <div className="chat-layout">
        <Sidebar onNewChat={handleNewChat} />
        <div className="chat-page">
          <ChatHeader />
          <ChatContainer messages={messages} isTyping={isTyping} />
          <ChatFooter onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

// 🧠 Wrap whole chat page in provider
export default function Chat() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
