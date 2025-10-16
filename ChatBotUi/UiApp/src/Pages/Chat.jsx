import React from 'react';
import ChatHeader from "../Components/ChatUI/ChatHeader";
import ChatContainer from "../Components/ChatUI/ChatContainer";
import ChatFooter from "../Components/ChatUI/ChatFooter";
import "../styles/Chat.css";

export default function Chat() {
  return (
    <div className="chat-page">
      <ChatHeader />
      <ChatContainer />
      <ChatFooter />
    </div>
  );
}