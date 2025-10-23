import React from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { handleLogout } from "../Utils/LogoutHandler";

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    const origin = location.state?.from || "/";
    navigate(origin);
  };

  const handleLogoutClick = () => {
    handleLogout(logout, () => navigate("/", { replace: true }));
  };


  const goToSettings = () => {
    alert("Settings page coming soon!");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Profile Page</h2>
      <p>Welcome, <strong>{user.username}</strong>!</p>
      <p>Email: {user.email}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName || "-"}</p>

      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={goBack} style={buttonStyle}>Back</button>
        <button onClick={goToSettings} style={buttonStyle}>Settings</button>
        <button onClick={handleLogoutClick} style={buttonStyle}>Logout</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  borderRadius: "25px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  fontWeight: 600,
  transition: "background-color 0.3s ease",
};

export default Profile;