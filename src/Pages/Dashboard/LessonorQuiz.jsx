// src/Pages/Library/LectureorQuiz.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";
import LivesandDiamonds from "../../Components/LiveandDiamonds";

const levelMapping = {
  termsone:   "basic",
  termstwo:   "basic",
  termsthree: "basic",
  termsfour:  "basic",
  termsfive:  "intermediate",
  termssix:   "intermediate",
  termsseven: "intermediate",
  termseight: "intermediate",
  termsnine:  "advanced",
  termsten:   "advanced",
  termseleven:"advanced",
  termstwelve:"advanced",
};

const lessonNumberMapping = {
  termsone:    1,
  termstwo:    2,
  termsthree:  3,
  termsfour:   4,
  termsfive:   1,
  termssix:    2,
  termsseven:  3,
  termseight:  4,
  termsnine:   1,
  termsten:    2,
  termseleven: 3,
  termstwelve: 4,
};

function LectureorQuiz() {
  const navigate = useNavigate();
  const { termId: lessonKey } = useParams();    // your slug e.g. "termsfive"
  const location = useLocation();

  // DISPLAYED difficulty comes from the route state (set by the library page)
  const difficulty =
    location.state?.difficulty?.toUpperCase() || "BASIC";

  const difficultyColors = {
    BASIC:        "#3498db",
    INTERMEDIATE: "#dcbc3d",
    ADVANCED:     "#cc6055",
  };

  // FETCHED level/lessonNumber still comes from your slug
  const level        = levelMapping[lessonKey]       || "basic";
  const lessonNumber = lessonNumberMapping[lessonKey] || 1;

  const [lessonTerms, setLessonTerms] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const qs = new URLSearchParams({ level, lessonNumber });
    setLoading(true);
    fetch(`http://localhost:5000/api/videos?${qs}`)
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => a.termNumber - b.termNumber);
        setLessonTerms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching lesson terms", err);
        setLoading(false);
      });
  }, [level, lessonNumber]);

  const [currentStep, setCurrentStep] = useState(1);

  const sliceStart    = currentStep === 1 ? 0 : 15;
  const filteredTerms = lessonTerms.slice(sliceStart, sliceStart + 15);

  const handleLectureClick = () => {
    if (filteredTerms.length > 0) {
      navigate(
        `/lesonecontent/${lessonKey}/${filteredTerms[0]._id}`,
        {
          state: {
            showButton:  true,
            fromLecture: true,
            lessonKey,      // pass through for LesoneContent
            step: currentStep,
            difficulty,     // also pass difficulty forward if needed
          },
        }
      );
    } else {
      console.warn("No terms for step", currentStep);
    }
  };

  if (loading) {
    return <p>Loading lesson…</p>;
  }

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
          {/* This badge uses the dynamic difficulty */}
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
            className={`progress-step ${currentStep === 1 ? "active" : ""}`}
            onClick={() => setCurrentStep(1)}
          >
            1
          </button>
          <div className="progress-line" />
          <button
            className={`progress-step ${currentStep === 2 ? "active" : ""}`}
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
                state: { 
                  showButton:  true,
                  fromLecture: true,
                  lessonKey,      // pass through for LesoneContent
                  step: currentStep,
                  difficulty,   
                 },
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
