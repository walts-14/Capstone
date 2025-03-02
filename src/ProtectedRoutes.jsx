import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = window.localStorage.getItem("loggedIn") === "true";

  console.log("ProtectedRoutes Loaded");
  console.log("User Authenticated:", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
