import React from "react";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";

function LectureorQuiz() {
  return (
    <>
      <a href="/dashboard">
        <div className="back fs-1 fw-bold">
          <p>Back</p>
        </div>
      </a>
      <div className="lecture-quiz-container d-flex fw-bold">
        <div className="lecture-outer rounded-5">
          <p>Lecture</p>
          <div className="lecture-inner"></div>
        </div>
        <div className="quiz-outer rounded-5">
          <p>Quiz</p>
          <div className="quiz-inner"></div>
        </div>
      </div>
    </>
  );
}

export default LectureorQuiz;
