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
  const [points, setPoints] = useState(0);
  const [unlockedLessons, setUnlockedLessons] = useState([1]);
  const buttonContainerRef = useRef(null);
  const { progressData } = useContext(ProgressContext);

  const difficultyColors = {
    BASIC: "#579ecd",
    INTERMEDIATE: "#dcbc3d",
    ADVANCED: "#cc6055",
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!buttonContainerRef.current) return;
      const container = buttonContainerRef.current;
      const scrollTop = container.scrollTop;
      const sections = container.querySelectorAll(
        ".lessons-container, .lessons-container2, .lessons-container3"
      );

      let currentDifficulty = "BASIC";
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollTop >= sectionTop - sectionHeight / 2) {
          if (index === 1) currentDifficulty = "INTERMEDIATE";
          if (index === 2) currentDifficulty = "ADVANCED";
        }
      });

      setDifficulty(currentDifficulty);
    };

    const container = buttonContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
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
        const response = await axios.get(
          `http://localhost:5000/api/points/email/${userEmail}`
        );
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPoints();
    const pointsInterval = setInterval(fetchPoints, 5000);
    return () => clearInterval(pointsInterval);
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
      "h-40 w-57 text-7xl flex justify-center items-center text-white rounded-xl font-bold transition-all duration-200 ease-in-out";

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
      ? "cursor-pointer opacity-100 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95"
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
    <div
      className="max-h-screen overflow-auto p-8 mr-[7.5rem] ml-auto scrollbar-hide"
      ref={buttonContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header with difficulty and lives/diamonds */}
      <div className="flex items-center gap-5 sticky top-3 z-10 mb-15 text-white">
        <div
          className="text-center px-5 py-2 rounded-2xl font-bold text-white text-[2.5rem] w-[24vw]"
          style={{ backgroundColor: difficultyColors[difficulty] }}
        >
          {difficulty}
        </div>
        <LivesandDiamonds />
      </div>

      {/* Lesson Groups with Zigzag Layout */}
      {lessonGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-10">
          {/* Section Label */}
          {groupIndex === 0 && (
            <div className="lessons-container flex flex-col space-y-10">
              {group.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className={`flex ${getPositionClass(lessonIndex)}`}
                >
                  <div
                    className={getLessonButtonClass(lesson)}
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
          )}

          {groupIndex === 1 && (
            <div className="lessons-container2 flex flex-col space-y-10">
              {group.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className={`flex ${getPositionClass(lessonIndex)}`}
                >
                  <div
                    className={getLessonButtonClass(lesson)}
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
          )}

          {groupIndex === 2 && (
            <div className="lessons-container3 flex flex-col space-y-10">
              {group.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className={`flex ${getPositionClass(lessonIndex)}`}
                >
                  <div
                    className={getLessonButtonClass(lesson)}
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
          )}
        </div>
      ))}
    </div>
  );
}

export default LessonButtons;
