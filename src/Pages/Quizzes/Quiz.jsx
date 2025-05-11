import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";
import axios from "axios";
import { ProgressContext } from "../../../src/Pages/Dashboard/ProgressContext"; // NEW: Import progress context
import LivesandDiamonds from "../../Components/LiveandDiamonds";

function Quiz() {
  const navigate = useNavigate();
  const { lessonKey } = useParams(); // e.g., "termsone", "termstwo", etc.
  const location = useLocation();
  const currentStep = location.state?.currentStep || 1; // Default to step 1 if not passed

  // NEW: Determine level based on lessonKey
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

  const level = levelMapping[lessonKey] || "basic";

  // Map currentStep to quizPart for backend API
  const quizPart = currentStep; // Assuming step 1 = quizPart 1, step 2 = quizPart 2

  const totalQuestions = 10;

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false); // Flag when quiz is complete

  // NEW: Local flag to ensure progress is updated only once
  const [hasUpdatedQuiz, setHasUpdatedQuiz] = useState(false);

  // Lives system
  const [lives, setLives] = useState(5); // Default lives
  const [streak, setStreak] = useState(0);

  const backendURL = "http://localhost:5000";

  const { updateProgress } = useContext(ProgressContext); // NEW: Get progress updater

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage.");
          return;
        }
        const response = await axios.get(
          `${backendURL}/api/lives/email/${userEmail}`
        );
        setLives(response.data.lives);
      } catch (error) {
        console.error("Error fetching lives:", error);
        toast.error("Failed to fetch lives. Please try again.");
      }
    };

    fetchLives();
  }, [backendURL]);

  // Fetch quiz questions from backend API
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const lessonNumber = 1; // TODO: Map lessonKey to lessonNumber if needed
        const response = await axios.get(
          `${backendURL}/api/quizzes/random`,
          {
            params: {
              level,
              lessonNumber,
              quizPart,
            },
          }
        );
        setQuizQuestions(response.data);
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setAttempts(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setShowResult(false);
        setIsCorrect(false);
        setQuizFinished(false);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        toast.error("Failed to load quiz questions. Please try again.");
      }
    };

    fetchQuizQuestions();
  }, [level, lessonKey, quizPart, backendURL]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleChoiceClick = (index) => {
    if (showResult || lives <= 0) return;
    setSelectedAnswerIndex(index);
    const selectedChoice = currentQuestion.choices[index];
    const isAnswerCorrect = selectedChoice.videoId === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);
  };

  const handleNext = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (selectedAnswerIndex === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }

    if (!showResult) {
      setShowResult(true);
      try {
        if (!isCorrect) {
          await axios.post(
            `${backendURL}/api/lives/email/${userEmail}/lose-life`
          );
          setLives((prev) => Math.max(0, prev - 1));
          setStreak(0);
          setWrongAnswers((prev) => prev + 1);
        } else {
          setCorrectAnswers((prev) => prev + 1);
          setStreak((prev) => prev + 1);
          if ((streak + 1) % 3 === 0) {
            await axios.post(
              `${backendURL}/api/lives/email/${userEmail}/gain-life`
            );
            setLives((prev) => prev + 1);
            toast.success("Streak bonus! +1 life");
          }
          await axios.post(
            `${backendURL}/api/points/email/${userEmail}/gain-points`,
            { points: 10 }
          );
        }
      } catch (error) {
        console.error("Error updating lives/points:", error);
        toast.error("Failed to update lives/points. Please try again.");
      }
      return;
    }

    setAttempts((prev) => prev + 1);
    if (attempts + 1 >= totalQuestions || lives <= 0) {
      setQuizFinished(true);
      toast.success("Quiz completed!");
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswerIndex(null);
    setShowResult(false);
  };

  const handleBack = () => {
  if (location.state?.fromLecture) {
    // go back to the LectureorQuiz screen, carrying the same lessonKey + difficulty/step
    navigate(`/page/${lessonKey}`, {
      state: {
        lessonKey,
        difficulty: location.state.difficulty,
        step:       location.state.step,
      },
    });
  } else {
    console.log("Back button clicked, but no fromLecture state.");
  }
};
  // NEW: Automatically update quiz progress and navigate to finish when quiz is complete
  useEffect(() => {
    if (quizFinished && !hasUpdatedQuiz) {
      const progressKey = currentStep === 1 ? "step1Quiz" : "step2Quiz";
      updateProgress(level, lessonKey, progressKey);
      console.log(
        `Automatically updated progress for ${lessonKey} ${progressKey}`
      );
      setHasUpdatedQuiz(true);
      // Navigate immediately without delay and pass lesson info
      navigate("/finish", {
        state: { correctAnswers, wrongAnswers, lessonKey, level },
      });
    }
  }, [
    quizFinished,
    hasUpdatedQuiz,
    currentStep,
    updateProgress,
    level,
    lessonKey,
    navigate,
    correctAnswers,
    wrongAnswers,
  ]);

  if (quizQuestions.length === 0 && !quizFinished) {
    return <div>Loading quiz...</div>;
  }

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={handleBack}>
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />
        <p>Back</p>
      </div>
      <div className="lives-quizz d-flex position-absolute gap-4">
        <LivesandDiamonds />
      </div>
      {/* Only render the progress bar when quiz is in progress */}
      {!quizFinished && (
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={(attempts / totalQuestions) * 100}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar"
            style={{ width: `${(attempts / totalQuestions) * 100}%` }}
          ></div>
        </div>
      )}

      {quizFinished ? null : (
        <>
          <div className="quiz-container fw-bold d-flex">
            <p className="quiz-question">{currentQuestion.question}</p>
          </div>

          <div className="grid text-center fw-bold rounded-4">
            {currentQuestion.choices.map((option, index) => (
              <div
                key={`${currentQuestion.question}-${index}`}
                className={`choices d-flex justify-content-between align-items-center rounded-4 col-md-6 col-lg-11 m-5 ${
                  selectedAnswerIndex === index ? "selected" : ""
                }`}
                onClick={() => handleChoiceClick(index)}
                style={{ pointerEvents: showResult ? "none" : "auto" }}
              >
                <div
                  className={`choice-${["A", "B", "C", "D"][index].toLowerCase()} rounded-4 m-4 ${
                    selectedAnswerIndex === index ? "selected" : ""
                  }`}
                >
                  <strong>{["A", "B", "C", "D"][index]}</strong>
                  <video
                    width="200"
                    height="150"
                    className="rounded-2 mb-1" 
                    autoPlay
                    muted
                    loop
                  >
                    <source src={option.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}
          </div>

          {showResult && (
            <div
              className={`result-ans d-flex justify-content-between text-center ps-5 fs-2 ${
                isCorrect ? "correct-ans" : "wrong-ans"
              }`}
              style={{
                height: "12vh",
                marginTop: "-2.9rem",
              }}
            >
              <span className="me-auto mb-5 text-nowrap">
                {isCorrect ? "Correct answer!" : "Wrong answer"}
              </span>
              {isCorrect && (
                <img
                  src={check}
                  className="check-icon mt-5 me-4"
                  alt="Correct"
                />
              )}
              {!isCorrect && (
                <img src={ekis} className="ekis-icon" alt="Wrong" />
              )}
            </div>
          )}

          <button
            type="button"
            className="continue d-flex rounded-4 p-3 pt-2 ms-auto"
            onClick={handleNext}
            disabled={lives <= 0}
          >
            Next
            <img
              src={arrow}
              className="img-fluid d-flex ms-auto p-1 mt-1"
              alt="Next"
            />
          </button>
        </>
      )}
    </>
  );
}

export default Quiz;
