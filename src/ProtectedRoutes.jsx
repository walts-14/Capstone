import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      console.log("📌 Token in ProtectedRoutes:", token); // Debugging
  
      if (!token) {
        console.log("🚫 No token found, redirecting...");
        setIsAuthenticated(false);
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:5000/api/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          console.log("✅ Token is valid in ProtectedRoutes");
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("❌ Token verification failed:", error.response?.data?.message || error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };
  
    verifyToken();
  }, []);
  

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
