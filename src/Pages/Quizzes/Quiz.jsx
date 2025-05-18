import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";
import axios from "axios";
import { ProgressContext } from "../../../src/Pages/Dashboard/ProgressContext";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import ResultBanner from "./ResultBanner";
import dashboardlogo from "../../assets/dashboardlogo.png";
import failed from "../../assets/failedquiz.png";
import retry from "../../assets/repeat logo.png";
import LivesRunOut from "./Livesrunout";
import LazyVideo from "./LazyVideo";

function Quiz() {
  const navigate = useNavigate();
  const { lessonKey } = useParams();
  const location = useLocation();
  const currentStep = location.state?.currentStep || 1;

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
  const quizPart = currentStep;
  const totalQuestions = 10;

  const minPointsRequired = {
    basic: 70,
    intermediate: 105,
    advanced: 140,
  };

  const pointsPerCorrectAnswer = 10;

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [hasUpdatedQuiz, setHasUpdatedQuiz] = useState(false);
  const [failedPointsRequirement, setFailedPointsRequirement] = useState(false);

  
  const [lives, setLives] = useState(5);
  const [streak, setStreak] = useState(0);

  const backendURL = "http://localhost:5000";

  const { updateProgress } = useContext(ProgressContext);

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) return;
        const response = await axios.get(
          `${backendURL}/api/lives/email/${userEmail}`
        );
        setLives(response.data.lives);
      } catch (error) {
        toast.error("Failed to fetch lives. Please try again.");
      }
    };
    fetchLives();
  }, [backendURL]);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const lessonNumberMapping = {
          termsone: 1,
          termstwo: 2,
          termsthree: 3,
          termsfour: 4,
          termsfive: 5,
          termssix: 6,
          termsseven: 7,
          termseight: 8,
          termsnine: 9,
          termsten: 10,
          termseleven: 11,
          termstwelve: 12,
        };
        const lessonNumber = lessonNumberMapping[lessonKey] || 1;
        const response = await axios.get(
          `${backendURL}/api/quizzes/stored`,
          {
            params: { level, lessonNumber, quizPart },
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
        setFailedPointsRequirement(false);
        setHasUpdatedQuiz(false);
      } catch (error) {
        toast.error("Failed to load quiz questions. Please try again.");
      }
    };
    fetchQuizQuestions();
  }, [level, lessonKey, quizPart, backendURL]);
  
    // after your fetchQuizQuestions useEffect
  useEffect(() => {
    if (!quizQuestions.length) return;

    // for each choice across all questions, insert a <link preload> into <head>
    const links = quizQuestions.flatMap(q =>
      q.choices.map(({ videoUrl }) => {
        const link = document.createElement("link");
        link.rel   = "preload";
        link.as    = "video";
        link.href  = videoUrl;
        document.head.appendChild(link);
        return link;
      })
    );

    // cleanup on unmount or when questions change
    return () => {
      links.forEach(link => document.head.removeChild(link));
    };
  }, [quizQuestions]);

  
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleChoiceClick = (index) => {
    if (showResult || lives <= 0) return;
    setSelectedAnswerIndex(index);
    const selectedChoice = currentQuestion.choices[index];
    setIsCorrect(selectedChoice.videoId === currentQuestion.correctAnswer);
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
          await axios.post(`${backendURL}/api/lives/email/${userEmail}/lose-life`);
          setLives((prev) => Math.max(0, prev - 1));
          setStreak(0);
          setWrongAnswers((prev) => prev + 1);
        } else {
          setCorrectAnswers((prev) => prev + 1);
          setStreak((prev) => prev + 1);
          if ((streak + 1) % 3 === 0) {
            await axios.post(`${backendURL}/api/lives/email/${userEmail}/gain-life`);
            setLives((prev) => prev + 1);
            toast.success("Streak bonus! +1 life");
          }
          await axios.post(`${backendURL}/api/points/email/${userEmail}/gain-points`, { points: 10 });
        }
      } catch (error) {
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
    navigate(`/page/${lessonKey}`, {
      state: {
        lessonKey,
        difficulty: location.state.difficulty,
        step: location.state.step,
      },
    });
  };

  const handleRetry = () => {
    setQuizFinished(false);
    setFailedPointsRequirement(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setAttempts(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setShowResult(false);
    setIsCorrect(false);
    setHasUpdatedQuiz(false);
  };

   const failMessages = [
    "You've almost got it!",
    "Keep going—you’re close!",
    "Don’t give up now!",
    "You can do this!",
    "Almost there—try again!",
  ];
  // pick one at random
  const failHeading =
    failMessages[Math.floor(Math.random() * failMessages.length)];

  useEffect(() => {
    if (quizFinished && !hasUpdatedQuiz) {
      const userPoints = correctAnswers * pointsPerCorrectAnswer;
      const requiredPoints = minPointsRequired[level] || 70;
      if (userPoints < requiredPoints) {
        setFailedPointsRequirement(true);
        toast.error(`You need at least ${requiredPoints} points to proceed. Your score: ${userPoints}`);
        return;
      }
      const progressKey = currentStep === 1 ? "step1Quiz" : "step2Quiz";
      updateProgress(level, lessonKey, progressKey);
      setHasUpdatedQuiz(true);
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

    // if they ever run out of lives, immediately show the “Out of Lives” screen:
  if (lives <= 0 && !failedPointsRequirement) {
    return <LivesRunOut />;
  }

  if (quizQuestions.length === 0 && !quizFinished) {
    return <div>Loading quiz...</div>;
  }

  if (failedPointsRequirement) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center gap-2">
        <img src={failed} alt="" />
        <div className="stats-quiz d-flex flex-row gap-1 text-center">
                  <img src={check} className="tama img-fluid p-1" alt="check img" />
                  <p className="check-number ms-1 fs-1">{correctAnswers}</p>
                  <img src={ekis} className="mali img-fluid p-1 ms-5" alt="ekis img" />
                  <p className="ekis-number ms-1 fs-1" >{wrongAnswers}</p>
                </div>
        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
          <h1 >{failHeading}</h1>
           <h2 style={{ color: 'gray' }}>You need at least 7 correct answers to pass the quiz</h2>
        </div>
        <div className="finishbuttons rounded-4 d-flex align-items-center justify-content-center gap-4">
          <button
            type="button"
            className="dashboard-button d-flex justify-content-center align-items-center rounded-4 fs-1"
            onClick={() => navigate("/dashboard")}
          >
            <img
              src={dashboardlogo}
              className="img-fluid d-flex p-1 mt-1"
              alt="dashboard img"
            />
            Dashboard
          </button>

          <button className="retry-button d-flex flex-direction-row justify-content-center align-items-center" onClick={handleRetry}>
            <img
              src={retry}
              className="img-fluid "
              alt="dashboard img"
            />
            <p>Try again</p>
          </button>
        </div>
      </div>
     
    );
  }

  return (
    <>
      <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />
        <p>Back</p>
      </div>
      <div className="lives-quizz d-flex position-absolute gap-4">
        <LivesandDiamonds showDiamonds={false} />
      </div>
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
            {currentQuestion.choices.map((option, index) => {
              const correctIndex = currentQuestion.choices.findIndex(
                (c) => c.videoId === currentQuestion.correctAnswer
              );
              const isSelected = selectedAnswerIndex === index;
              let extraClass = "";
              if (isSelected) {
                extraClass = showResult
                  ? isCorrect
                    ? " selected correct"
                    : " selected wrong"
                  : " selected";
              }
              if (showResult && !isCorrect && index === correctIndex) {
                extraClass += " correct";
              }
              return (
                <div
                  key={`${currentQuestion.question}-${index}`}
                  className={
                    `choices d-flex justify-content-between align-items-center 
                     rounded-4 col-md-6 col-lg-11 m-5` + extraClass
                  }
                  onClick={() => handleChoiceClick(index)}
                  style={{ pointerEvents: showResult ? "none" : "auto" }}
                >
                  <div
                    className={`choice-${
                      ["A", "B", "C", "D"][index].toLowerCase()
                    } rounded-4 m-4${isSelected ? " selected" : ""}`}
                  >
                    <strong>{["A", "B", "C", "D"][index]}</strong>
                     <LazyVideo
   src={option.videoUrl}
   poster="path/to/placeholder.jpg" 
   width={200}
   height={150}
 />
                  </div>
                </div>
              );
            })}
          </div>
          {showResult && (
            <ResultBanner
              isCorrect={isCorrect}
              checkIcon={check}
              wrongIcon={ekis}
            />
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
