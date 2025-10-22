import React from "react";
import { useNavigate } from "react-router-dom";

const StayLoggedOutPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleGoSignup = () => {
    onClose();
    navigate("/signup");
  };

  const handleStayLoggedOut = () => {
    onClose();
    navigate("/chat");
  };

  return (
    <div
      className="popup-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        className="popup-window"
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h3>Start Chat</h3>
        <p>You’re currently not logged in.</p>
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button onClick={handleGoLogin}>Login</button>
          <button onClick={handleGoSignup}>Signup</button>
          <button onClick={handleStayLoggedOut}>Stay Logged Out</button>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
          Chat won’t be saved unless you log in.
        </p>
      </div>
    </div>
  );
};

export default StayLoggedOutPopup;