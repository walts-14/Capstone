import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import dashboardlogo from "../assets/dashboardlogo.png";
import libicon from "../assets/libicon.png";
import leaderboardicon from "../assets/leaderboardicon.png";
import introhand from "../assets/introhand.png";
import settingsicon from "../assets/settingsicon.png";

function Sidenav() {
  const location = useLocation();

  // State for hamburger menu open/close
  const [isOpen, setIsOpen] = useState(false);

  // State for burger menu mode (mobile & tablet < 1024)
  const [isBurgerMenuMode, setIsBurgerMenuMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Update burger menu mode on resize
  useEffect(() => {
    function handleResize() {
      setIsBurgerMenuMode(window.innerWidth < 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Normalize path: lowercase and remove trailing slash if exists (except root "/")
  function normalizePath(path) {
    if (!path) return "/";
    let p = path.toLowerCase();
    if (p.length > 1 && p.endsWith("/")) {
      p = p.slice(0, -1);
    }
    return p;
  }

  // Current normalized path
  const currentPath = normalizePath(location.pathname);

  // Define menu items with normalized paths
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: dashboardlogo },
    { path: "/library", label: "Library", icon: libicon },
    { path: "/leaderboard", label: "Leaderboard", icon: leaderboardicon },
    { path: "/introduction", label: "Introduction", icon: introhand },
    { path: "/settings", label: "Settings", icon: settingsicon },
  ];

  // Close hamburger menu when navigating on burger menu mode
  useEffect(() => {
    if (isBurgerMenuMode) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Toggle hamburger menu open/close
  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      {/* Logo - desktop/laptop */}
      <div
        className="fixed top-7 left-12 text-white font-bold text-6xl z-20 hidden md:block"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">WeSign</p>
      </div>
      {/* Logo - tablet (hidden on mobile only) */}
      <div
        className="fixed top-7 left-8 text-white font-bold text-5xl z-20 md:hidden sidenav-tablet-logo"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">W</p>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .sidenav-tablet-logo {
            display: none !important;
          }
        }
      `}</style>

      {/* Sidebar container - desktop/laptop */}
      <div
        className="fixed top-28 left-0 bottom-28 w-auto rounded-r-2xl flex text-center p-5 bg-[var(--purple)] h-[80vh] hidden md:flex"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <nav className="text-white flex flex-col w-full z-10 gap-4">
          {menuItems.map((item, idx) => {
            const normalizedItemPath = normalizePath(item.path);
            const isActive = currentPath === normalizedItemPath;
            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className={`flex items-center justify-start relative rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden h-16 sm:h-18 md:h-20 lg:h-24 px-4 sm:px-6 ${
                      isActive ? "border-4" : ""
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "var(--semidark-purple)"
                        : "var(--purple)",
                      borderColor: isActive
                        ? "var(--mid-purple)"
                        : "transparent",
                      marginLeft: "-2rem",
                      width: "clamp(15vw, 18vw, 20vw)",
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={`${item.label.toLowerCase()} logo`}
                      className="flex-shrink-0 object-contain w-8 h-8 min-w-[32px] min-h-[32px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] md:w-12 md:h-12 md:min-w-[48px] md:min-h-[48px]"
                    />
                    <span className="text-white truncate flex-1 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl ml-3 sm:ml-4">
                      {item.label}
                    </span>
                  </div>
                </Link>
                {idx === 2 && <div className="h-4" />}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Sidebar container - tablet only (icon vertical bar) */}
      <div
        className="fixed top-0 left-0 h-screen w-[6.5rem] bg-[var(--purple)] flex flex-col items-center pt-24 z-10 md:hidden sm:flex hidden"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <nav className="flex flex-col gap-10 items-center w-full mt-2">
          {menuItems.map((item, idx) => {
            const normalizedItemPath = normalizePath(item.path);
            const isActive = currentPath === normalizedItemPath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center w-full"
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`flex flex-col items-center justify-center w-full py-2 ${
                    isActive ? "bg-[var(--semidark-purple)] rounded-2xl" : ""
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={`${item.label.toLowerCase()} logo`}
                    className="w-12 h-12 mx-auto mb-1"
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar container - mobile (bottom bar) */}
      <div
        className="sidenav-mobile fixed bottom-0 left-0 w-full h-[6.5rem] bg-[var(--purple)] flex flex-row items-center justify-between px-2 z-20 sm:hidden"
        style={{ fontFamily: '"Baloo", sans-serif', transition: "all 0.3s" }}
      >
        <nav className="flex flex-row justify-between items-center w-full h-full">
          {menuItems.map((item, idx) => {
            const normalizedItemPath = normalizePath(item.path);
            const isActive = currentPath === normalizedItemPath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center h-full w-full"
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`flex flex-col items-center justify-center h-full w-full relative`}
                  style={{ transition: "background 0.3s" }}
                >
                  {isActive && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[var(--semidark-purple)] rounded-2xl"
                      style={{ width: "3.5rem", height: "3.5rem", zIndex: 1 }}
                    ></div>
                  )}
                  <img
                    src={item.icon}
                    alt={`${item.label.toLowerCase()} logo`}
                    className="w-10 h-10 mb-1 relative"
                    style={{ zIndex: 2 }}
                  />
                  {/* Hide label on mobile for minimal look */}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Responsive styles for smooth transition */}
      <style>{`
        @media (max-width: 640px) {
          .sidenav-mobile {
            display: flex !important;
            height: 6.5rem !important;
          }
        }
        @media (min-width: 641px) {
          .sidenav-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Sidenav;
