import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../Utils/Api/AuthApi";
import { ArrowLeft, View, ViewOff } from "@carbon/icons-react";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const showAlert = (msg, duration = 4000) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), duration);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Check if username or email already exists (auto-validation with reason)
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if ((name === "username" || name === "email") && value.trim() !== "") {
      try {
        const response = await AuthApi.checkUnique(name, value);

        if (response.exists) {
          // Use server message if available
          showAlert(response.message || `❌ ${name === "username" ? "Username" : "Email"} already taken!`);
        } else if (response.error) {
          showAlert(`⚠️ ${response.error}`);
        }
      } catch (err) {
        console.error("Uniqueness check failed:", err);
        showAlert("⚠️ Couldn't verify uniqueness. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showAlert("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await AuthApi.signup(form);
      showAlert("✅ Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Extract meaningful message from thrown Error
      const msg = err?.message || (typeof err === "string" ? err : "❌ Signup failed");
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

      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name (Optional)"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
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

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <a href="/login" className="auth-link">
          Login here
        </a>
      </p>

      {alertMsg && <div className="alert-popup">{alertMsg}</div>}
    </div>
  );
};

export default Signup;