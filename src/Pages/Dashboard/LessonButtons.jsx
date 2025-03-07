import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Lesson.css";
import heart from "../../assets/heart.png";
import diamond from "../../assets/diamond.png";

const lessonRoutes = [
  { id: 1, termId: "termsone" },
  { id: 2, termId: "termstwo" },
  { id: 3, termId: "termsthree" },
  { id: 4, termId: "termsfour" },
  { id: 5, termId: "termsfive" },
  { id: 6, termId: "termssix" },
  { id: 7, termId: "termsseven" },
  { id: 8, termId: "termseight" },
  { id: 9, termId: "termsnine" },
  { id: 10, termId: "termsten" },
  { id: 11, termId: "termseleven" },
  { id: 12, termId: "termstwelve" },
  { id: 13, termId: "termsthirteen" },
  { id: 14, termId: "termsfourteen" },
  { id: 15, termId: "termsfifteen" },
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
          <p className="heart-num m-0 text-danger fw-bold">5</p>
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
              onClick={() => navigate(`/page/${lesson.termId}`)}
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
