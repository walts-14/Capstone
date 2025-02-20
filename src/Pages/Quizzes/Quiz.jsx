import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import "../../css/LessonorQuiz.css";
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
        onClick={() => navigate("/page1")}
      >
        <img
          src={backkpoint}
          class="img-fluid w-50 h-50 p-1 mt-2"
          alt="ideas image"
          onClick={() => navigate("/page1")}
        />
        <p>Back</p>
      </div>

      <div className="quiz-container">
            <h2>Quiz Question</h2>
            <p className="quiz-question">{quiz.question}</p> {/* ✅ Display question only */}
        </div>

    </>
  );
}

export default Quiz;
