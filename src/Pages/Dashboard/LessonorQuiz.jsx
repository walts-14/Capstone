// src/Pages/Library/LectureorQuiz.jsx
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import LessonTermsData from "../Library/Terms/LessonTerms";

function LectureorQuiz({ LessonTerms: propLessonTerms }) {
  const navigate = useNavigate();
  const { termId: routeTermId } = useParams();
  const location = useLocation();

  // Use passed-in state.lessonKey or fallback to route param
  const lessonKey = location.state?.lessonKey || routeTermId;

  // Static or prop‐driven terms list
  const LessonTerms =
    propLessonTerms ||
    (lessonKey ? LessonTermsData[lessonKey] || [] : []);

  const [currentStep, setCurrentStep] = useState(1);

  const difficulty =
    location.state?.difficulty?.toUpperCase() || "BASIC";
  const difficultyColors = {
    BASIC: "#3498db",
    INTERMEDIATE: "#dcbc3d",
    ADVANCED: "#cc6055",
  };

  const handleLectureClick = () => {
    const sliceStart = currentStep === 1 ? 0 : 15;
    const filteredTerms = LessonTerms.slice(sliceStart, sliceStart + 15);

    if (filteredTerms.length > 0) {
      navigate(
        `/lesonecontent/${lessonKey}/${filteredTerms[0].id}`,
        {
          state: {
            showButton: true,
            fromLecture: true,
            lessonKey,
            // ← pass the step so LesoneContent locks its pagination
            step: currentStep,
          },
        }
      );
    } else {
      console.warn("No terms for step", currentStep);
    }
  };

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={backkpoint}
          className="img-fluid p-1 mt-1"
          alt="Back"
        />
        <p>Back</p>
      </div>

      <div className="container d-flex flex-column justify-content-center align-items-center">
        <div className="status-bar">
          <div
            className="difficulty text-center"
            style={{ backgroundColor: difficultyColors[difficulty] }}
          >
            {difficulty}
          </div>
          <LivesandDiamonds />
        </div>

        <div className={`progress-bar-container step-${currentStep}`}>
          <button
            className={`progress-step ${
              currentStep === 1 ? "active" : ""
            }`}
            onClick={() => setCurrentStep(1)}
          >
            1
          </button>
          <div className="progress-line" />
          <button
            className={`progress-step ${
              currentStep === 2 ? "active" : ""
            }`}
            onClick={() => setCurrentStep(2)}
          >
            2
          </button>
        </div>

        <div className="lecture-quiz-container">
          <div
            className="lecture-outer justify-content-center rounded-5"
            onClick={handleLectureClick}
          >
            <p className="fs-md-5">Lecture</p>
            <div className="lecture-inner justify-content-center align-items-center">
              <img src={Video} className="img-fluid" alt="Lecture Video" />
            </div>
          </div>

          <div
            className="quiz-outer justify-content-center rounded-5"
            onClick={() =>
              navigate(`/quiz/${lessonKey}`, {
                state: { currentStep },
              })
            }
          >
            <p>Quiz</p>
            <div className="quiz-inner justify-content-center">
              <img src={Ideas} className="img-fluid" alt="Quiz Icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LectureorQuiz;
