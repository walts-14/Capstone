import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "../assets/dashboardlogo.png";
import LeaderboardIcon from "../assets/leaderboardicon.png";
import "../css/Admin.css";

const Sidebar = ({ setSelectedGrade, fetchStudents, setShowLeaderboard }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="DashboardAdmin">
        <h2>Dashboard</h2>
      </div>
      <div className="left-sidebar">
        <div className="sidebar-box">
          <div
            className={`sidebar-item ${
              location.pathname === "/admin" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedGrade("");
              fetchStudents();
              setShowLeaderboard(false);
              navigate("/admin");
            }}
          >
            <img src={DashboardIcon} alt="Dashboard" className="sidebar-icon" />
            <span>Dashboard</span>
          </div>

          <div
            className={`sidebar-item ${
              location.pathname === "/leaderboard" ? "active" : ""
            }`}
            onClick={() => setShowLeaderboard(true)}
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
