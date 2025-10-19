import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../css/Finish.css";
import Applause from "../../../assets/Applause.png";
import diamond from "../../../assets/diamond.png";
import dashboardlogo from "../../../assets/dashboardlogo.png";
import quiz from "../../../assets/quiz.png";
import { ProgressContext } from "../../../../src/Pages/Dashboard/ProgressContext";

function FinishLecture() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract state passed to this component
  const {
    correctAnswers = 0,
    wrongAnswers = 0,
    lessonKey = "termsone",
    level = "basic",
    step = 1,
  } = location.state || {};

  // Pull updateProgress from context
  const { updateProgress } = useContext(ProgressContext);
  const [didUpdate, setDidUpdate] = useState(false);
  // Parse the step value as a number
  const numericStep = parseInt(step, 10);
  const key = numericStep === 1 ? "step1Lecture" : "step2Lecture";
  useEffect(() => {
    // only if we haven't already, and we have valid inputs
    if (!didUpdate && lessonKey && level && (numericStep === 1 || numericStep === 2)) {
      const key = numericStep === 1 ? "step1Lecture" : "step2Lecture";
      updateProgress(level, lessonKey, key);
      setDidUpdate(true);
    }
  }, [didUpdate, level, lessonKey, numericStep, updateProgress]);


  // Define styles for different levels
  const styles = {
    basic: { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced: { backgroundColor: "#86271E" },
    white: { color: "#ffffff" },
  };

  // Lessons ordering per level
  const lessonsByLevel = {
    basic: ["termsone", "termstwo", "termsthree", "termsfour"],
    intermediate: ["termsfive", "termssix", "termseven", "termseight"],
    advanced: ["termsnine", "termsten", "termseleven", "termstwelve"],
  };

  // Offsets for lesson numbering
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

  // Calculate diamond reward: base reward (correctAnswers*10) plus bonus 50 for finishing the lesson.
  const [showLectureBonus] = useState(() => !lessonProgress[key]);
  const diamondReward = correctAnswers * 10 + (showLectureBonus ? 50 : 0);

  // Handle quiz navigation based on the current step.
  // This special button will use current step to decide which quiz to load.
  const handleQuizClick = () => {
    console.log(`Navigating to quiz for: ${lessonKey}, step: ${numericStep}`);
    navigate(`/quiz/${lessonKey}`, {
      state: { currentStep: numericStep }, // Pass the current step so Quiz component can load the appropriate questions.
    });
  };

  return (
    <>
      <div className="finishtext d-flex flex-column align-items-center position-relative fw-bold fs-1">
        <img src={Applause} className="img-fluid p-1 mb-3" alt="Applause" />
        <p>You've Finished the Lesson</p>

        {showLectureBonus && (
          <div className="dia-reward d-flex pt-1">
            <img src={diamond} className="img-fluid p-1 ms-5" alt="diamond" />
            {/* Display diamond reward including the bonus */}
            <p className="dia-number ms-3 me-5">{diamondReward}</p>
          </div>
        )}
        <div
          key={lessonKey}
          className={`${level}tracker text.white d-flex m-0 rounded-4 p-3 justify-content-between custom-gap`}
          style={styles[level]}
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

        {/* Special dynamic quiz button */}
        <button
          className="Quiz d-flex justify-content-center align-items-center rounded-4 pt-3 mt-1 ms-auto me-3 fs-1 "
          style={{ border: "5px solid var(--background)" }}
          onClick={handleQuizClick} >
          <img
            src={quiz}
            className="img-fluid d-flex p-2 mb-1 "
            alt="dashboard"
          />
          {numericStep === 1 ? "1 Quiz" : "2 Quiz"}
        </button>
      </div>
    </>
  );
}

export default FinishLecture;
