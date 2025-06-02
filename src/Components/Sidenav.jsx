import React from "react";
import { useLocation, Link } from "react-router-dom";
import dashboardlogo from "../assets/dashboardlogo.png";
import libicon from "../assets/libicon.png";
import leaderboardicon from "../assets/leaderboardicon.png";
import introhand from "../assets/introhand.png";
import settingsicon from "../assets/settingsicon.png";

function Sidenav() {
  const location = useLocation();

  return (
    <>
      {/* Logo */}
      <div
        className="fixed top-7 left-12 text-white font-bold text-6xl z-10"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">WeSign</p>
      </div>

      {/* Navbar Background */}
      <div
        className="fixed top-28 left-0 bottom-28 w-auto text-center rounded-r-2xl flex p-5"
        style={{
          backgroundColor: "var(--purple)",
          height: "80vh",
        }}
      >
        <nav
          className="text-white flex flex-col text-2xl w-full z-10"
          style={{ fontFamily: '"Baloo", sans-serif' }}
        >
          {/* Dashboard */}
          <div
            className={`flex justify-center items-center relative mb-4 pt-6 h-24 rounded-2xl transition-all duration-200 cursor-pointer ${
              location.pathname === "/dashboard" ? "border-4" : ""
            }`}
            style={{
              backgroundColor:
                location.pathname === "/dashboard"
                  ? "var(--semidark-purple)"
                  : "var(--purple)",
              borderColor:
                location.pathname === "/dashboard"
                  ? "var(--mid-purple)"
                  : "transparent",
              marginLeft: "-2rem",
              width: "clamp(18vw, 10vw, 15vw)",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/dashboard") {
                e.currentTarget.style.backgroundColor =
                  "var(--semidark-purple)";
                e.currentTarget.style.borderWidth = "4px";
                e.currentTarget.style.borderColor = "var(--mid-purple)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/dashboard") {
                e.currentTarget.style.backgroundColor = "var(--purple)";
                e.currentTarget.style.borderWidth = "0px";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <img
              src={dashboardlogo}
              className="absolute left-6 w-15 h-auto bottom-3.5"
              alt="dashboard logo"
            />
            <Link
              className="text-white no-underline pl-20 pb-3.5 text-4xl"
              to="/dashboard"
              style={{ textDecoration: "none" }}
            >
              Dashboard
            </Link>
          </div>

          {/* Library */}
          <div
            className={`flex justify-center items-center relative mb-4 pt-6 h-24 rounded-2xl transition-all duration-200 cursor-pointer ${
              location.pathname === "/Library" ? "border-4" : ""
            }`}
            style={{
              backgroundColor:
                location.pathname === "/Library"
                  ? "var(--semidark-purple)"
                  : "var(--purple)",
              borderColor:
                location.pathname === "/Library"
                  ? "var(--mid-purple)"
                  : "transparent",
              marginLeft: "-2rem",
              width: "clamp(18vw, 10vw, 15vw)",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/Library") {
                e.currentTarget.style.backgroundColor =
                  "var(--semidark-purple)";
                e.currentTarget.style.borderWidth = "4px";
                e.currentTarget.style.borderColor = "var(--mid-purple)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/Library") {
                e.currentTarget.style.backgroundColor = "var(--purple)";
                e.currentTarget.style.borderWidth = "0px";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <img
              src={libicon}
              className="absolute left-6 w-15 h-auto bottom-3.5"
              alt="library logo"
            />
            <Link
              className="text-white no-underline pl-8 pb-3.5 text-4xl"
              to="/Library"
              style={{ textDecoration: "none" }}
            >
              Library
            </Link>
          </div>

          {/* Leaderboard */}
          <div
            className={`flex justify-center items-center relative mb-0.5 pt-6 h-24 rounded-2xl transition-all duration-200 cursor-pointer ${
              location.pathname === "/leaderboard" ? "border-4" : ""
            }`}
            style={{
              backgroundColor:
                location.pathname === "/leaderboard"
                  ? "var(--semidark-purple)"
                  : "var(--purple)",
              borderColor:
                location.pathname === "/leaderboard"
                  ? "var(--mid-purple)"
                  : "transparent",
              marginLeft: "-2rem",
              width: "clamp(18vw, 10vw, 15vw)",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/leaderboard") {
                e.currentTarget.style.backgroundColor =
                  "var(--semidark-purple)";
                e.currentTarget.style.borderWidth = "4px";
                e.currentTarget.style.borderColor = "var(--mid-purple)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/leaderboard") {
                e.currentTarget.style.backgroundColor = "var(--purple)";
                e.currentTarget.style.borderWidth = "0px";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <img
              src={leaderboardicon}
              className="absolute left-6 w-15 h-auto bottom-3.5"
              alt="leaderboard logo"
            />
            <Link
              className="text-white no-underline pl-25 pb-3.5 text-4xl"
              to="/leaderboard"
              style={{ textDecoration: "none" }}
            >
              Leaderboard
            </Link>
          </div>

          {/* Introduction */}
          <div
            className={`flex justify-center items-center relative mb-4 pt-6 h-24 rounded-2xl transition-all duration-200 cursor-pointer ${
              location.pathname === "/introduction" ? "border-4" : ""
            }`}
            style={{
              backgroundColor:
                location.pathname === "/introduction"
                  ? "var(--semidark-purple)"
                  : "var(--purple)",
              borderColor:
                location.pathname === "/introduction"
                  ? "var(--mid-purple)"
                  : "transparent",
              marginLeft: "-2rem",
              marginTop: "1.5rem",
              width: "clamp(18vw, 10vw, 15vw)",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/introduction") {
                e.currentTarget.style.backgroundColor =
                  "var(--semidark-purple)";
                e.currentTarget.style.borderWidth = "4px";
                e.currentTarget.style.borderColor = "var(--mid-purple)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/introduction") {
                e.currentTarget.style.backgroundColor = "var(--purple)";
                e.currentTarget.style.borderWidth = "0px";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <img
              src={introhand}
              className="absolute left-6 w-15 h-auto bottom-3.5"
              alt="introduction logo"
            />
            <Link
              className="text-white no-underline pl-25 pb-3.5 text-4xl"
              to="/introduction"
              style={{ textDecoration: "none" }}
            >
              Introduction
            </Link>
          </div>

          {/* Settings */}
          <div
            className={`flex justify-center items-center relative mb-4 pt-6 h-24 rounded-2xl transition-all duration-200 cursor-pointer ${
              location.pathname === "/settings" ? "border-4" : ""
            }`}
            style={{
              backgroundColor:
                location.pathname === "/settings"
                  ? "var(--semidark-purple)"
                  : "var(--purple)",
              borderColor:
                location.pathname === "/settings"
                  ? "var(--mid-purple)"
                  : "transparent",
              marginLeft: "-2rem",
              width: "clamp(18vw, 10vw, 15vw)",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/settings") {
                e.currentTarget.style.backgroundColor =
                  "var(--semidark-purple)";
                e.currentTarget.style.borderWidth = "4px";
                e.currentTarget.style.borderColor = "var(--mid-purple)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/settings") {
                e.currentTarget.style.backgroundColor = "var(--purple)";
                e.currentTarget.style.borderWidth = "0px";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <img
              src={settingsicon}
              className="absolute left-6 w-15 h-auto bottom-3.5"
              alt="settings logo"
            />
            <Link
              className="text-white no-underline pl-14 pb-3.5 text-4xl"
              to="/settings"
              style={{ textDecoration: "none" }}
            >
              Settings
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidenav;
