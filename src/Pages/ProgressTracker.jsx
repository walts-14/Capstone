import React from "react";
import { useLocation } from "react-router-dom";
import "../css/ProgressTracker.css"; // Ensure this file contains the styles matching the provided image

const ProgressTracker = () => {
  const location = useLocation();
  const { user } = location.state;

  // Example progress data (replace with actual data from the user object)
  const progressData = {
    basic: [
      { lesson: "Lesson 1", progress: 50 },
      { lesson: "Lesson 2", progress: 0 },
      { lesson: "Lesson 3", progress: 0 },
      { lesson: "Lesson 4", progress: 0 },
    ],
    intermediate: [
      { lesson: "Lesson 1", progress: 50 },
      { lesson: "Lesson 2", progress: 0 },
      { lesson: "Lesson 3", progress: 0 },
      { lesson: "Lesson 4", progress: 0 },
    ],
  };

  return (
    <div className="progress-tracker-container">
      <h2>{user.name}'s Progress</h2>
      <div className="progress-section">
        <h3 className="progress-title">BASIC</h3>
        {progressData.basic.map((item, index) => (
          <div key={index} className="progress-item">
            <span>{item.lesson}</span>
            <span>{item.progress}%</span>
          </div>
        ))}
      </div>
      <div className="progress-section">
        <h3 className="progress-title">INTERMEDIATE</h3>
        {progressData.intermediate.map((item, index) => (
          <div key={index} className="progress-item">
            <span>{item.lesson}</span>
            <span>{item.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;