
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";
import axios from "axios";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import ResultBanner from "./ResultBanner";
import LazyVideo from "./LazyVideo";

function Practice() {
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
  const totalQuestions = 5; // Practice mode: 5 questions

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const backendURL = "http://localhost:5000";

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
        const response = await axios.get(
          `${backendURL}/api/quizzes/stored`,
          { params: { level, lessonNumber, quizPart } }
        );
        const limited = Array.isArray(response.data)
          ? response.data.slice(0, totalQuestions)
          : [];
        setQuizQuestions(limited);
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setShowResult(false);
        setIsCorrect(false);
        setQuizFinished(false);
      } catch (error) {
        toast.error("Failed to load practice questions. Please try again.");
      }
    };
    fetchQuizQuestions();
  }, [level, lessonKey, quizPart, backendURL]);

  useEffect(() => {
    if (!quizQuestions.length) return;
    const links = quizQuestions.flatMap(q =>
      q.choices.map(({ videoUrl }) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = videoUrl;
        document.head.appendChild(link);
        return link;
      })
    );
    return () => { links.forEach(link => document.head.removeChild(link)); };
  }, [quizQuestions]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleChoiceClick = (index) => {
    if (showResult) return;
    setSelectedAnswerIndex(index);
    const selectedChoice = currentQuestion.choices[index];
    setIsCorrect(selectedChoice.videoId === currentQuestion.correctAnswer);
  };

  const handleNext = async () => {
    if (selectedAnswerIndex === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }
    if (!showResult) {
      setShowResult(true);
      // Practice mode: no points awarded, no life deduction
      if (isCorrect) setCorrectAnswers(prev => prev + 1);
      else setWrongAnswers(prev => prev + 1);
      return;
    }

    if ((currentQuestionIndex + 1) >= totalQuestions) {
      setQuizFinished(true);
      toast.success("Practice completed!");
      navigate("/finish", {
        state: { correctAnswers, wrongAnswers, lessonKey, level, mode: "practice", currentStep },
      });
      return;
    }
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswerIndex(null);
    setShowResult(false);
  };

  const handleBack = () => {
    navigate(`/page/${lessonKey}`, {
      state: {
        lessonKey,
        difficulty: location.state?.difficulty,
        step: location.state?.step,
      },
    });
  };

  if (quizQuestions.length === 0 && !quizFinished) {
    return <div>Loading practice...</div>;
  }

  return (
    <div className="practice-mode">
      <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />
        <p>Back</p>
      </div>
      <div className="lives-quizz d-flex position-absolute gap-4">
        <LivesandDiamonds showDiamonds={false} showLives={false} />
      </div>
      {!quizFinished && (
        <div className="progress" role="progressbar" aria-valuenow={(currentQuestionIndex / totalQuestions) * 100} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}></div>
        </div>
      )}
      {quizFinished ? null : (
        <>
          <div className="quiz-container fw-bold d-flex">
            <p className="quiz-question">{currentQuestion.question}</p>
          </div>
          <div className="grid text-center fw-bold rounded-4 ">
            {currentQuestion.choices.map((option, index) => {
              const correctIndex = currentQuestion.choices.findIndex((c) => c.videoId === currentQuestion.correctAnswer);
              const isSelected = selectedAnswerIndex === index;
              let extraClass = "";
              if (isSelected) {
                extraClass = showResult ? (isCorrect ? " selected correct" : " selected wrong") : " selected";
              }
              if (showResult && !isCorrect && index === correctIndex) {
                extraClass = " correct";
              }
              return (
                <div
                  key={`${currentQuestion.question}-${index}`}
                  className={`choices d-flex justify-content-between align-items-center rounded-4 col-md-6 col-lg-11 m-5` + extraClass}
                  onClick={() => handleChoiceClick(index)}
                  style={{ pointerEvents: showResult ? "none" : "auto" }}
                >
                  <div className={`choice-${["A", "B", "C", "D"][index].toLowerCase()} rounded-4 m-4${isSelected ? " selected" : ""}`}>
                    <strong>{["A", "B", "C", "D"][index]}</strong>
                    <LazyVideo src={option.videoUrl} poster="path/to/placeholder.jpg" width={200} height={150} />
                  </div>
                </div>
              );
            })}
          </div>
          {showResult && (
            <ResultBanner isCorrect={isCorrect} checkIcon={check} wrongIcon={ekis} />
          )}
          <button type="button" className="continue d-flex rounded-4 p-3 pt-2 ms-auto" onClick={handleNext}>
            Next
            <img src={arrow} className="img-fluid d-flex ms-auto p-1 mt-1" alt="Next" />
          </button>
        </>
      )}
    </div>
  );
}

export default Practice;
