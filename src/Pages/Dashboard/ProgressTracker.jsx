// ProgressTracker.js
import "../../css/Dashboard.css";
import React, { useContext } from "react";
import { ProgressContext } from "./ProgressContext";

const calculateProgress = (progressObj) => {
  let score = 0;
  if (progressObj.step1Lecture) score += 25;
  if (progressObj.step1Quiz) score += 25;
  if (progressObj.step2Lecture) score += 25;
  if (progressObj.step2Quiz) score += 25;
  return score;
};

const lessonsByLevel = {
  basic: ["termsone", "termstwo", "termsthree", "termsfour"],
  intermediate: ["lesson1", "lesson2", "lesson3", "lesson4"],
  advanced: ["lesson1", "lesson2", "lesson3", "lesson4"],
};

function ProgressTracker() {
  const { progressData } = useContext(ProgressContext);

  return (
    <div className="lessonTracker d-flex flex-column text-white rounded-4 p-3">
      {Object.keys(lessonsByLevel).map((level) => (
        <div key={level} className={`${level}Tracker rounded-4 m-2 mb-4`}>
          <div className={`${level}Title fs-1 text-center mb-3`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </div>
          {lessonsByLevel[level].map((lessonKey) => {
            const progressPercent = calculateProgress(
              progressData[level][lessonKey]
            );
            return (
              <div
                key={lessonKey}
                className={`${level}tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between`}
              >
                <span>{lessonKey}</span>
                <span>{progressPercent}%</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ProgressTracker;
