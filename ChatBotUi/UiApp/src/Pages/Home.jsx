import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaLock, FaUser, FaSignOutAlt } from "react-icons/fa";
import img1 from "../Assets/HomeImages/img1.jpg";
import img2 from "../Assets/HomeImages/img2.jpg";
import img3 from "../Assets/HomeImages/img3.jpg";
import img4 from "../Assets/HomeImages/img4.jpg";
import img5 from "../Assets/HomeImages/img5.jpg";
import StayLoggedOutPopup from "../Components/StayLoggedOutPopup";
import { useUser } from "../Context/UserContext";
import { handleLogout } from "../Utils/LogoutHandler";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [showPopup, setShowPopup] = useState(false);

  const images = [img1, img2, img3, img4, img5];
  const randomIndex = Math.floor(Math.random() * images.length);
  const bgImageUrl = images[randomIndex];

  const handleStartChat = () => {
    if (user) navigate("/chat");
    else setShowPopup(true);
  };

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");
  const handleProfile = () => {
    navigate("/profile", { state: { from: "/" } });
  };


  const handleLogoutClick = () => {
    handleLogout(logout, () => navigate("/"));
  };

  return (
    <div className="home" style={{ backgroundImage: `url(${bgImageUrl})` }}>
      <div className="home-content">
        <h1>Welcome to AI ChatBot</h1>
        <p>A simple chatbot powered by HuggingFace and Spring Boot backend.</p>

        <div className="home-buttons">
          <button className="animated-btn" onClick={handleStartChat}>
            <FaRocket style={{ marginRight: "8px" }} /> Start Chat
          </button>

          {!user && (
            <>
              <button onClick={handleLogin}>
                <FaLock style={{ marginRight: "8px" }} /> Login
              </button>
              <button onClick={handleSignup}>
                <FaLock style={{ marginRight: "8px" }} /> Signup
              </button>
            </>
          )}

          {user && (
            <>
              <button onClick={handleProfile}>
                <FaUser style={{ marginRight: "8px" }} /> Profile
              </button>
              <button onClick={handleLogoutClick}>
                <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
              </button>
            </>
          )}
        </div>

        <footer className="footer">© 2025 AI ChatBot</footer>
      </div>

      {!user && showPopup && (
        <StayLoggedOutPopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default Home;