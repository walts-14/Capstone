import React, { useState, useEffect } from "react";
import "../../css/Correct.css";
import { useNavigate } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import axios from "axios";

function Correct() {
  const [quiz, setQuiz] = useState({ question: "Sample Question?" });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quiz");
        console.log("Quiz data:", response.data);
        setQuiz(response.data); // ✅ Store full quiz object
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, []);

  if (!quiz) {
    return (
      <div>
        <p>Loading quiz...</p>
        <div className="quiz-container fw-bold">
          <p className="quiz-question">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/page")}
      >
        <img
          src={backkpoint}
          class="img-fluid w-50 h-50 p-1 mt-2"
          alt="ideas image"
          onClick={() => navigate("/page")}
        />
        <p>Back</p>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar w-75"></div>
      </div>

      <div className="quiz-container d-flex fw-bold">
        <p className="quiz-question">{quiz.question}</p>
        {/* Display question only */}
      </div>

      <div className="gridd text-center fw-bold rounded-4">
        <div className="picture-question d-flex ms-auto rounded-4"></div>
        <div className="correct-ans d-flex text-center justify-content-left ps-5 pt-3 fs-3">
          Correct Answer
          <img src={check} class="img-fluid p-1 mt-1" alt="check img" />
        </div>
        <div className="choicess rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choicee-a rounded-4 m-4">a</div>
        </div>

        <div className="choicess rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choicee-b rounded-4 m-4">b</div>
        </div>

        <div className="choicess rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choicee-c rounded-4 m-4">c</div>
        </div>

        <div className="choicess rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choicee-d rounded-4 m-4">d</div>
        </div>
      </div>

      <button
        type="button"
        className="continuee d-flex rounded-4 p-3 pt-2 ms-auto"
        onClick={() => navigate("/wrong")}
      >
        Next
        <img
          src={arrow}
          class="img-fluid d-flex ms-auto p-1 mt-1  "
          alt="arrow img"
          onClick={() => navigate("/wrong")}
        />
      </button>
    </>
  );
}

export default Correct;
