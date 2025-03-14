import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Lesson.css";
import heart from "../../assets/heart.png";
import diamond from "../../assets/diamond.png";

const lessonRoutes = [
  { id: 1, termId: "termsone", unlocked: true },
  { id: 2, termId: "termstwo", unlocked: true },
  { id: 3, termId: "termsthree", unlocked: false }, // Example locked lesson
  { id: 4, termId: "termsfour", unlocked: false },
  { id: 5, termId: "termsfive", unlocked: false },
  { id: 6, termId: "termssix", unlocked: false },
  { id: 7, termId: "termsseven", unlocked: false },
  { id: 8, termId: "termseight", unlocked: false },
  { id: 9, termId: "termsnine", unlocked: false },
  { id: 10, termId: "termsten", unlocked: false },
  { id: 11, termId: "termseleven", unlocked: false },
  { id: 12, termId: "termstwelve", unlocked: false },
  { id: 13, termId: "termsthirteen", unlocked: false },
  { id: 14, termId: "termsfourteen", unlocked: false },
  { id: 15, termId: "termsfifteen", unlocked: false },
];

function LessonButtons() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("BASIC");
  const [lives, setLives] = useState(5); // Lives are now dynamic
  const buttonContainerRef = useRef(null);

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

  useEffect(() => {
    // Fetch lives from the backend
    const fetchLives = async () => {
      try {
        const userId = "yourUserId"; // Replace with actual user ID
        const response = await axios.get(`/api/lives/${userId}`);
        setLives(response.data.lives);
      } catch (error) {
        console.error("Error fetching lives:", error);
      }
    };

    fetchLives();
  }, []);

  const chunkSize = 5;
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
        <div className="d-flex align-items-center gap-1">
          <img src={heart} className="heart-logo img-fluid" alt="lives logo" />
          <p className="heart-num m-0 text-danger fw-bold">{lives}</p> {/* Now dynamic */}
        </div>
        <div className="d-flex align-items-center gap-1">
          <img
            src={diamond}
            className="dia-logo img-fluid"
            alt="diamond logo"
          />
          <p className="dia-num m-0 fw-bold">100</p>
        </div>
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
                  navigate(`/page/${lesson.termId}`);
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
