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
  role = "admin",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedGradeLocal, setSelectedGradeLocal] = useState("");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setSelectedGradeLocal("");
    fetchStudents();
    setShowLeaderboard(false);
    setActiveItem("dashboard");
    navigate("/admin");
    if (isMobile) setSidebarOpen(false);
  };

  const handleLeaderboardClick = () => {
    setShowLeaderboard(true);
    setActiveItem("leaderboard");
    if (isMobile) setSidebarOpen(false);
  };

  const handleGradeSelection = (grade) => {
    setSelectedGradeLocal(grade);
    setSelectedGrade(grade);
    fetchStudents(grade);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        style={{ display: isMobile && sidebarOpen ? "block" : "none" }}
      />

      {/* Sidebar - with holy-grail-sidebar parent class compatibility */}
      <div
        className={`left-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ height: "100%", width: "100%" }}
      >
        <h2
          style={{
            color: "#3A86D1",
            fontWeight: "bold",
            fontSize: isMobile ? "28px" : "50px",
            textAlign: "center",
            width: "100%",
            margin: "0 0 20px 0",
            paddingBottom: "10px",
            borderBottom: "2px solid #6c7294",
          }}
        >
          {String(role).toLowerCase() === "superadmin"
            ? "WeSign"
            : "WeSign"}
        </h2>
        <div className="sidebar-box">
          <div
            className={`sidebar-item ${
              activeItem === "dashboard" ? "active" : ""
            }`}
            onClick={handleDashboardClick}
          >
            <img src={DashboardIcon} alt="Dashboard" className="sidebar-icon img-icon" />
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
              className="sidebar-icon img-icon"
            />
            <span>Leaderboard</span>
          </div>
        </div>

        {/* Grade Selection Section */}
        {activeItem === "dashboard" && (
          <div className="levels">
            {[
              "Grade 7",
              "Grade 8",
              "Grade 9",
              "Grade 10",
              "Grade 11",
              "Grade 12",
            ].map((grade) => {
              const gradeClass = grade.replace(" ", "").toLowerCase();
              return (
                <div
                  key={grade}
                  className={`level-item ${gradeClass} ${
                    selectedGradeLocal === grade ? "active" : ""
                  }`}
                  onClick={() => handleGradeSelection(grade)}
                >
                  {grade.toUpperCase()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
