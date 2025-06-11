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
      {/* Logo */}
      <div
        className={`fixed top-7 ${
          isBurgerMenuMode ? "left-4" : "left-12"
        } text-white font-bold ${
          isBurgerMenuMode ? "text-4xl" : "text-6xl"
        } z-20`}
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">WeSign</p>
      </div>

      {/* Hamburger button visible only in burger menu mode */}
      {isBurgerMenuMode && (
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="fixed top-7 right-4 z-30 text-white focus:outline-none"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      )}

      {/* Overlay behind menu when open */}
      {isBurgerMenuMode && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <div
        className={`fixed ${
          isBurgerMenuMode
            ? `top-0 left-0 h-full w-80 z-25 transform transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "top-28 left-0 bottom-28 w-auto rounded-r-2xl"
        } flex text-center p-5`}
        style={{
          backgroundColor: "var(--purple)",
          height: isBurgerMenuMode ? "100vh" : "80vh",
          paddingTop: isBurgerMenuMode ? "5rem" : "1.25rem",
        }}
      >
        <nav
          className={`text-white flex flex-col w-full z-10 ${
            isBurgerMenuMode ? "gap-3" : "gap-4"
          }`}
          style={{ fontFamily: '"Baloo", sans-serif' }}
        >
          {menuItems.map((item, idx) => {
            const normalizedItemPath = normalizePath(item.path);
            const isActive = currentPath === normalizedItemPath;

            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="no-underline"
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    // Close menu on link click if in burger menu mode
                    if (isBurgerMenuMode) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <div
                    className={`flex items-center justify-start relative rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden ${
                      isBurgerMenuMode
                        ? "h-14 sm:h-16 px-3 sm:px-4"
                        : "h-16 sm:h-18 md:h-20 lg:h-24 px-4 sm:px-6"
                    } ${isActive ? "border-4" : ""}`}
                    style={{
                      backgroundColor: isActive
                        ? "var(--semidark-purple)"
                        : "var(--purple)",
                      borderColor: isActive
                        ? "var(--mid-purple)"
                        : "transparent",
                      marginLeft: isBurgerMenuMode ? "0" : "-2rem",
                      width: isBurgerMenuMode
                        ? "100%"
                        : "clamp(15vw, 18vw, 20vw)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor =
                          "var(--semidark-purple)";
                        e.currentTarget.style.borderWidth = "4px";
                        e.currentTarget.style.borderColor = "var(--mid-purple)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "var(--purple)";
                        e.currentTarget.style.borderWidth = "0px";
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={`${item.label.toLowerCase()} logo`}
                      className={`flex-shrink-0 object-contain ${
                        isBurgerMenuMode
                          ? "w-6 h-6 min-w-[24px] min-h-[24px] sm:w-8 sm:h-8 sm:min-w-[32px] sm:min-h-[32px]"
                          : "w-8 h-8 min-w-[32px] min-h-[32px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] md:w-12 md:h-12 md:min-w-[48px] md:min-h-[48px]"
                      }`}
                    />
                    <span
                      className={`text-white truncate flex-1 text-center ${
                        isBurgerMenuMode
                          ? "text-lg sm:text-xl ml-2 sm:ml-3"
                          : "text-xl sm:text-2xl md:text-3xl lg:text-4xl ml-3 sm:ml-4"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
                {/* Optional spacing after 3rd item (index 2) for desktop */}
                {idx === 2 && !isBurgerMenuMode && <div className="h-4" />}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidenav;
