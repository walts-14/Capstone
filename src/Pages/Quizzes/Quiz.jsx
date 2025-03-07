import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import { questions } from "./QuizQuestions/Questions";
import arrow from "../../assets/arrow.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";

function Quiz() {
  const navigate = useNavigate();
  const totalQuestions = 10;
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [attempts, setAttempts] = useState(0);

  // Store remaining questions
  const [remainingQuestions, setRemainingQuestions] = useState([
    ...questions.lessson1_Part1,
  ]);

  useEffect(() => {
    selectRandomQuestion();
  }, []); // Run once when component mounts

  const selectRandomQuestion = () => {
    if (remainingQuestions.length === 0) {
      toast.success("Quiz completed!");
      navigate("/finish");
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selectedQuiz = remainingQuestions[randomIndex];

    // Update remaining questions **before updating state**
    const newRemainingQuestions = remainingQuestions.filter(
      (_, index) => index !== randomIndex
    );
    setRemainingQuestions(newRemainingQuestions);

    // Ensure full question, including choices, updates
    setQuiz({ ...selectedQuiz });

    setSelectedAnswer(null); // Reset selected answer for the new question
  };

  useEffect(() => {
    if (quiz) {
      console.log("Updated Question:", quiz.question);
      console.log("Updated Choices:", quiz.answerOptions);
    }
  }, [quiz]); // Log changes to verify updates

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  const handleChoiceClick = (index) => {
    setSelectedAnswer(index);
    console.log(
      quiz.answerOptions[index].isCorrect
        ? "✅ Correct answer"
        : "❌ Wrong answer",
      index
    );
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }

    setAttempts((prev) => prev + 1);
    if (attempts + 1 >= totalQuestions) {
      toast.success("Quiz completed!");
      navigate("/finish");
      return;
    }

    selectRandomQuestion(); // Select a new question on next click
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
          alt="Back"
        />
        <p>Back</p>
      </div>

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

      <div className="quiz-container fw-bold">
        <p className="quiz-question">{quiz.question}</p>
      </div>

      <div className="grid text-center fw-bold rounded-4">
        {quiz.answerOptions.map((option, index) => (
          <div
            key={`${quiz.question}-${index}`} // Unique key to ensure re-render
            className={`choices d-flex justify-content-between align-items-center rounded-4 col-md-6 col-lg-11 m-5 ${
              selectedAnswer === index ? "selected" : ""
            }`}
            onClick={() => handleChoiceClick(index)}
          >
            <div
              className={`choice-${["A", "B", "C", "D"][
                index
              ].toLowerCase()} rounded-4 m-4 ${
                selectedAnswer === index ? "selected" : ""
              }`}
            >
              <strong>{["A", "B", "C", "D"][index]}</strong>
              <video width="200" height="150" controls>
                <source src={option.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="continue d-flex rounded-4 p-3 pt-2 ms-auto"
        onClick={handleNext}
      >
        Next
        <img
          src={arrow}
          className="img-fluid d-flex ms-auto p-1 mt-1"
          alt="Next"
        />
      </button>
    </>
  );
}

export default Quiz;
