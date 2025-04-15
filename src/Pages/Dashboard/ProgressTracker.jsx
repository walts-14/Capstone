// ProgressTracker.js
import React, { useState, useContext } from "react";
import { ProgressContext } from "./ProgressContext";
import trophy from "../../assets/trophy.png";

function ProgressTracker() {
  const { progressData } = useContext(ProgressContext);
  const [userName, setUserName] = React.useState("");

  const styles = {
    basic: { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced: { backgroundColor: "#86271E" },
    font: { color: "#160A2E" },
    white: { color: "#ffffff" },
  };
  const levelMapping = {
    termsone: "basic",
    termstwo: "basic",
    termsthree: "basic",
    termsfour: "basic",
    termsfive: "intermediate",
    termssix: "intermediate",
    termsseven: "intermediate",
    termseight: "intermediate",
    termsnine: "advanced",
    termsten: "advanced",
    termseleven: "advanced",
    termstwelve: "advanced"
  };
  
  const level = levelMapping[lessonKey] || "basic";
  
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

  // Offsets so we can number lessons 1–12
  const lessonOffsets = {
    basic: 0, // lessons 1–4
    intermediate: 4, // lessons 5–8
    advanced: 8, // lessons 9–12
  };

  return (
    <>
      <div className="tracker">
        <div className="position-lb d-flex align-items-center gap-1">
          <img
            src={trophy}
            className="h-auto mt-4 ms-3 mb-3 pl-5 img-fluid"
            alt="trophy image"
          />
          <p className="fs-1 text-center ms-4 ">#1</p>
          <p className="text-nowrap fs-2">{userName}</p>
        </div>{" "}
      </div>

      <div className="lessonTracker d-flex flex-column text-white rounded-4 p-3">
        {Object.keys(lessonsByLevel).map((level) => (
          <div key={level} className={`${level}Tracker rounded-4 mt-4`}>
            <div className={`${level}Title fs-1 text-center mb-3`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>

            {lessonsByLevel[level].map((lessonKey, idx) => {
              // safe access
              const lessonProgress = progressData[level]?.[lessonKey] ?? {};
              const progressPercent = calculateProgress(lessonProgress);

              // compute display name Lesson 1–12
              const displayName = `Lesson ${lessonOffsets[level] + idx + 1}`;

              return (
                <div
                  key={lessonKey}
                  className={`${level}tracker d-flex m-3 rounded-4 p-2 justify-content-between`}
                  style={styles[level]}
                >
                  <span>{displayName}</span>
                  <span style={{ color: "#160A2E" }}>{progressPercent}%</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default ProgressTracker;
