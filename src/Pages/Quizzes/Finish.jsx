import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/Finish.css";
import Applause from "../../assets/Applause.png";
import diamond from "../../assets/diamond.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import repeatLogo from "../../assets/failedquiz.png"; // placeholder icon for failure
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
  const { correctAnswers = 0, wrongAnswers = 0, lessonKey, level } =
    location.state || {};

  const passThreshold = 8;
  const passed = correctAnswers >= passThreshold;

  const failMessages = [
    "Keep going!",
    "You can do it!",
    "Try again—you’re close!",
    "Don’t give up!",
    "Practice makes perfect!",
  ];
  const failMessage =
    failMessages[Math.floor(Math.random() * failMessages.length)];

  const styles = {
    basic: { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced: { backgroundColor: "#86271E" },
    white: { color: "#ffffff" },
  };

  const lessonsByLevel = {
    basic: ["termsone", "termstwo", "termsthree", "termsfour"],
    intermediate: ["termsfive", "termssix", "termsseven", "termseight"],
    advanced: ["termsnine", "termsten", "termseleven", "termstwelve"],
  };

  const lessonOffsets = { basic: 0, intermediate: 4, advanced: 8 };

  const { progressData } = useContext(ProgressContext);
  const currentLevel = level || "basic";
  const currentLessonKey = lessonKey || "termsone";

  const lessonProgress =
    progressData[currentLevel]?.[currentLessonKey] || {};
  const calculateProgress = (p = {}) => {
    let score = 0;
    if (p.step1Lecture) score += 25;
    if (p.step1Quiz) score += 25;
    if (p.step2Lecture) score += 25;
    if (p.step2Quiz) score += 25;
    return score;
  };
  // On failure, only show lecture-only progress (no quiz points added)
  const lectureOnlyProgress =
    (lessonProgress.step1Lecture ? 25 : 0) +
    (lessonProgress.step2Lecture ? 25 : 0);
  const progressPercent = passed
    ? calculateProgress(lessonProgress)
    : lectureOnlyProgress;

  const lessons = lessonsByLevel[currentLevel];
  const lessonIndex = lessons.indexOf(currentLessonKey);
  const displayName = `Lesson ${lessonOffsets[currentLevel] +
    lessonIndex +
    1}`;

  return (
    <>
      <div className="finishtext d-flex flex-column align-items-center position-relative fw-bold fs-1">
        {/* Dynamic Icon and Heading */}
        {passed ? (
          <img
            src={Applause}
            className="img-fluid p-1 mb-3"
            alt="Applause img"
          />
        ) : (
          <div className="fail-icon mb-3">
            {/* replace with your failure icon */}
            <img src={repeatLogo} alt="Try again icon" />
          </div>
        )}

        <p>
          {passed
            ? "You've Finished the Quiz"
            : failMessage}
        </p>

        {/* Reward diamonds only on pass */}
        {passed && (
          <div className="dia-reward d-flex pt-1">
            <img
              src={diamond}
              className="img-fluid p-1 ms-5"
              alt="diamond img"
            />
            <p className="dia-number ms-3 me-5">
              {correctAnswers * 10}
            </p>
          </div>
        )}

        {/* Always show stats */}
        <div className="stats-quiz d-flex flex-row gap-1 text-center">
          <img
            src={check}
            className="tama img-fluid p-1"
            alt="check img"
          />
          <p className="check-number ms-2">{correctAnswers}</p>
          <img
            src={ekis}
            className="mali img-fluid p-1 ms-5"
            alt="ekis img"
          />
          <p className="ekis-number ms-2">{wrongAnswers}</p>
        </div>

        {/* Progress Tracker */}
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
          onClick={() => {
            if (passed) {
              navigate(`/page/${lessonKey}`, {
                state: {
                  lessonKey,
                  difficulty:
                    location.state?.difficulty ??
                    levelMapping[lessonKey],
                  step: 2,
                  fromLecture: true,
                },
              });
            } else {
              navigate(`/quiz/${lessonKey}`, {
                state: { currentStep: location.state?.step || 1 },
              });
            }
          }}
        >
          {passed ? "Continue" : "Try Again"}
          <img
            src={arrow}
            className="img-fluid d-flex ms-3 mt-1"
            alt="arrow img"
          />
        </button>
      </div>
    </>
  );
}

export default Finish;