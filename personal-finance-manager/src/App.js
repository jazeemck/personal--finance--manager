import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Import your pages and components
import Hero from "./Pages/Hero";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./components/Navbar";

// 2. Import your new Login and ProtectedRoute components
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // 3. This state will remember if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* --- Public Routes (Anyone can see) --- */}
        
        {/* Route 1: Your landing page */}
        <Route path="/" element={<Hero />} />

        {/* Route 2: Your login page */}
        {/* We pass setIsLoggedIn so the Login page can update the state */}
        <Route 
          path="/login" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />

        {/* --- Protected Route (Only logged-in users) --- */}
        
        {/* Route 3: Your dashboard page */}
        {/* It's wrapped in your ProtectedRoute component */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;