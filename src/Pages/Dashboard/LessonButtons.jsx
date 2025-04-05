import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Lesson.css";
import LivesandDiamonds from "../../Components/LivesandDiamonds";

const lessonRoutes = [
  { id: 1, termId: "termsone", unlocked: true },
  { id: 2, termId: "termstwo", unlocked: true },
  { id: 3, termId: "termsthree", unlocked: true },
  { id: 4, termId: "termsfour", unlocked: true },
  { id: 5, termId: "termssix", unlocked: true },
  { id: 6, termId: "termsseven", unlocked: true },
  { id: 7, termId: "termseight", unlocked: true },
  { id: 8, termId: "termsnine", unlocked: true },
  { id: 9, termId: "termsten", unlocked: true },
  { id: 10, termId: "termseleven", unlocked: true },
  { id: 11, termId: "termstwelve", unlocked: true },
  { id: 12, termId: "termsthirteen", unlocked: true },
];

function LessonButtons() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("BASIC");
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
