import React from "react";
import { useLocation } from "react-router-dom";
import "../css/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidenav() {
  const location = useLocation();

  return (
    <>
      <div className="logo fw-bold">
        <p>We Sign</p>
      </div>
      <div className="navbar-bg d-flex p-5">
        <nav className="sideNav d-flex flex-column fs-2 ">
          <div
            className={`dashboard ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <a className="nav-link mb-5" href="/dashboard">
              Dashboard
            </a>
          </div>
          <div
            className={`library mt-4 p-2 pt-4 ${
              location.pathname === "/Library" ? "active" : ""
            }`}
          >
            <a className="nav-link mb-5" href="/Library">
              Library
            </a>
          </div>
          <div
            className={`leaderboard mt-4 ${
              location.pathname === "/leaderboard" ? "active" : ""
            }`}
          >
            <a className="nav-link mb-5" href="/leaderboard">
              Leaderboard
            </a>
          </div>
          <div
            className={`settings mt-4 ${
              location.pathname === "/settings" ? "active" : ""
            }`}
          >
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
