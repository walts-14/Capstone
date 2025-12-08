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
        className="fixed top-7 left-6 text-white font-bold text-6xl z-20 hidden lg:block"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">WeSign</p>
      </div>

      {/* Logo - tablet (visible from 640px to 1024px) */}
      <div
        className="fixed top-7 left-8 text-white font-bold text-5xl z-20 hidden md:block lg:hidden tablet-logo"
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">W</p>
      </div>

      {/* Sidebar container - desktop/laptop (only visible above 1024px) */}
      <div
  className="fixed top-28 left-0 bottom-28 rounded-r-4xl p-4 bg-[var(--purple)] h-[80vh] hidden lg:flex"
  style={{ fontFamily: '"Baloo", sans-serif' }}
>
  <nav className="text-white flex flex-col w-full z-10 gap-4">
    {menuItems.map((item, idx) => {
      const normalizedItemPath = normalizePath(item.path);
      const isActive = currentPath === normalizedItemPath;
      return (
        <div key={item.path}>
          <Link to={item.path} className="no-underline">
            <div
              className={`sidenav-item flex items-center gap-3 rounded-3xl cursor-pointer
                transition-all duration-300 transform
                ${isActive ? "bg-[var(--background)] border-4 border-[var(--mid-purple)]"
                           : "bg-[var(--purple)] border-transparent"}
                flex-none
                ${isActive ? "w-[20vw] ml-0 px-4 py-3" : "w-[20vw] ml-0 px-3 py-2"}
              `}
              style={{
                // inline clamp optional — remove this if using the w-[..] classes above
                // width: isActive ? "clamp(18vw,20vw,22vw)" : "clamp(10vw,12vw,14vw)",
              }}
            >
              <img
                src={item.icon}
                alt={`${item.label.toLowerCase()} logo`}
                className="flex-shrink-0 object-contain w-11 h-11"
              />
              <span className={`truncate text-3xl ${isActive ? "text-white" : "text-white"} text-left flex-1`}>
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

      {/* Sidebar container - tablet (visible from 640px to 1024px) */}
      <div
        className="fixed top-0 left-0 h-screen w-[6.5rem] bg-[var(--purple)] flex-col items-center pt-24 z-10 hidden md:flex lg:hidden tablet-sidenav"
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
                className={`flex flex-col items-center justify-center  w-[3.8rem] h-[3.8rem] py-2 ${
                    isActive ? "bg-[var(--mid-purple)] rounded-2xl" : ""
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

      {/* Sidebar container - mobile (bottom bar, only visible below 640px) */}
      <div
        className="sidenav-mobile fixed bottom-0 left-0 w-full h-full bg-[var(--purple)] flex flex-row items-center justify-between px-2 md:hidden"
        style={{
          fontFamily: '"Baloo", sans-serif',
          transition: "all 0.3s",
          zIndex: 2147483647,
        }}
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
                      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[var(--mid-purple)] rounded-2xl "
                      style={{ width: "3.2rem", height: "3.2rem", zIndex: 1 }}
                    ></div>
                  )}
                  <img
                    src={item.icon}
                    alt={`${item.label.toLowerCase()} logo`}
                    className="w-auto h-10 mb-1 relative"
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
        /* Tablet sidenav and logo - show between 640px-1024px */
        @media (max-width: 768px) {
          .tablet-sidenav {
            display: flex !important;
          }
          .tablet-logo {
            display: block !important;
          }
          .sidenav-mobile {
            display: none !important;
          }
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
          .tablet-sidenav {
            display: none !important;
          }
          .tablet-logo {
            display: none !important;
          }
          .sidenav-mobile {
            display: flex !important;
            height: 5rem !important;
            z-index: 9999 !important; /* ensure on top of content */
          }
        }
        
        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
          .tablet-sidenav {
            display: none !important;
          }
          .tablet-logo {
            display: none !important;
          }
          .sidenav-mobile {
            display: none !important;
          }
        }
        
        /* Smooth transitions for sidenav selection */
        .sidenav-item {
          will-change: transform, background-color, border-color, box-shadow;
        }

        .sidenav-item:hover {
          transform: translateX(6px);
        }

        .sidenav-item.active {
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }
      `}</style>
    </>
  );
}

export default Sidenav;
