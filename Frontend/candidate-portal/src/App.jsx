"use client";

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import CodingTest from "./pages/CodingTest";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("candidate");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        // If parsing fails, remove invalid candidate
        localStorage.removeItem("candidate");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("candidate", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("candidate");
    navigate("/");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hide Navbar on /coding-test/* route */}
      {!location.pathname.startsWith("/coding-test/") && (
        <Navbar user={user} onLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/dashboard" element={<JobListings />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/coding-test/:jobId" element={<CodingTest />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
