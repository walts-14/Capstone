import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../css/Finish.css";
import Applause from "../../../assets/Applause.png";
import diamond from "../../../assets/diamond.png";
import dashboardlogo from "../../../assets/dashboardlogo.png";
import { ProgressContext } from "../../../../src/Pages/Dashboard/ProgressContext";

function FinishLecture() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonKey, level, step } = location.state || {};
  // Extract state passed to this component
  const {
    correctAnswers = 0,
    wrongAnswers = 0,
  } = location.state || {};

  const numericStep = parseInt(step, 10); // Ensure the step is parsed as a number

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

  const lessonOffsets = {
    basic: 0,
    intermediate: 4,
    advanced: 8,
  };

  const { progressData } = useContext(ProgressContext);

  const lessonProgress = progressData[level]?.[lessonKey] || {};
  const calculateProgress = (progressObj = {}) => {
    let score = 0;
    if (progressObj.step1Lecture) score += 25;
    if (progressObj.step1Quiz) score += 25;
    if (progressObj.step2Lecture) score += 25;
    if (progressObj.step2Quiz) score += 25;
    return score;
  };
  const progressPercent = calculateProgress(lessonProgress);

  const lessons = lessonsByLevel[level];
  const lessonIndex = lessons.indexOf(lessonKey);
  const displayName = `Lesson ${lessonOffsets[level] + lessonIndex + 1}`;

  // Handle quiz navigation based on the current step
  const handleQuizClick = () => {
    console.log(`Navigating to quiz for: ${lessonKey}, step: ${numericStep}`);
    navigate(`/quiz/${lessonKey}`, {
      state: { currentStep: numericStep }, // Pass currentStep as part of the state
    });
  };

  return (
    <>
      <div className="finishtext d-flex flex-column align-items-center position-relative fw-bold fs-1">
        <img src={Applause} className="img-fluid p-1 mb-3" alt="Applause" />
        <p>You've Finished the Lesson</p>

        <div className="dia-reward d-flex pt-1">
          <img src={diamond} className="img-fluid p-1 ms-5" alt="diamond" />
          <p className="dia-number ms-3 me-5">{correctAnswers * 10}</p>
        </div>

        <div
          key={lessonKey}
          className={`${level}tracker text.white d-flex m-0 rounded-4 p-3 justify-content-between custom-gap`}
          style={styles[level]}
        >
          <span>{displayName}</span>
          <span style={styles.white}>{progressPercent}%</span>
        </div>
      </div>

      <div className="finishbuttons rounded-4 d-flex align-items-center justify-content-center">
        <button
          type="button"
          className="dashboard-button d-flex justify-content-center align-items-center mt-2 ms-5 rounded-4 fs-1"
          onClick={() => navigate("/dashboard")}
        >
          <img src={dashboardlogo} className="img-fluid p-1 mt-1" alt="dashboard" />
          Dashboard
        </button>

        {/* Special button to navigate to the quiz */}
        <div className="special-button-container" onClick={handleQuizClick}>
          <button className="special-button">
            {numericStep === 1 ? "Go to Step 1 Quiz" : "Go to Step 2 Quiz"}
          </button>
        </div>
      </div>
    </>
  );
}

export default FinishLecture;
