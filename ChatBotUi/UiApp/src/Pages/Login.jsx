import React from "react";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted");
    // Placeholder — will connect to backend later
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;