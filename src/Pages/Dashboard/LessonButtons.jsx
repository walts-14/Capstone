import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Lesson.css";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import { ProgressContext } from "./ProgressContext.jsx"; // Import the ProgressContext

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
  const [unlockedLessons, setUnlockedLessons] = useState([1]); // Only lesson 1 is unlocked initially
  const buttonContainerRef = useRef(null);
  const { progressData } = useContext(ProgressContext); // Get progress data from context

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

    const unlockedLessonIds = [1]; // First lesson is always unlocked

    // Map terms to lesson IDs
    const termToLessonId = {};
    let idCounter = 1;

    for (const level of ["basic", "intermediate", "advanced"]) {
      for (const term of lessonsByLevel[level]) {
        termToLessonId[term] = idCounter++;
      }
    }

    let allPreviousComplete = true;

    // Check lessons in order
    for (let lessonId = 1; lessonId < 12; lessonId++) {
      // Find the term ID for this lesson
      const termId = Object.keys(termToLessonId).find(
        (term) => termToLessonId[term] === lessonId
      );

      if (!termId) continue;

      // Find which level this term belongs to
      let level;
      for (const l of ["basic", "intermediate", "advanced"]) {
        if (lessonsByLevel[l].includes(termId)) {
          level = l;
          break;
        }
      }

      if (!level) continue;

      // Check if the current lesson is 100% complete
      const currentLessonProgress = progressData[level]?.[termId] || {};
      const completionPercent = calculateProgress(currentLessonProgress);

      if (allPreviousComplete) {
        unlockedLessonIds.push(lessonId);

        // If this lesson isn't 100% complete, stop unlocking further lessons
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
        // Call regenerate endpoint first
        await axios.post(`http://localhost:5000/api/lives/email/${userEmail}/regenerate`);
        // Then fetch the updated lives
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

  const chunkSize = 4;
  const lessonGroups = [];
  for (let i = 0; i < lessonRoutes.length; i += chunkSize) {
    lessonGroups.push(lessonRoutes.slice(i, i + chunkSize));
  }

  const sectionClasses = [
    "lessons-container",
    "lessons-container2",
    "lessons-container3",
  ];

  return (
    <div className="ButtonContainer" ref={buttonContainerRef}>
      <div className="diff-life-gem d-flex align-items-center gap-4 sticky-top">
        <div
          className="diff text-center px-3 py-2 rounded-4 fw-bold"
          style={{ backgroundColor: difficultyColors[difficulty] }}
        >
          {difficulty}
        </div>
        <LivesandDiamonds />
      </div>
      {lessonGroups.map((group, index) => (
        <div
          key={index}
          className={sectionClasses[index] || "lessons-container"}
        >
          {group.map((lesson) => (
            <div
              key={lesson.id}
              className={`lessons lessons${index + 1} d-flex rounded-4`}
              onClick={() => {
                if (lesson.unlocked) {
                  let difficulty = "BASIC";
                  if (lesson.id >= 5 && lesson.id <= 8)
                    difficulty = "INTERMEDIATE";
                  if (lesson.id >= 9 && lesson.id <= 12)
                    difficulty = "ADVANCED";

                  navigate(`/page/${lesson.termId}`, { state: { difficulty } });
                }
              }}
              style={{
                cursor: lesson.unlocked ? "pointer" : "not-allowed",
                opacity: lesson.unlocked ? 1 : 0.5,
              }}
            >
              {lesson.id}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LessonButtons;
