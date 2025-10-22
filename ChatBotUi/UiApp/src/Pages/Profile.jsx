// src/Pages/Profile.jsx
import React from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    // If no user, redirect to login
    navigate("/login");
    return null;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Profile Page (Dummy)</h2>
      <p>Welcome, <strong>{user.username}</strong>!</p>
      <p>Email: {user.email}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName || "-"}</p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Profile;