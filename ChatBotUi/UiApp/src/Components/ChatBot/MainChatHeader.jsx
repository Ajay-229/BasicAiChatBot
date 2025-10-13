// src/Components/ChatBot/MainChatHeader.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const MainChatHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="main-chat-header" style={{
      display: "flex",
      alignItems: "center",
      padding: "10px",
      background: "#eee",
      justifyContent: "space-between"
    }}>
      <button onClick={() => navigate("/")}>← Back</button>
      <h2>My AI Chat App</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button>⚙️</button>
      </div>
    </div>
  );
};

export default MainChatHeader;