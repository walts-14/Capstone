import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      console.log("📌 Token in ProtectedRoutes:", token);

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
          const role = response.data.user.role;
          console.log("✅ Token valid. Role:", role);
          setUserRole(role);
          localStorage.setItem("userRole", role);
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
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner-border text-primary" role="status" aria-label="Loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const path = location.pathname;

  // 🛑 SUPER ADMIN can ONLY access /superadmin
  if (userRole === "super_admin" && path !== "/superadmin") {
    return <Navigate to="/superadmin" replace />;
  }

  // 🛑 ADMIN can ONLY access /admin
  if (userRole === "admin" && path !== "/admin") {
    return <Navigate to="/admin" replace />;
  }

  // 🛑 REGULAR USERS can NOT access /admin or /superadmin
  if (userRole !== "admin" && userRole !== "super_admin") {
    if (path === "/admin" || path === "/superadmin") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
