import React from "react";

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempted");
    // Placeholder — will connect to backend later
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Signup;