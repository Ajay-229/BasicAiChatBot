import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaLock } from "react-icons/fa";
import img1 from '../Assets/HomeImages/img1.jpg';
import img2 from '../Assets/HomeImages/img2.jpg';
import img4 from '../Assets/HomeImages/img4.jpg';
import img3 from '../Assets/HomeImages/img3.jpg';
import img5 from '../Assets/HomeImages/img5.jpg'
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

const images = [img1, img2, img3, img4, img5];
const randomIndex = Math.floor(Math.random() * images.length);
const bgImageUrl = images[randomIndex];

  const handleStartChat = () => {
    navigate("/chat");
  };

  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
      }}
    >
      <div className="home-content">
        <h1>Welcome to AI ChatBot</h1>
        <p>A simple chatbot powered by HuggingFace and Spring Boot backend.</p>

        <div className="home-buttons">
          <button className="animated-btn" onClick={handleStartChat}>
            <FaRocket style={{ marginRight: "8px" }} /> Start Chat
          </button>
          <button disabled>
            <FaLock style={{ marginRight: "8px" }} /> Login
          </button>
          <button disabled>
            <FaLock style={{ marginRight: "8px" }} /> Signup
          </button>
        </div>

        <footer className="footer">© 2025 AI ChatBot</footer>
      </div>
    </div>
  );
};

export default Home;