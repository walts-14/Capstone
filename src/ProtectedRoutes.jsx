import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // ✅ Start as null

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    console.log("🔄 Checking token in ProtectedRoutes:", token);
    setIsAuthenticated(token ? true : false);
  }, []); // ✅ Run only once on mount

  if (isAuthenticated === null) return <p>Loading...</p>; // ⏳ Prevent infinite loop

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
