import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import dashboardlogo from "../assets/dashboardlogo.png";
import libicon from "../assets/libicon.png";
import leaderboardicon from "../assets/leaderboardicon.png";
import introhand from "../assets/introhand.png";
import settingsicon from "../assets/settingsicon.png";

function Sidenav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: dashboardlogo },
    { path: "/Library", label: "Library", icon: libicon },
    { path: "/leaderboard", label: "Leaderboard", icon: leaderboardicon },
    { path: "/introduction", label: "Introduction", icon: introhand },
    { path: "/settings", label: "Settings", icon: settingsicon },
  ];

  return (
    <>
      <div
        className={`fixed top-7 ${
          isMobile ? "left-4" : "left-12"
        } text-white font-bold ${isMobile ? "text-4xl" : "text-6xl"} z-20`}
        style={{ fontFamily: '"Baloo", sans-serif' }}
      >
        <p className="m-0">WeSign</p>
      </div>

      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed top-7 right-4 z-30 text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>
      )}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMenu}
        ></div>
      )}

      <div
        className={`fixed ${
          isMobile
            ? `top-0 left-0 h-full w-80 transform transition-transform duration-300 z-25 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "top-28 left-0 bottom-28 w-auto rounded-r-2xl"
        } text-center flex p-5`}
        style={{
          backgroundColor: "var(--purple)",
          height: isMobile ? "100vh" : "80vh",
          paddingTop: isMobile ? "5rem" : "1.25rem",
        }}
      >
        <nav
          className={`text-white flex flex-col w-full z-10 ${
            isMobile ? "gap-3" : "gap-4"
          }`}
          style={{ fontFamily: '"Baloo", sans-serif' }}
        >
          {menuItems.map((item, index) => (
            <div key={item.path}>
              <Link
                to={item.path}
                className="no-underline"
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`flex items-center justify-start relative ${
                    isMobile ? "h-14 sm:h-16" : "h-16 sm:h-18 md:h-20 lg:h-24"
                  } rounded-2xl transition-all duration-200 cursor-pointer ${
                    location.pathname === item.path ? "border-4" : ""
                  } ${
                    isMobile ? "px-3 sm:px-4" : "px-4 sm:px-6"
                  } overflow-hidden`}
                  style={{
                    backgroundColor:
                      location.pathname === item.path
                        ? "var(--semidark-purple)"
                        : "var(--purple)",
                    borderColor:
                      location.pathname === item.path
                        ? "var(--mid-purple)"
                        : "transparent",
                    marginLeft: isMobile ? "0" : "-2rem",
                    width: isMobile ? "100%" : "clamp(15vw, 18vw, 20vw)",
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor =
                        "var(--semidark-purple)";
                      e.currentTarget.style.borderWidth = "4px";
                      e.currentTarget.style.borderColor = "var(--mid-purple)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = "var(--purple)";
                      e.currentTarget.style.borderWidth = "0px";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <img
                    src={item.icon}
                    className={`${
                      isMobile
                        ? "w-6 h-6 min-w-[24px] min-h-[24px] sm:w-8 sm:h-8 sm:min-w-[32px] sm:min-h-[32px]"
                        : "w-8 h-8 min-w-[32px] min-h-[32px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] md:w-12 md:h-12 md:min-w-[48px] md:min-h-[48px]"
                    } flex-shrink-0 object-contain`}
                    alt={`${item.label.toLowerCase()} logo`}
                  />
                  <span
                    className={`text-white truncate flex-1 text-center ${
                      isMobile
                        ? "text-lg sm:text-xl ml-2 sm:ml-3"
                        : "text-xl sm:text-2xl md:text-3xl lg:text-4xl ml-3 sm:ml-4"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
              {index === 2 && !isMobile && <div className="h-4"></div>}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidenav;
