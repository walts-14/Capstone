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
    if (currentDifficulty === "Intermediate") return "var(--intermediate-yellow)";
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
        <div className="difficulty-select">
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
      </div>
    </>
  );
}
export default LibraryButtons;
