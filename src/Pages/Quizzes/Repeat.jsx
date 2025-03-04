import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Repeat.css";
import repeatLogo from "../../assets/repeat logo.png";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import axios from "axios";

function Repeat() {
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

      <div className="quiz-container fw-bold">
        <p className="quiz-question">{quiz.question}</p>
        {/* Display question only */}
      </div>
      <div className="gridss text-center fw-bold rounded-4">
        <div className="pictureee-question d-flex rounded-4"></div>
        <div className="repeated-ans d-flex text-center justify-content-left ps-5 pt-3 fs-3">
          Repeated Items
          <img src={repeatLogo} class="img-fluid p-1 mt-1" alt="repeat img" />
        </div>
        <div className="choicessss rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choiceeee-a rounded-4 m-4">a</div>
        </div>

        <div className="choicessss rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choiceeee-b rounded-4 m-4">b</div>
        </div>

        <div className="choicessss rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choiceeee-c rounded-4 m-4">c</div>
        </div>

        <div className="choicessss rounded-4 col-md-6 col-lg-11 m-5">
          <div className="choiceeee-d rounded-4 m-4">d</div>
        </div>
      </div>

      <button
        type="button"
        className="continueeee d-flex rounded-4 p-3 pt-2 ms-auto"
        onClick={() => navigate("/finish")}
      >
        Next
        <img
          src={arrow}
          class="img-fluid d-flex ms-auto p-1 mt-1  "
          alt="arrow img"
          onClick={() => navigate("/finish")}
        />
      </button>
    </>
  );
}

export default Repeat;
