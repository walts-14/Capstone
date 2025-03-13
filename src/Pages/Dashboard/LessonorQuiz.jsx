import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";

function LectureorQuiz({ termId, LessonTerms }) {
  const navigate = useNavigate();

  // Handle navigation: use the lesson key (termId) and retrieve the first term's numerical id from LessonTerms.
  const handleClick = () => {
    if (termId && LessonTerms && LessonTerms.length > 0) {
      // Navigate to the URL with both the lesson key and the first term's numerical ID.
      navigate(`/lesonecontent/${termId}/${LessonTerms[0].id}`);
    } else {
      console.log("No valid lesson data found!");
    }
  };

  console.log("Received LessonTerms in LectureorQuiz:", LessonTerms);
  console.log("Received termId in LectureorQuiz:", termId);

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={backkpoint}
          className="img-fluid w-50 h-50 p-1 mt-2"
          alt="Back"
        />
        <p>Back</p>
      </div>

      <div className="lecture-quiz-container d-flex justify-content-center fw-bold col-md-6">
        <div
          className="lecture-outer justify-content-center rounded-5"
          onClick={handleClick} // Navigates using the lesson key and the first term's numerical id.
        >
          <p>Lecture</p>
          <div className="lecture-inner justify-content-center align-items-center">
            <img src={Video} className="img-fluid" alt="Lecture Video" />
          </div>
        </div>
        <div className="quiz-outer justify-content-center rounded-5">
          <p>Quiz</p>
          <div
            className="quiz-inner justify-content-center"
            onClick={() => navigate("/quiz")}
          >
            <img src={Ideas} className="img-fluid" alt="Quiz Icon" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LectureorQuiz;
