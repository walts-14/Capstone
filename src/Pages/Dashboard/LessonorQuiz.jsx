import React from "react";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";
import { useNavigate } from "react-router-dom";

function LectureorQuiz() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={backkpoint}
          class="img-fluid w-50 h-50 p-1 mt-2"
          alt="ideas image"
          onClick={() => navigate("/dashboard")}
        />
        <p>Back</p>
      </div>

      <div className="lecture-quiz-container d-flex justify-content-center fw-bold col-md-6:">
        <div className="lecture-outer justify-content-center rounded-5">
          <p>Lecture</p>
          <div className="lecture-inner justify-content-center align-items-center">
            <img src={Video} class="img-fluid" alt="video image" />
          </div>
        </div>
        <div className="quiz-outer justify-content-center rounded-5">
          <p>Quiz</p>

          <div
            className="quiz-inner justify-content-center"
            onClick={() => navigate("/quiz")}
          >
            <img
              src={Ideas}
              class="img-fluid"
              alt="ideas image"
              onClick={() => navigate("/quiz")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LectureorQuiz;
