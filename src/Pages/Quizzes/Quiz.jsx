import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [attempts, setAttempts] = useState(0); // Track attempts
  const navigate = useNavigate();

  // Fetch quiz when the component mounts
  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quiz");
      console.log("Quiz data:", response.data);
      setQuiz(response.data);
      setSelectedAnswer(null); // Reset selection for the new question
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  const handleChoiceClick = (choice) => {
    setSelectedAnswer(choice);

    if (choice === quiz.answer) {
      console.log("✅ Correct answer selected:", choice);
      navigate("/correct"); // Redirect to correct page
    } else {
    //  navigate("/wrong");
      console.log("❌ Wrong answer:", choice);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }

    setAttempts((prev) => prev + 1); // Increase attempt count
    if (attempts >= 10) {
      toast.success("Quiz completed!"); // Optional: Redirect to summary page
      return;
    }

    fetchQuiz(); // Fetch a new quiz when clicking "Next"
  };

  return (
    <>
      <div className="back fs-1 fw-bold d-flex" onClick={() => navigate("/page/termsone")}>
        <img src={backkpoint} className="img-fluid w-50 h-50 p-1 mt-2" alt="Back" />
        <p>Back</p>
      </div>

      <div className="progress" role="progressbar" aria-valuenow={(attempts / 10) * 100} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar" style={{ width: `${(attempts / 10) * 100}%` }}></div>
      </div>

      <div className="quiz-container fw-bold">
        <p className="quiz-question">{quiz.question}</p>
      </div>

      <div className="grid text-center fw-bold rounded-4">
        {["a", "b", "c", "d"].map((choice, index) => (
          <div
            key={index}
            className={`choices rounded-4 col-md-6 col-lg-11 m-5 ${selectedAnswer === choice ? "selected" : ""}`}
            onClick={() => handleChoiceClick(choice)}
          >
            <div className={`choice-${choice} rounded-4 m-4 ${selectedAnswer === choice ? "selected" : ""}`}>
              {choice}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="continue d-flex rounded-4 p-3 pt-2 ms-auto" onClick={handleNext}>
        Next
        <img src={arrow} className="img-fluid d-flex ms-auto p-1 mt-1" alt="Next" />
      </button>
    </>
  );
}

export default Quiz;
