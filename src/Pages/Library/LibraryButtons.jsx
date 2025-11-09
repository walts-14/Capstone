import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/LibraryButtons.css";
import { useLocation, useNavigate } from "react-router-dom";
import IntroductionModal from "../../Components/IntroductionModal";
function LibraryButtons({ forcedDifficulty }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentDifficulty = useMemo(() => {
    if (forcedDifficulty) return forcedDifficulty;
    const path = location.pathname.toLowerCase();
    if (path.includes("advanced")) return "Advanced";
    if (path.includes("intermediate")) return "Intermediate";
    return "Basic";
  }, [forcedDifficulty, location.pathname]);

  // Dynamic colors for select background per difficulty
  const selectBackgroundColor = useMemo(() => {
    if (currentDifficulty === "Advanced") return "var(--advance-red)";
    if (currentDifficulty === "Intermediate")
      return "var(--intermediate-yellow)";
    return "var(--basic-blue)";
  }, [currentDifficulty]);

  function handleDifficultyChange(e) {
    const value = e.target.value;
    if (value === "Basic") navigate("/BasicLibrary");
    else if (value === "Intermediate") navigate("/IntermediateLibrary");
    else if (value === "Advanced") navigate("/AdvancedLibrary");
  }
  return (
    <>
      <div className="library-contents">
        <IntroductionModal />
        {/* Mobile: dropdown, Desktop: buttons */}
        <div className="difficulty-select">
          <div className="library-difficulty-mobile">
            <select
              aria-label="Select difficulty"
              value={currentDifficulty}
              onChange={handleDifficultyChange}
              style={{ backgroundColor: selectBackgroundColor }}
            >
              <option value="Basic">BASIC</option>
              <option value="Intermediate">INTERMEDIATE</option>
              <option value="Advanced">ADVANCED</option>
            </select>
          </div>
          <div className="library-difficulty-desktop">
            <button
              className={`difficulty-btn ${
                currentDifficulty === "Basic" ? "active" : ""
              }`}
              style={{
                backgroundColor: "var(--basic-blue)",
                borderColor:
                  currentDifficulty === "Basic" ? "#A6DCFF" : "transparent",
              }}
              onClick={() => navigate("/BasicLibrary")}
            >
              BASIC
            </button>
            <button
              className={`difficulty-btn ${
                currentDifficulty === "Intermediate" ? "active" : ""
              }`}
              style={{
                backgroundColor: "var(--intermediate-yellow)",
                borderColor:
                  currentDifficulty === "Intermediate"
                    ? "#FFFEA6"
                    : "transparent",
              }}
              onClick={() => navigate("/IntermediateLibrary")}
            >
              INTERMEDIATE
            </button>
            <button
              className={`difficulty-btn ${
                currentDifficulty === "Advanced" ? "active" : ""
              }`}
              style={{
                backgroundColor: "var(--advance-red)",
                borderColor:
                  currentDifficulty === "Advanced" ? "#FF7D6F" : "transparent",
              }}
              onClick={() => navigate("/AdvancedLibrary")}
            >
              ADVANCE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default LibraryButtons;
