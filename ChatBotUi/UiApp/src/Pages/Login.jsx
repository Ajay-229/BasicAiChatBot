import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../Utils/Api/AuthApi";
import { ArrowLeft, View, ViewOff } from "@carbon/icons-react";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const showAlert = (msg, duration = 4000) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthApi.login({ emailOrUsername, password });
      showAlert("✅ Login successful! Redirecting...");
      console.log("User data:", res);
      setTimeout(() => navigate("/chat"), 2000);
    } catch (err) {
      // Extract meaningful message
      const msg = err?.message || (typeof err === "string" ? err : "❌ Invalid credentials");
      showAlert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <button className="back-icon-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>

      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username or Email"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="eye-btn"
          >
            {showPassword ? <ViewOff size={20} /> : <View size={20} />}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don’t have an account?{" "}
        <a href="/signup" className="auth-link">
          Sign up here
        </a>
      </p>

      {alertMsg && (
        <div className="alert-popup">
          {alertMsg}
        </div>
      )}
    </div>
  );
};

export default Login;