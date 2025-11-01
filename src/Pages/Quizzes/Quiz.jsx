import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import diamond from "../../assets/diamond.png";
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
    intermediate: 70,
    advanced: 70,
  };

  const pointsPerCorrectAnswer = 10;

  const pointsTable = {
    basic: { 1: 10, 2: 10, 3: 5, 4: 2 },
    intermediate: { 1: 15, 2: 15, 3: 8, 4: 3 },
    advanced: { 1: 20, 2: 20, 3: 10, 4: 5 },
  };

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  // Change attempts to track per-question attempts as an object: { questionId: attemptCount }
  const [attempts, setAttempts] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [hasUpdatedQuiz, setHasUpdatedQuiz] = useState(false);
  const [failedPointsRequirement, setFailedPointsRequirement] = useState(false);
  const [backendAttemptNumber, setBackendAttemptNumber] = useState(null);
  const [backendTotalPoints, setBackendTotalPoints] = useState(null);

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
          termsnine: 1,
          termsten: 2,
          termseleven: 3,
          termstwelve: 4,
        };
        const lessonNumber = lessonNumberMapping[lessonKey] || 1;
        const response = await axios.get(`${backendURL}/api/quizzes/stored`, {
          params: { level, lessonNumber, quizPart },
        });
        setQuizQuestions(response.data);
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setAttempts({});
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
    const links = quizQuestions.flatMap((q) =>
      q.choices.map(({ videoUrl }) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = videoUrl;
        document.head.appendChild(link);
        return link;
      })
    );

    // cleanup on unmount or when questions change
    return () => {
      links.forEach((link) => document.head.removeChild(link));
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
    if (lives <= 0) {
      toast.error("No lives left. Cannot continue.");
      return;
    }
    const userEmail = localStorage.getItem("userEmail");
    if (selectedAnswerIndex === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }
    if (!showResult) {
      setShowResult(true);
      try {
        if (!isCorrect) {
          // Do not add points if answer is incorrect
          await axios.post(
            `${backendURL}/api/lives/email/${userEmail}/lose-life`
          );
          setLives((prev) => Math.max(0, prev - 1));
          setStreak(0);
          setWrongAnswers((prev) => prev + 1);
          return; // Early return to prevent points awarding
        }
        setCorrectAnswers((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        if ((streak + 1) % 3 === 0) {
          await axios.post(
            `${backendURL}/api/lives/email/${userEmail}/gain-life`
          );
          setLives((prev) => prev + 1);
          toast.success("Streak bonus! +1 life");
        }
        // Track per-question attempts locally for UI (won't affect server-side persisted quizAttempts)
        const questionId = currentQuestion._id || currentQuestion.question; // fallback to question text if no id
        const newAttemptCount = attempts[questionId] ? attempts[questionId] + 1 : 1;
        setAttempts((prev) => ({ ...prev, [questionId]: newAttemptCount }));
      } catch (error) {
        toast.error("Failed to update lives/points. Please try again.");
      }
      return;
    }
    // Increment attempt count for current question
    const questionId = currentQuestion._id || currentQuestion.question;
    setAttempts((prev) => ({
      ...prev,
      [questionId]: prev[questionId] ? prev[questionId] + 1 : 1,
    }));

    // Calculate total attempts so far (sum of all question attempts)
    const totalAttempts =
      Object.values(attempts).reduce((a, b) => a + b, 0) + 1;

    if (currentQuestionIndex + 1 >= totalQuestions || lives <= 0) {
      setQuizFinished(true);
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
    setAttempts({});
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setShowResult(false);
    setIsCorrect(false);
    setHasUpdatedQuiz(false);
  };

  const failMessages = [
    "ALMOST THERE! YOU'RE LEARNING FAST",
    "DON'T WORRY — EVERY PRO WAS ONCE A BEGINNER",
    "YOU DIDN'T FAIL, YOU JUST FOUND ONE MORE WAY TO IMPROVE",
    "TRY AGAIN! YOU'VE GOT THIS",
    "MISTAKES ARE PROOF YOU'RE TRYING",
    "YOU'RE ONE STEP CLOSER TO MASTERING THIS",
    "KEEP GOING, YOU'RE DOING GREAT",
    "You've almost got it!",
    "Keep going—you're close!",
    "Don't give up now!",
    "You can do this!",
    "Almost there—try again!",
  ];
  // pick one at random
  const failHeading =
    failMessages[Math.floor(Math.random() * failMessages.length)];

  useEffect(() => {
    if (quizFinished && !hasUpdatedQuiz) {
      // Only show failed result if all questions are answered
      if (currentQuestionIndex + 1 < totalQuestions) {
        // Not finished all questions yet, do not show failed result
        return;
      }
      const userPoints = correctAnswers * pointsPerCorrectAnswer;
      const requiredPoints = minPointsRequired[level] || 70;
      if (userPoints < requiredPoints) {
        // Persist an attempt server-side even on failure so attempt counters advance correctly
        (async () => {
          try {
            const userEmail = localStorage.getItem("userEmail");
            const lessonNumberMapping = {
              termsone: 1,
              termstwo: 2,
              termsthree: 3,
              termsfour: 4,
              termsfive: 5,
              termssix: 6,
              termsseven: 7,
              termseight: 8,
              termsnine: 1,
              termsten: 2,
              termseleven: 3,
              termstwelve: 4,
            };
            const lessonNumber = lessonNumberMapping[lessonKey] || 1;

            const respFail = await axios.post(`${backendURL}/api/quizzes/update-points`, {
              email: userEmail,
              level,
              lessonNumber,
              quizPart: currentStep,
              correctCount: correctAnswers,
            });
            const { attemptNumber: failAttemptNumber, totalPoints: failTotalPoints } = respFail.data || {};
            setBackendAttemptNumber(failAttemptNumber || null);
            setBackendTotalPoints(failTotalPoints || null);

            // Only set the failed UI once server has persisted the attempt
            setFailedPointsRequirement(true);
            toast.error(
              `You need at least ${requiredPoints} points to proceed. Your score: ${userPoints}`
            );
          } catch (err) {
            console.error("Failed to persist failed attempt:", err);
            // Even if persisting failed, still show the failed UI
            setFailedPointsRequirement(true);
            toast.error(
              `You need at least ${requiredPoints} points to proceed. Your score: ${userPoints}`
            );
          }
        })();
        return;
      }
      // Show success toast only when they actually pass
      toast.success("Quiz completed!");
      const progressKey = currentStep === 1 ? "step1Quiz" : "step2Quiz";

      // Prepare data to send to backend to update points and progress
      (async () => {
        try {
          const userEmail = localStorage.getItem("userEmail");
          const lessonNumberMapping = {
            termsone: 1,
            termstwo: 2,
            termsthree: 3,
            termsfour: 4,
            termsfive: 5,
            termssix: 6,
            termsseven: 7,
            termseight: 8,
            termsnine: 1,
            termsten: 2,
            termseleven: 3,
            termstwelve: 4,
          };
          const lessonNumber = lessonNumberMapping[lessonKey] || 1;

          const resp = await axios.post(`${backendURL}/api/quizzes/update-points`, {
            email: userEmail,
            level,
            lessonNumber,
            quizPart: currentStep,
            correctCount: correctAnswers,
          });

          // backend returns pointsEarned, totalPoints, passed, attemptNumber
          const { pointsEarned, totalPoints, passed, attemptNumber } = resp.data || {};
          // you can store totalPoints locally if needed (e.g., in context)
          // update progress only if backend recorded it
          updateProgress(level, lessonKey, progressKey);
          setHasUpdatedQuiz(true);
          navigate("/finish", {
            state: { correctAnswers, wrongAnswers, lessonKey, level, currentStep, pointsEarned, totalPoints, passed, attemptNumber },
          });
        } catch (err) {
          console.error("Failed to update backend points:", err);
          // Still proceed locally
          updateProgress(level, lessonKey, progressKey);
          setHasUpdatedQuiz(true);
          navigate("/finish", {
            state: { correctAnswers, wrongAnswers, lessonKey, level, currentStep },
          });
        }
      })();
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
  const userPoints = correctAnswers * pointsPerCorrectAnswer;
  const totalAttempts = Object.values(attempts || {}).reduce((a, b) => a + b, 0) + 1;
  const displayAttempt = backendAttemptNumber ?? totalAttempts;
  const displayTotalPoints = backendTotalPoints ?? "-";
    return (
      <div className="d-flex flex-column align-items-center justify-content-center gap-2" style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
        <img src={failed} alt="" className="mb-4" />

        <div className="stats-quiz d-flex flex-row gap-2 text-center fs-1 ">
          <img src={check} className="tama img-fluid p-1" alt="check img" />
          <p className="check-number " style={{ color: "#20BF55" }}>{correctAnswers}</p>
          <img src={ekis} className="mali img-fluid p-1 ms-5" alt="ekis img" />
          <p className="ekis-number " style={{ color: "#F44336" }}>{wrongAnswers}</p>
        </div>

        {/* Summary row: score and attempts. Points are intentionally omitted on failed results to avoid confusion. */}
        <div className="quiz-summary d-flex flex-row gap-4 align-items-center my-3">
          <div className="score-box text-center">
            <img src={check} alt="correct" style={{ width: 28, height: 28, marginBottom: 6 }} />
            <div style={{ color: "#20BF55", fontSize: "1.2rem" }}><strong>{correctAnswers} / {totalQuestions}</strong></div>
            <div style={{ color: "#878194" }}>{Math.round((correctAnswers / totalQuestions) * 100)}%</div>
          </div>

          <div className="attempts-box text-center">
            {/* Use retry icon to indicate try-again/attempts */}
            <img src={retry} alt="attempts" style={{ width: 28, height: 28, marginBottom: 6 }} />
            <div style={{ color: "#ffffff", fontSize: "1.2rem" }}><strong>#{displayAttempt}</strong></div>
            <div style={{ color: "#878194" }}>Attempts</div>
          </div>
        </div>

        <div className="d-flex flex-column align-items-center justify-content-center mb-4">
          <h1 className="text-white fw-bold text-uppercase mt-0" style={{ fontSize: "3rem", fontFamily: "Baloo, sans-serif" }}>{failHeading}</h1>
          <h2 style={{ fontSize: "2rem", fontFamily: "Baloo, sans-serif", color: "#878194" }}>
            You need at least 7 correct answers to pass the quiz
          </h2>
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

          <button
            className="retry-button d-flex flex-direction-row justify-content-center align-items-center"
            onClick={handleRetry}
          >
            <img src={retry} className="img-fluid " alt="retry img" />
            <p style={{ color: "white" }}>Try again</p>
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
          aria-valuenow={(currentQuestionIndex / totalQuestions) * 100}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar"
            style={{
              width: `${(currentQuestionIndex / totalQuestions) * 100}%`,
            }}
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
                    className={`choice-${["A", "B", "C", "D"][
                      index
                    ].toLowerCase()} rounded-4 m-4${isSelected ? " selected" : ""
                      }`}
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
            {showResult && (
              <ResultBanner
                isCorrect={isCorrect}
                checkIcon={check}
                wrongIcon={ekis}
              />
            )}
          </div>

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
        {/* Responsive styles for smooth transition */}
      <style>{`
       
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
          .progress {
            margin-left: 30px !important;
            margin-top: 15vh !important;
            align-items: center !important;          
            width: 185vw !important; 
            height: 30px !important;
            border-radius: 50px !important;
          }
          .grid {
            height: 530vh !important;
            width: 203.5vw !important;
            border-radius: 0px !important;
            gap: 170px 225px !important;
          }
          .choices {
            height: 40vh !important;
            width: 95vw !important;
            border-radius: 20px !important;
            position: relative !important;
            top: 45vh !important;
            right: 155px !important;
          }
          .choice-a, .choice-b, .choice-c, .choice-d {
            height: 10vh !important;
            width: 20vw !important;
            position: relative !important;
            bottom: 13vh !important;
            right: 35px !important;
          }
          .choice-a strong, .choice-b strong, .choice-c strong, .choice-d strong {
            margin-top: 8px !important;
          }
          .choice-a video, .choice-b video, .choice-c video, .choice-d video {
            width: 85vw !important;
            height: auto !important;
            max-width: 720px !important;
            max-height: 60vh !important;
            object-fit: contain !important;
            display: block !important;
            border: 2px solid #7338A0 !important;
            border-radius: 15px !important;
            margin: 0 0 0 0 !important;
            position: absolute !important;
            top: 11vh !important;
            left: 8.5rem !important;
            transform: translateX(-50%) !important;
            z-index: 1 !important;
          }
          
          .continue {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            position: absolute !important;
            top: 185vh !important;
            left: 35px !important;
            height: 15vh !important;
            width: 180vw !important;
            font-size: 4rem !important;
            padding-top: 20px !important;
          }
          .continue img {
            margin: 0px !important;
            margin-left: 10px !important;
            width: 4.3rem !important;
            height: 4rem !important;
          }
          .quiz-question {
            display: block !important;
            font-size: 3.4rem !important;
            position: fixed !important;
            left: 50% !important;
            top: 13rem !important;
            transform: translateX(-50%) !important;
            width: 190vw !important;
        
          }
          .back {
            display: flex !important;
            justify-content: center !important;
            position: fixed !important;
            left: 1rem !important;
            font-size: 3rem !important;
          }
          .back img {
            margin-top: 0.8rem !important;  
            width: 3rem !important;
            height: 2.5rem !important;
          }
          .lives-quizz {
            display: flex !important;
            position: absolute !important;
            top: 1.7rem !important;
            left: 32rem !important;
          }
        }
        
         /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 1023px) {

        }

        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
         
        }

      `}</style>
    </>
  );
}

export default Quiz;
