import React from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate("/login");
    return null;
  }

  const goBack = () => {
    // Use state.from if exists, else default to "/"
    const origin = location.state?.from || "/";
    navigate(origin);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Profile Page (Dummy)</h2>
      <p>Welcome, <strong>{user.username}</strong>!</p>
      <p>Email: {user.email}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName || "-"}</p>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Profile;