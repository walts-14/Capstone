import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";
import heart from "../../assets/heart.png";
import diamond from "../../assets/diamond.png";
import LessonTermsData from "../Library/Terms/LessonTerms";

function LectureorQuiz({ LessonTerms: propLessonTerms }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const difficulty = location.state?.difficulty || "BASIC"; // Default to BASIC
  const difficultyColors = {
    BASIC: "#3498db", // Blue
    INTERMEDIATE: "#dcbc3d", // Yellow
    ADVANCED: "#cc6055", // Red
  };
  const routeTermId = params.termId;
  const { lessonKey: stateLessonKey, termId: stateTermId } =
    location.state || {};
  const lessonKey = stateLessonKey || routeTermId;
  const numericTermId = stateTermId;
  const LessonTerms =
    propLessonTerms || (lessonKey ? LessonTermsData[lessonKey] || [] : []);

  const handleClick = () => {
    if (lessonKey && LessonTerms.length > 0) {
      navigate(`/lesonecontent/${lessonKey}/${LessonTerms[0].id}`, {
        state: {
          showButton: true,
          fromLecture: true,
          lessonKey,
          termId: LessonTerms[0].id,
        },
      });
    }
  };

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/dashboard")}
      >
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />
        <p>Back</p>
      </div>
      <div className="status-bar">
        <div
          className="difficulty text-center"
          style={{ backgroundColor: difficultyColors[difficulty] }}
        >
          {difficulty}
        </div>

        <div className="lives">
          <img src={heart} className="img-fluid" alt="Lives" />
          <span>5</span>
        </div>
        <div className="diamonds">
          <img src={diamond} className="img-fluid" alt="Diamonds" />
          <span>100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container mb-5">
        <div className="progress-step1">1</div>
        <div className="progress-line"></div>
        <div className="progress-step2">2</div>
      </div>

      <div className="lecture-quiz-container d-flex justify-content-center fw-bold col-md-6">
        <div
          className="lecture-outer justify-content-center rounded-5"
          onClick={handleClick}
        >
          <p className="fs-md-5">Lecture</p>
          <div className="lecture-inner justify-content-center align-items-center">
            <img src={Video} className="img-fluid" alt="Lecture Video" />
          </div>
        </div>
        <div
          className="quiz-outer justify-content-center rounded-5"
          onClick={() => navigate(`/quiz/${lessonKey}`)}
        >
          <p>Quiz</p>
          <div className="quiz-inner justify-content-center">
            <img src={Ideas} className="img-fluid" alt="Quiz Icon" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LectureorQuiz;
