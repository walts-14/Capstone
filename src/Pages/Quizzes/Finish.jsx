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
import quiz from "../../assets/quiz.png";
import { ProgressContext } from "../../../src/Pages/Dashboard/ProgressContext";

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
  termstwelve: "advanced",
};

const lessonNumberMapping = {
  termsone: 1,
  termstwo: 2,
  termsthree: 3,
  termsfour: 4,
  termsfive: 1,
  termssix: 2,
  termsseven: 3,
  termseight: 4,
  termsnine: 1,
  termsten: 2,
  termseleven: 3,
  termstwelve: 4,
};

function Finish() {
  const navigate = useNavigate();
  const location = useLocation();

  // Expecting lessonKey and level to be passed along with answers info
  const { correctAnswers = 0, wrongAnswers = 0, lessonKey, level, mode, currentStep, pointsEarned = null, attemptNumber = null } = location.state || {};


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
        <img src={Applause} className="applause img-fluid p-1 mb-3" alt="applause img" />
        <p className="textFinished"> {mode === "practice" ? "You've Finished the Practice Quiz" : "You've Finished the Quiz"} </p>

        <div className="stats-quiz d-flex flex-row gap-1 text-center ">
          {mode === "practice" ? null : (
            <div className="dia-reward d-flex ">
              <img src={diamond} className="img-fluid p-1 " alt="diamond img" />
              <p className="dia-number ms-3  me-5">
                {/* Prefer backend-provided pointsEarned when available. Otherwise compute based on level and attemptNumber. */}
                {(() => {
                  if (pointsEarned !== null && pointsEarned !== undefined) return pointsEarned;
                  // points tiers per attempt bucket
                  const pointsTable = {
                    basic: { firstTwo: 10, third: 5, fourthPlus: 2 },
                    intermediate: { firstTwo: 15, third: 8, fourthPlus: 3 },
                    advanced: { firstTwo: 20, third: 10, fourthPlus: 5 },
                  };
                  const lvl = currentLevel || 'basic';
                  const tiers = pointsTable[lvl] || pointsTable.basic;
                  let perAnswer = tiers.firstTwo;
                  if (attemptNumber === 3) perAnswer = tiers.third;
                  else if (attemptNumber >= 4) perAnswer = tiers.fourthPlus;
                  // if attemptNumber is null/undefined, assume firstTwo (initial run)
                  return perAnswer * Number(correctAnswers || 0);
                })()}
              </p>
            </div>
          )}
          <img src={check} className="tama img-fluid p-1" alt="check img" />
          <p className="check-number ms-2" style={{ color: "#20BF55" }}>{correctAnswers}</p>
          <img src={ekis} className="mali img-fluid p-1 ms-5" alt="ekis img" />
          <p className="ekis-number ms-2" style={{ color: "#F44336" }}>{wrongAnswers}</p>
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
          className="dashboard-button d-flex justify-content-center align-items-center mt-2 ms-3 rounded-4 fs-1"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={dashboardlogo}
            className="img-fluid d-flex"
            alt="dashboard"
          />
          Dashboard
        </button>

        {/* Show different buttons based on mode and step */}
        {mode === "practice" ? (
          /* Practice mode: Show Quiz button */
          <button
            type="button"
            className="Quiz d-flex justify-content-center align-items-center rounded-4 pt-3 mt-1 ms-auto me-3 fs-1"
            style={{ border: "5px solid var(--background)" }}
            onClick={() =>
              navigate(`/quiz/${lessonKey}`, {
                state: { currentStep: currentStep }
              })}
          >
            <img
              src={quiz}
              className="img-fluid d-flex p-2 mb-1"
              alt="quiz"
            />
            <p>{currentStep === 1 ? "1 Quiz" : "2 Quiz"}</p>
          </button>
        ) : (
          /* Regular mode: Show Continue button only for step 1 */
          currentStep === 1 && (
            <button
              type="button"
              className="continue d-flex justify-content-center align-items-center rounded-4 pt-4  mb-4 ms-auto me-3 fs-1"
              style={{ border: "5px solid var(--background)" }}
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
              <img
                src={arrow}
                className="img-fluid d-flex mr-5"
                alt="arrow"
              />
              Continue
            </button>
          )
        )}
      </div>

      {/* Responsive styles for smooth transition */}
      <style>{`
        /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 1023px) {
         
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
          .finishtext {
            top: 80px !important;
          }
          .applause {
            width: 100px !important;  
            height: auto !important;          
          }
          .textFinished {
            font-size: 1.5rem !important;  
            text-align: center !important;
          }
          .stats-quiz img {
            width: 2rem !important;  
            height: 2rem !important;          
          }
          
          .stats-quiz p {
            font-size: 1.5rem !important;

          }
          .${currentLevel}tracker {
            width: 90vw !important;
            gap: 4px !important;
          }
          .${currentLevel}tracker span {
            font-size: 1.5rem !important;
            
          }
          .finishbuttons {
            width: 95vw !important;
            height: 12vh !important;
            margin-left: 6px !important;
            gap: 2px !important;
            margin-top: 100px !important;
          }
            
          .finishbuttons button {
            font-size: 1.1rem !important;
            width: 42vw !important;
            height: 8vh !important;
            margin-left: 6px !important;
            margin-right: 6px !important;
            gap: 0px !important;
            
          }

          .continue{
            padding: 20px !important;
          }
          .continue img, dashboard-button img {
            display: flex;
            width: 30px !important;
            margin-top: 6px;
            margin-right: 8px;
          }
          .Quiz  {
            gap: 25px !important;
            
          }
          .Quiz img {
            width: 3rem !important;  
            height: 3rem !important;
            position: fixed !important;
            right: 100px !important;
          }
          .Quiz p {
            margin-top: 10px;
            margin-left: 20px;
          }
          
        }
        
        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
          
        }

      `}</style>
    </>
  );
}

export default Finish;
