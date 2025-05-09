import React from "react";
import { useLocation } from "react-router-dom";
import "../css/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dashboardlogo from "../assets/dashboardlogo.png";
import libicon from "../assets/libicon.png";
import leaderboardicon from "../assets/leaderboardicon.png";
import introhand from "../assets/introhand.png";
import settingsicon from "../assets/settingsicon.png";

function Sidenav() {
  const location = useLocation();

  return (
    <>
      <div className="logo fw-bold">
        <p>WeSign</p>
      </div>
      <div className="navbar-bg d-flex p-5">
        <nav className="sideNav d-flex flex-column fs-2 ">
          <div
            className={`dashboard ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <img
              src={dashboardlogo}
              className="img-fluid ms-5"
              alt="dashboard logo"
            />
            <a className="nav-link mb-5" href="/dashboard">
              Dashboard
            </a>
          </div>
          <div
            className={`library mt-4 p-2 pt-4 ${
              location.pathname === "/Library" ? "active" : ""
            }`}
          >
            <img src={libicon} className="img-fluid ms-5" alt="library logo" />
            <a className="nav-link mb-5" href="/Library">
              Library
            </a>
          </div>
          <div
            className={`leaderboard mt-4 ${
              location.pathname === "/leaderboard" ? "active" : ""
            }`}
          >
            <img
              src={leaderboardicon}
              className="img-fluid ms-5"
              alt="leaderboard logo"
            />
            <a className="nav-link mb-5" href="/leaderboard">
              Leaderboard
            </a>
          </div>
          <div
            className={`introduction mt-4 p-2 pt-4 ${
              location.pathname === "/introduction" ? "active" : ""
            }`}
          >
            <img
              src={introhand}
              className="img-fluid ms-5"
              alt="introduction logo"
            />
            <a className="nav-link mb-5" href="/introduction">
              Introduction
            </a>
          </div>
          <div
            className={`settings mt-4 ${
              location.pathname === "/settings" ? "active" : ""
            }`}
          >
            <img
              src={settingsicon}
              className="img-fluid ms-5"
              alt="settings logo"
            />
            <a className="nav-link mb-5" href="/settings">
              Settings
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidenav;
