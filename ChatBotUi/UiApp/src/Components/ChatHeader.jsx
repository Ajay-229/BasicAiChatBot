import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@carbon/icons-react";
import { FaUser, FaSignOutAlt, FaLock } from "react-icons/fa";
import { useUser } from "../Context/UserContext";
import { handleLogout } from "../Utils/LogoutHandler";
import "../styles/ChatHeader.css";

const ChatHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const onLogout = () => {
    handleLogout(logout, () => navigate("/"));
    setMenuOpen(false);
  };

  const goProfile = () => {
    navigate("/profile", { state: { from: "/chat" } });
    setMenuOpen(false);
  };

  const goLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const goSignup = () => {
    navigate("/signup");
    setMenuOpen(false);
  };

  return (
    <header className="chat-header">
      <div className="chat-header-inner">
        {/* Back Button */}
        <button onClick={() => navigate("/")} className="back-btn">
          <ArrowLeft size={20} />
          <span className="back-text">Back</span>
        </button>

        {/* Title */}
        <h1 className="chat-title">AI Chat Assistant</h1>

        {/* Profile Icon */}
        <div className="user-menu-container">
          <button className="user-menu-btn" onClick={toggleMenu}>
            <FaUser size={20} />
          </button>

          {menuOpen && (
            <div
              className="user-menu-modal-overlay"
              onClick={() => setMenuOpen(false)}
            >
              <div
                className="user-menu-modal"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                {user ? (
                  <>
                    <button onClick={goProfile}>
                      <FaUser style={{ marginRight: "8px" }} /> Profile
                    </button>
                    <button onClick={onLogout}>
                      <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={goLogin}>
                      <FaLock style={{ marginRight: "8px" }} /> Login
                    </button>
                    <button onClick={goSignup}>
                      <FaLock style={{ marginRight: "8px" }} /> Signup
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;