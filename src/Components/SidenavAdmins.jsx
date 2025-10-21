import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "../assets/dashboardlogo.png";
import LeaderboardIcon from "../assets/leaderboardicon.png";
import "../css/Admin.css";

const Sidebar = ({
  setSelectedGrade,
  fetchStudents,
  setShowLeaderboard,
  showLeaderboard,
  role = "admin", // new prop: "admin" or "superadmin"
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  // Set the initial active item based on showLeaderboard or pathname
  useEffect(() => {
    if (showLeaderboard) {
      setActiveItem("leaderboard");
    } else {
      setActiveItem("dashboard");
    }
  }, [showLeaderboard]);

  const handleDashboardClick = () => {
    setSelectedGrade("");
    fetchStudents();
    setShowLeaderboard(false);
    setActiveItem("dashboard");
    navigate("/admin");
  };

  const handleLeaderboardClick = () => {
    setShowLeaderboard(true);
    setActiveItem("leaderboard");
  };

  return (
    <>
      <div className="DashboardAdmin">
        <h2 style={{ color: "#2563eb", fontWeight: "bold" }}>
          {String(role).toLowerCase() === "superadmin" ? "Super Admin" : "Admin"}
        </h2>
      </div>
      <div className="left-sidebar">
        <div className="sidebar-box">
          <div
            className={`sidebar-item ${
              activeItem === "dashboard" ? "active" : ""
            }`}
            onClick={handleDashboardClick}
          >
            <img src={DashboardIcon} alt="Dashboard" className="sidebar-icon" />
            <span>Dashboard</span>
          </div>

          <div
            className={`sidebar-item ${
              activeItem === "leaderboard" ? "active" : ""
            }`}
            onClick={handleLeaderboardClick}
          >
            <img
              src={LeaderboardIcon}
              alt="Leaderboard"
              className="sidebar-icon"
            />
            <span>Leaderboard</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
