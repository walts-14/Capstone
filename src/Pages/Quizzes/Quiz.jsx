import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import "../../css/Quiz.css";
import axios from "axios";

function Quiz() {
  const [quiz, setQuiz] = useState(null);
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
    return <div>Loading quiz...</div>;
  }

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/page/termsone")}
      >
        <img
          src={backkpoint}
          class="img-fluid w-50 h-50 p-1 mt-2"
          alt="ideas image"
          onClick={() => navigate("/page/termsone")}
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

      <div className="quiz-container fw-bold">
        <p className="quiz-question">{quiz.question}</p>{" "}
        {/* Display question only */}
      </div>

      <div className="grid text-center fw-bold rounded-4">
        <div className="choices rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choice-a rounded-4 m-4">a</div>
        </div>

        <div className="choices rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choice-b rounded-4 m-4">b</div>
        </div>

        <div className="choices rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choice-c rounded-4 m-4">c</div>
        </div>

        <div className="choices rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choice-d rounded-4 m-4">d</div>
        </div>
      </div>

      <button
        type="button"
        className="continue d-flex rounded-4 p-3 pt-2 ms-auto"
        onClick={() => navigate("/correct")}
      >
        Next
        <img
          src={arrow}
          class="img-fluid d-flex ms-auto p-1 mt-1  "
          alt="arrow img"
          onClick={() => navigate("/correct")}
        />
      </button>
    </>
  );
}

export default Quiz;
