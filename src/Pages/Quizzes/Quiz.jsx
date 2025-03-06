import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import "../../css/Quiz.css";
import axios from "axios";

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [progress, setProgress] = useState(1); // Start at 1%
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quiz");
        console.log("Quiz data:", response.data);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, []);

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  const handleChoiceClick = (choice) => {
    setSelectedAnswer(choice);
  };

  const handleNextClick = () => {
    // Increase progress by 10% each time but cap at 100%
    setProgress((prev) => (prev + 10 > 100 ? 100 : prev + 10));

    // Navigate to the next page
    navigate("/correct");
  };

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/page/termsone")}
      >
        <img
          src={backkpoint}
          className="img-fluid w-50 h-50 p-1 mt-2"
          alt="ideas image"
        />
        <p>Back</p>
      </div>

      {/* Progress Bar */}
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-container fw-bold">
        <p className="quiz-question">{quiz.question}</p>
      </div>

      <div className="grid text-center fw-bold rounded-4">
        {["a", "b", "c", "d"].map((choice, index) => (
          <div
            key={index}
            className={`choices rounded-4 col-md-6 col-lg-11 m-5 ${
              selectedAnswer === choice ? "selected" : ""
            }`}
            onClick={() => handleChoiceClick(choice)}
          >
            <div
              className={`choice-${choice} rounded-4 m-4 ${
                selectedAnswer === choice ? "selected" : ""
              }`}
            >
              {choice}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="continue d-flex rounded-4 p-3 pt-2 ms-auto"
        onClick={handleNextClick}
      >
        Next
        <img
          src={arrow}
          className="img-fluid d-flex ms-auto p-1 mt-1"
          alt="arrow img"
        />
      </button>
    </>
  );
}

export default Quiz;
