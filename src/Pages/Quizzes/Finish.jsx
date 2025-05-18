import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/Finish.css";
import Applause from "../../assets/Applause.png";
import diamond from "../../assets/diamond.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import repeatLogo from "../../assets/repeat logo.png";
import arrow from "../../assets/arrow.png";
import dashboardlogo from "../../assets/dashboardlogo.png";
import { ProgressContext } from "../../../src/Pages/Dashboard/ProgressContext";

const levelMapping = {
  termsone:   "basic",
  termstwo:   "basic",
  termsthree: "basic",
  termsfour:  "basic",
  termsfive:  "intermediate",
  termssix:   "intermediate",
  termsseven: "intermediate",
  termseight: "intermediate",
  termsnine:  "advanced",
  termsten:   "advanced",
  termseleven:"advanced",
  termstwelve:"advanced",
};

const lessonNumberMapping = {
  termsone:    1,
  termstwo:    2,
  termsthree:  3,
  termsfour:   4,
  termsfive:   1,
  termssix:    2,
  termsseven:  3,
  termseight:  4,
  termsnine:   1,
  termsten:    2,
  termseleven: 3,
  termstwelve: 4,
};

function Finish() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Expecting lessonKey and level to be passed along with answers info
  const { correctAnswers = 0, wrongAnswers = 0, lessonKey, level } = location.state || {};

  // Define styles (same as in ProgressTracker)
  const styles = {
    basic: { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced: { backgroundColor: "#86271E" },
    white: { color: "#ffffff" },
  };

  // Helper function to calculate progress percentage.
  const calculateProgress = (progressObj = {}) => {
    let score = 0;
    if (progressObj.step1Lecture) score += 25;
    if (progressObj.step1Quiz) score += 25;
    if (progressObj.step2Lecture) score += 25;
    if (progressObj.step2Quiz) score += 25;
    return score;
  };

  // Define the lessons per level to compute lesson display names and ordering.
  const lessonsByLevel = {
    basic: ["termsone", "termstwo", "termsthree", "termsfour"],
    intermediate: ["termsfive", "termssix", "termsseven", "termseight"],
    advanced: ["termsnine", "termsten", "termseleven", "termstwelve"],
  };

  // Offsets so that Lesson numbering can match (i.e., Lesson 1, Lesson 2, etc.)
  const lessonOffsets = {
    basic: 0,
    intermediate: 4,
    advanced: 8,
  };

  // Use progress context to get current progress data
  const { progressData } = useContext(ProgressContext);

  // Use the passed values to determine the current lesson and level
  const currentLevel = level || "basic";
  const currentLessonKey = lessonKey || "termsone";

  // Get the current lesson's progress data and calculate the progress percentage.
  const lessonProgress = progressData[currentLevel]?.[currentLessonKey] || {};
  const progressPercent = calculateProgress(lessonProgress);

  // Determine the display name based on the lesson's index and level offset.
  const lessons = lessonsByLevel[currentLevel];
  const lessonIndex = lessons.indexOf(currentLessonKey);
  const displayName = `Lesson ${lessonOffsets[currentLevel] + lessonIndex + 1}`;

  return (
    <>
      <div className="finishtext d-flex flex-column align-items-center position-relative fw-bold fs-1">
        <img src={Applause} className="img-fluid p-1 mb-3" alt="applause img" />
        <p> You've Finished the Quiz </p>
        <div className="dia-reward d-flex pt-1">
          <img src={diamond} className="img-fluid p-1 ms-5" alt="diamond img" />
          <p className="dia-number ms-3 me-5">{correctAnswers * 10}</p>
        </div>
        <div className="stats-quiz d-flex flex-row gap-1 text-center">
          <img src={check} className="tama img-fluid p-1" alt="check img" />
          <p className="check-number ms-2">{correctAnswers}</p>
          <img src={ekis} className="mali img-fluid p-1 ms-5" alt="ekis img" />
          <p className="ekis-number ms-2">{wrongAnswers}</p>
        </div>
        {/* Render dynamic progress tracker line for the finished lesson */}
        <div
          key={currentLessonKey}
          className={`${currentLevel}tracker text.white d-flex m-0 rounded-4 p-3 justify-content-between custom-gap`}
          style={styles[currentLevel]}
        >
          <span style={styles.white}>{displayName}</span>
          <span style={{ color: "#160A2E" }}>{progressPercent}%</span>
        </div>
      </div>
      <div className="finishbuttons rounded-4 d-flex align-items-center justify-content-center">
        <button
          type="button"
          className="dashboard-button d-flex justify-content-center align-items-center mt-2 ms-5 rounded-4 fs-1"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={dashboardlogo}
            className="img-fluid d-flex p-1 mt-1"
            alt="dashboard img"
          />
           Dashboard 
        </button>
        <button
          type="button"
          className="continue d-flex justify-content-center align-items-center rounded-4 pt-4 mb-4 ms-auto me-5 fs-1"
          onClick={() => 
            navigate(`/page/${lessonKey}`, {
              state: {
                lessonKey,
                difficulty: location.state?.difficulty ?? levelMapping[lessonKey], 
                step: 2,
                fromLecture: true,
              }
            })}
        >
          Continue
          <img
            src={arrow}
            className="img-fluid d-flex ms-3 mt- 1"
            alt="arrow img"
          />
        </button>
      </div>
    </>
  );
}

export default Finish;
