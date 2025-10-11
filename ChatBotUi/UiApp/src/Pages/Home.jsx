import React from "react"
import { useNavigate } from "react-router-dom"
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate()
    const handleStartChat = () => {
        navigate("/chat");
    };

    return (
        <div className="home">
            <div className="home-content">
                <h1>Welcome to AI ChatBot</h1>
                <p>A simple chatbot powered by HuggingFace and Spring Boot backend.</p>

                <div className="home-buttons">
                    <button onClick={handleStartChat}>Start Chat</button>
                    <button disabled>Login</button>
                    <button disabled>Signup</button>
                </div>

                <footer className="footer">© 2025 AI ChatBot</footer>
            </div>
        </div>
    );
};

export default Home;