import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import { ProgressContext } from "./ProgressContext.jsx";

// Helper function to calculate lesson progress
const calculateProgress = (progressObj = {}) => {
  let score = 0;
  if (progressObj.step1Lecture) score += 25;
  if (progressObj.step1Quiz) score += 25;
  if (progressObj.step2Lecture) score += 25;
  if (progressObj.step2Quiz) score += 25;
  return score;
};

const lessonsByLevel = {
  basic: ["termsone", "termstwo", "termsthree", "termsfour"],
  intermediate: ["termsfive", "termssix", "termsseven", "termseight"],
  advanced: ["termsnine", "termsten", "termseleven", "termstwelve"],
};

function LessonButtons() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("BASIC");
  const [lives, setLives] = useState(0);
  const { points: ctxPoints } = useContext(ProgressContext);
  const points = typeof ctxPoints === "number" ? ctxPoints : 0;
  const [unlockedLessons, setUnlockedLessons] = useState([1]);
  const buttonContainerRef = useRef(null);
  const { progressData } = useContext(ProgressContext);

  const difficultyColors = {
    BASIC: "#579ecd",
    INTERMEDIATE: "#dcbc3d",
    ADVANCED: "#C0392B",
  };

  const strokeColors = {
    BASIC: "#A6DCFF",
    INTERMEDIATE: "#FFFEA6",
    ADVANCED: "#FF7D6F",
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = buttonContainerRef.current;
      if (!container) return;

      // Use viewport coordinates so this works regardless of container offsetParent
      const containerRect = container.getBoundingClientRect();
      const lookY = containerRect.top + container.clientHeight / 3; // a point 1/3 down the container

      const tiles = Array.from(container.querySelectorAll(".lesson-tile"));
      if (!tiles.length) return;

      let activeIndex = 0;
      for (let i = 0; i < tiles.length; i++) {
        const tRect = tiles[i].getBoundingClientRect();
        if (tRect.top <= lookY && tRect.bottom >= lookY) {
          activeIndex = i;
          break;
        }
      }

      // Fallback: pick first tile that appears below the top edge
      if (activeIndex === 0) {
        for (let i = 0; i < tiles.length; i++) {
          const tRect = tiles[i].getBoundingClientRect();
          if (tRect.top >= containerRect.top - 1) {
            activeIndex = i;
            break;
          }
        }
      }

      const lessonId = activeIndex + 1; // tiles correspond to lessons 1..12
      let currentDifficulty = "BASIC";
      if (lessonId >= 5 && lessonId <= 8) currentDifficulty = "INTERMEDIATE";
      else if (lessonId >= 9) currentDifficulty = "ADVANCED";

      setDifficulty(currentDifficulty);
    };

    const container = buttonContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      // run once to initialize
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Determine which lessons are unlocked based on progress data
  useEffect(() => {
    if (!progressData) return;

    const unlockedLessonIds = [1];
    const termToLessonId = {};
    let idCounter = 1;

    for (const level of ["basic", "intermediate", "advanced"]) {
      for (const term of lessonsByLevel[level]) {
        termToLessonId[term] = idCounter++;
      }
    }

    let allPreviousComplete = true;

    for (let lessonId = 1; lessonId < 12; lessonId++) {
      const termId = Object.keys(termToLessonId).find(
        (term) => termToLessonId[term] === lessonId
      );

      if (!termId) continue;

      let level;
      for (const l of ["basic", "intermediate", "advanced"]) {
        if (lessonsByLevel[l].includes(termId)) {
          level = l;
          break;
        }
      }

      if (!level) continue;

      const currentLessonProgress = progressData[level]?.[termId] || {};
      const completionPercent = calculateProgress(currentLessonProgress);

      if (allPreviousComplete) {
        unlockedLessonIds.push(lessonId);

        if (completionPercent < 100) {
          allPreviousComplete = false;
        }
      }
    }

    setUnlockedLessons(unlockedLessonIds);
  }, [progressData]);

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage.");
          return;
        }
        await axios.post(
          `http://localhost:5000/api/lives/email/${userEmail}/regenerate`
        );
        const response = await axios.get(
          `http://localhost:5000/api/lives/email/${userEmail}`
        );
        setLives(response.data.lives);
      } catch (error) {
        console.error("Error fetching lives:", error);
      }
    };

    fetchLives();
    const livesInterval = setInterval(fetchLives, 5000);
    return () => clearInterval(livesInterval);
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage.");
          return;
        }
        const ts = Date.now();
        const response = await axios.get(
          `http://localhost:5000/api/points/email/${userEmail}?_=${ts}`
        );
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    // Points are provided by ProgressContext; no local fetching necessary
  }, []);

  const lessonRoutes = [
    { id: 1, termId: "termsone", unlocked: unlockedLessons.includes(1) },
    { id: 2, termId: "termstwo", unlocked: unlockedLessons.includes(2) },
    { id: 3, termId: "termsthree", unlocked: unlockedLessons.includes(3) },
    { id: 4, termId: "termsfour", unlocked: unlockedLessons.includes(4) },
    { id: 5, termId: "termsfive", unlocked: unlockedLessons.includes(5) },
    { id: 6, termId: "termssix", unlocked: unlockedLessons.includes(6) },
    { id: 7, termId: "termsseven", unlocked: unlockedLessons.includes(7) },
    { id: 8, termId: "termseight", unlocked: unlockedLessons.includes(8) },
    { id: 9, termId: "termsnine", unlocked: unlockedLessons.includes(9) },
    { id: 10, termId: "termsten", unlocked: unlockedLessons.includes(10) },
    { id: 11, termId: "termseleven", unlocked: unlockedLessons.includes(11) },
    { id: 12, termId: "termstwelve", unlocked: unlockedLessons.includes(12) },
  ];

  const getLessonButtonClass = (lesson) => {
    const baseClasses =
      "h-40 w-57 text-8xl flex justify-center items-center text-white rounded-3xl font-bold transition-all duration-200 ease-in-out";

    let colorClasses = "";
    if (lesson.id >= 1 && lesson.id <= 4) {
      // Basic lessons - blue
      colorClasses = "bg-[#579ecd] shadow-[0px_12px_0px_#246b9a]";
    } else if (lesson.id >= 5 && lesson.id <= 8) {
      // Intermediate lessons - yellow
      colorClasses = "bg-[#dcbc3d] shadow-[0px_12px_0px_#a9890a]";
    } else {
      // Advanced lessons - red
      colorClasses = "bg-[#cc6055] shadow-[0px_12px_0px_#992d22]";
    }

    const interactionClasses = lesson.unlocked
      ? "cursor-pointer opacity-100 hover:-translate-y-1 hover:scale-110 active:translate-y-0 active:scale-95"
      : "cursor-not-allowed opacity-50";

    return `${baseClasses} ${colorClasses} ${interactionClasses}`;
  };

  // Function to get the position class for zigzag pattern
  const getPositionClass = (index) => {
    const isEven = index % 2 === 0;
    return isEven ? "ml-20" : "ml-auto mr-20";
  };

  const chunkSize = 4;
  const lessonGroups = [];
  for (let i = 0; i < lessonRoutes.length; i += chunkSize) {
    lessonGroups.push(lessonRoutes.slice(i, i + chunkSize));
  }

  return (
    <>
      {/* Header with difficulty and lives/diamonds */}
      <div
        className="headerlessbtn flex items-center justify-center gap-5 sticky top-3 z-10  text-white header-container"
        style={{
          marginTop: "-40rem",
        }}
      >
        <div
          className="Difficulty text-center px-5 py-2 rounded-2xl font-bold text-white text-[2.5rem] difficulty-button"
          style={{
            backgroundColor: difficultyColors[difficulty],
            boxShadow: `0 0 0 5px ${strokeColors[difficulty] || "#A6DCFF"}`,
            width: "auto",
          }}
        >
          {difficulty}
        </div>
        <div className="livesDia flex items-center justify-center">
          <LivesandDiamonds />
        </div>
      </div>

      <div
        className="max-h-screen overflow-auto p-8 mt-[2rem] ml-auto scrollbar-hide lesson-scroll-container"
        ref={buttonContainerRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          /* hide default scrollbars for this container */
          div::-webkit-scrollbar {
            display: none;
          }

          /* Glow on hover for unlocked lesson buttons (keep original colors) */
          .lesson-button.basic:not(.cursor-not-allowed):hover {
            box-shadow: 0 12px 0 #246b9a, 0 0 24px 6px rgba(166, 220, 255, 0.28);
          }
          .lesson-button.intermediate:not(.cursor-not-allowed):hover {
            box-shadow: 0 12px 0 #a9890a, 0 0 24px 6px rgba(255, 254, 166, 0.28);
          }
          .lesson-button.advanced:not(.cursor-not-allowed):hover {
            box-shadow: 0 12px 0 #992d22, 0 0 24px 6px rgba(255, 125, 111, 0.28);
          }

          /* Wrapper centers content and reserves space for right panel */
          .lesson-wrap {
            max-width: 1600px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }

          /* Add extra bottom padding for desktop/laptop so lesson 12 is reachable */
          @media (min-width: 1024px) {
            .lesson-scroll-container {
              padding-bottom: 8rem !important;
            }
          }

          /* Keep the layout strictly two columns on desktop
        - Desktop & tablet: 2 columns
        - Mobile (<=640px): 1 column
        This preserves the look while avoiding extra columns */
          .lessons-grid {
            display: grid;
            gap: 7rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: start;
          }
          @media (max-width: 639px) {
            .lessons-grid {
              gap: 2rem;
            }
          }
          @media (max-width: 768px)  {
            .lessons-grid {
              gap: 2rem;
          }
          }
         @media (min-width: 1024px) {
            .lessons-grid {
              gap: 4rem;
            }
          }
          @media (min-width: 1800px) {
            .lessons-grid {
              gap: 8rem;
            }
          }
          @media (min-width: 2560px) {
            .lessons-grid {
              gap: 9.5rem;
            }
          }

          /* Tile container used to stagger vertical position without horizontal margins (2-column pattern) */
          .lesson-tile {
            transition: transform 200ms ease;
            display: flex;
            justify-content: center;
          }
          /* Odd items lift up to create the zigzag in a 2-column layout */
          .lessons-grid .lesson-tile:nth-child(2n + 1) {
            transform: translateY(-3.4rem);
          }
          .lessons-grid .lesson-tile:nth-child(2n) {
            transform: translateY(0);
          }

        

          /* Default button sizing (responsive overrides below) */
          .lesson-button {
            height: 6.5rem;
            width: 9rem;
            font-size: 3.25rem;
          }
          @media (min-width: 1024px) {
            .headerlessbtn {
              display: flex !important;
              gap: 1rem !important;
              margin-top: 8vh !important;
              margin-right: 5rem !important;
              z-index: -999;
            }
            .Difficulty {
              display: flex !important;
              height: 54px;
              font-size: 1.4rem;
              padding-inline: 12px !important;
              border-radius: 1rem !important;
            }
            .livesDia {
              display: flex !important;
              gap: 14px;
            }
            .lesson-button {
              height: 6rem !important;
              width: 7rem !important;
              font-size: 3.5rem !important;
              border-radius: 1.5rem !important;
            }
            .lessons-grid .lesson-tile:nth-child(2n + 1) {
              transform: translateY(-3rem);
              margin-top: 3rem;
            }
            .lessons-grid .lesson-tile:nth-child(2n) {
              transform: translateY(6rem);
            }
            .max-h-screen {
              max-height: 79vh !important;
              margin-top: 4vh !important;
              margin-right: 5rem !important;
              padding: 0.5rem !important;
            }
          }

          /* Mobile sidenav - only show below 640px */
          @media (min-width: 640px) and (max-width: 768px)  {
            .headerlessbtn {
              display: flex !important;
              gap: 1rem !important;
              margin-top: 8vh !important;
              margin-right: 8rem !important;
              z-index: -999;
            }
            .Difficulty {
              display: flex !important;
              height: 54px;
              font-size: 1.4rem;
              padding-inline: 12px !important;
              border-radius: 1rem !important;
            }
            .livesDia {
              display: flex !important;
              gap: 14px;
            }
            .lesson-button {
              height: 6rem !important;
              width: 8rem !important;
              font-size: 4rem !important;
              border-radius: 1.5rem !important;
            }
            .lessons-grid .lesson-tile:nth-child(2n + 1) {
              transform: translateY(-5rem);
              margin-top: 4rem;
            }
            .lessons-grid .lesson-tile:nth-child(2n) {
              transform: translateY(5rem);
            }
            .max-h-screen {
              max-height: 72vh !important;
              margin-top: 4vh !important;
              margin-right: 8rem !important;
              padding: 1rem !important;
            }
          }

          /* Mobile sidenav - only show below 640px */
          @media (max-width: 639px) {
            .headerlessbtn {
              display: flex !important;
              gap: 1rem !important;
              margin-top: 20vh !important;
              z-index: -999;
            }
            .Difficulty {
              display: flex !important;
              height: 47px;
              font-size: 1.2rem;
              padding-inline: 10px !important;
              border-radius: 1rem !important;
            }
            .livesDia {
              display: flex !important;
              gap: 14px;
            }
            .lesson-button {
              height: 5.5rem !important;
              width: 30rem !important;
              font-size: 4rem !important;
              border-radius: 1.5rem !important;
            }
            .lessons-grid .lesson-tile:nth-child(2n + 1) {
              transform: translateY(-5rem);
              margin-top: 4rem;
            }
            .lessons-grid .lesson-tile:nth-child(2n) {
              transform: translateY(5rem);
            }
            .max-h-screen {
              max-height: 56vh !important;
              margin-top: 4vh !important;
              
              padding: 1rem !important;
            }
          }

          /* hide-scrollbar helper kept for container compatibility */
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Responsive lessons grid: keeps the column design while making it fluid */}
        <div className="lesson-wrap">
          <div className="lessons-grid">
            {lessonRoutes.map((lesson, index) => (
              <div key={lesson.id} className="lesson-tile">
                <div
                  className={`${getLessonButtonClass(
                    lesson
                  )} lesson-button lesson-button-shadow ${
                    lesson.id >= 1 && lesson.id <= 4
                      ? "basic"
                      : lesson.id >= 5 && lesson.id <= 8
                      ? "intermediate"
                      : "advanced"
                  }`}
                  onClick={() => {
                    if (lesson.unlocked) {
                      let difficulty = "BASIC";
                      if (lesson.id >= 5 && lesson.id <= 8)
                        difficulty = "INTERMEDIATE";
                      if (lesson.id >= 9 && lesson.id <= 12)
                        difficulty = "ADVANCED";
                      navigate(`/page/${lesson.termId}`, {
                        state: { difficulty },
                      });
                    }
                  }}
                >
                  {lesson.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LessonButtons;
