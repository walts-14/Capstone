import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import SignupForm from "./Pages/Signup/SignupForm.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Library from "./Pages/Library/Library.jsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.jsx";
import IntermediateLibrary from "./Pages/Library/IntermediateLibrary.jsx";
import AdvancedLibrary from "./Pages/Library/AdvancedLibrary.jsx";
import Settings from "./Pages/Settings/Settings.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useUserStore } from "./handleUser/user";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useUserStore();
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/library" 
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/intermediatelibrary" 
          element={
            <ProtectedRoute>
              <IntermediateLibrary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/advancedlibrary" 
          element={
            <ProtectedRoute>
              <AdvancedLibrary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
