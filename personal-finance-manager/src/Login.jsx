// src/Pages/Login.js

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

// 2. Accept '{ setIsLoggedIn }' as a prop from App.js
const Login = ({ setIsLoggedIn }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Default to Login mode
  const navigate = useNavigate(); // 3. Initialize the navigate function

  // 4. This function will run when the user tries to log in
  const handleLogin = (e) => {
    e.preventDefault(); // This stops the page from reloading

    // --- In a real app, you would verify email/password here ---

    console.log("Login successful!");
    setIsLoggedIn(true); // This sets the state in App.js
    navigate('/dashboard'); // This sends the user to the dashboard
  };

  // 5. This is a placeholder for your signup logic
  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup form submitted!");

    // --- In a real app, you would register the user here ---
    
    // For now, we'll just log them in and redirect after signup
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        background: "black",
        height: "100vh",
        color: "#00df9a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "120px",
      }}
    >
      <h2 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "30px" }}>
        {isLoginMode ? "Login" : "Sign Up"}
      </h2>

      {/* Tab buttons */}
      <div style={{ marginBottom: "40px" }}>
        <button
          onClick={() => setIsLoginMode(true)}
          style={{
            marginRight: "20px",
            padding: "12px 25px",
            fontSize: "1.1rem",
            background: isLoginMode ? "#00df9a" : "transparent",
            color: isLoginMode ? "black" : "#00df9a",
            border: "2px solid #00df9a",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setIsLoginMode(false)}
          style={{
            padding: "12px 25px",
            fontSize: "1.1rem",
            background: !isLoginMode ? "#00df9a" : "transparent",
            color: !isLoginMode ? "black" : "#00df9a",
            border: "2px solid #00df9a",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* 6. Replace the div with a real <form> tag */}
      <form 
        onSubmit={isLoginMode ? handleLogin : handleSignup} 
        style={{ width: "300px", textAlign: "left" }}
      >
        {/* Conditional "Name" and "Confirm Password" fields for Sign Up mode */}
        {!isLoginMode && (
          <>
            <label style={{ color: "white" }}>Name</label>
            <input type="text" placeholder="Enter your name" style={inputStyle} required />

            <label style={{ color: "white" }}>Email</label>
            <input type="email" placeholder="Enter your email" style={inputStyle} required />

            <label style={{ color: "white" }}>Password</label>
            <input type="password" placeholder="Enter your password" style={inputStyle} required />

            <label style={{ color: "white" }}>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" style={inputStyle} required />
          </>
        )}
        
        {/* Fields for Login mode */}
        {isLoginMode && (
          <>
            <label style={{ color: "white" }}>Email</label>
            <input type="email" placeholder="Enter your email" style={inputStyle} required />

            <label style={{ color: "white" }}>Password</label>
            <input type="password" placeholder="Enter your password" style={inputStyle} required />
          </>
        )}

        {/* 7. The submit button MUST have type="submit" */}
        <button
          type="submit"
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            fontSize: "1.1rem",
            background: "#00df9a",
            color: "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isLoginMode ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

// ... (your inputStyle and other styles remain the same)
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  marginTop: "4px",
  borderRadius: "6px",
  border: "1px solid #00df9a",
  background: "transparent",
  color: "white",
  fontSize: "1rem",
  outline: "none",
  caretColor: "#00df9a",
};
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(
    'input::placeholder { color: rgba(255, 255, 255, 0.5); }',
    styleSheet.cssRules.length
  );
}

export default Login;