import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";
import { questions } from "./QuizQuestions/Questions";
import axios from "axios";
import { ProgressContext } from "../../../src/Pages/Dashboard/ProgressContext"; // NEW: Import progress context
import LivesandDiamonds from "../../Components/LiveandDiamonds";

function Quiz() {
  const navigate = useNavigate();
  const { lessonKey } = useParams(); // e.g., "termsone", "termstwo", etc.
  const location = useLocation();
  const currentStep = location.state?.currentStep || 1; // Default to step 1 if not passed

  // NEW: Determine level based on lessonKey
  const level = lessonKey.startsWith("terms") ? "basic" : "intermediate";

  // Mapping of lessonKey to question set (nested by step)
  const quizMapping = {
    termsone: {
      1: questions.lesson1_Part1,
      2: questions.lesson1_Part2,
    },
    termstwo: {
      1: questions.lesson2_Part1,
      2: questions.lesson2_Part2,
    },
    termsthree: {
      1: questions.lesson3_Part1,
      2: questions.lesson3_Part2,
    },
    termsfour: {
      1: questions.lesson4_Part1,
      2: questions.lesson4_Part2,
    }
    // Add additional mappings as needed...
  };

  const quizQuestions = quizMapping[lessonKey]
    ? quizMapping[lessonKey][currentStep] || []
    : [];
  const totalQuestions = 10;

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState([
    ...quizQuestions,
  ]);
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

  useEffect(() => {
    if (!quizFinished) {
      selectRandomQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished]);

  // Shuffle answer options for the selected question
  const selectRandomQuestion = () => {
    if (
      remainingQuestions.length === 0 ||
      attempts >= totalQuestions ||
      lives <= 0
    ) {
      setQuizFinished(true);
      toast.success("Quiz completed!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selectedQuiz = remainingQuestions[randomIndex];
    // Shuffle answer options randomly
    const shuffledOptions = [...selectedQuiz.answerOptions].sort(
      () => Math.random() - 0.5
    );
    const updatedQuiz = { ...selectedQuiz, answerOptions: shuffledOptions };

    setRemainingQuestions((prev) =>
      prev.filter((_, index) => index !== randomIndex)
    );
    setQuiz(updatedQuiz);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleChoiceClick = (index) => {
    if (showResult || lives <= 0) return;
    setSelectedAnswer(index);
    const isCorrectAnswer = quiz.answerOptions[index].isCorrect;
    setIsCorrect(isCorrectAnswer);
  };

  const handleNext = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (selectedAnswer === null) {
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

    selectRandomQuestion();
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
      navigate("/finish", { state: { correctAnswers, wrongAnswers, lessonKey, level } });
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

  if (!quiz && !quizFinished) {
    return <div>Loading quiz...</div>;
  }

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate(`/page/${lessonKey}`)}
      >
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
          <div className="quiz-container fw-bold">
            <p className="quiz-question">{quiz.question}</p>
          </div>

          <div className="grid text-center fw-bold rounded-4">
            {quiz.answerOptions.map((option, index) => (
              <div
                key={`${quiz.question}-${index}`}
                className={`choices d-flex justify-content-between align-items-center rounded-4 col-md-6 col-lg-11 m-5 ${
                  selectedAnswer === index ? "selected" : ""
                }`}
                onClick={() => handleChoiceClick(index)}
                style={{ pointerEvents: showResult ? "none" : "auto" }}
              >
                <div
                  className={`choice-${["A", "B", "C", "D"][index].toLowerCase()} rounded-4 m-4 ${
                    selectedAnswer === index ? "selected" : ""
                  }`}
                >
                  <strong>{["A", "B", "C", "D"][index]}</strong>
                  <video
                    width="200"
                    height="150"
                    className="rounded-2"
                    autoPlay
                    muted
                    loop
                  >
                    <source src={option.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}
          </div>

          {showResult && (
            <div
              className={`result-ans d-flex justify-content-between text-center ps-5 pt-3 fs-2 ${
                isCorrect ? "correct-ans" : "wrong-ans"
              }`}
            >
              <span className="me-auto">
                {isCorrect ? "Correct answer" : "Wrong answer"}
              </span>
              {isCorrect && (
                <img src={check} className="check-icon mt-5" alt="Correct" />
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
