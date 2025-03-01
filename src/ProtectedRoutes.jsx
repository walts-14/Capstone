import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = false; // Change this to true temporarily

  console.log("ProtectedRoutes Loaded"); 
  console.log("User Authenticated:", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
