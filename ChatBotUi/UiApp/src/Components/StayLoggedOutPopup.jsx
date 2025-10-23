import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StayLoggedOutPopup.css";

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
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-window" onClick={(e) => e.stopPropagation()}>
        <h3>Start Chat</h3>
        <p>You’re currently not logged in.</p>

        <div className="popup-buttons">
          <button className="animated-btn" onClick={handleGoLogin}>Login</button>
          <button className="animated-btn" onClick={handleGoSignup}>Signup</button>
          <button className="animated-btn" onClick={handleStayLoggedOut}>Stay Logged Out</button>
        </div>

        <p className="popup-note">
          Chat won't be saved unless you log in.
        </p>
      </div>
    </div>
  );
};

export default StayLoggedOutPopup;