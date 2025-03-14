import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";
// Import your lesson terms data as a fallback if needed
import LessonTermsData from "../Library/Terms/LessonTerms";

function LectureorQuiz({ LessonTerms: propLessonTerms }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // Retrieve the route parameter; note that our route is defined as /lectureorquiz/:termId,
  // but we treat that as our lesson key if no state is provided.
  const routeTermId = params.termId; 
  // Retrieve values from location.state (if present)
  const { lessonKey: stateLessonKey, termId: stateTermId } = location.state || {};

  // Determine final values:
  // Use stateLessonKey if provided; otherwise, use routeTermId as the lesson key.
  const lessonKey = stateLessonKey || routeTermId;
  // The numeric term id, if provided in state, otherwise undefined.
  const numericTermId = stateTermId; 

  // Use the LessonTerms prop if provided; otherwise, load from imported data using lessonKey.
  const LessonTerms = propLessonTerms || (lessonKey ? LessonTermsData[lessonKey] || [] : []);

  console.log("Route params:", params);
  console.log("Location state:", location.state);
  console.log("Resolved lessonKey:", lessonKey);
  console.log("Resolved numericTermId:", numericTermId);
  console.log("Received LessonTerms in LectureorQuiz:", LessonTerms);

  // When clicking the Lecture button, navigate to LesoneContent using the lesson key and the first term's id.
  const handleClick = () => {
    if (lessonKey && LessonTerms.length > 0) {
      navigate(`/lesonecontent/${lessonKey}/${LessonTerms[0].id}`, {
        state: { showButton: true, fromLecture: true, lessonKey, termId: LessonTerms[0].id }
      });
    } else {
      console.log("No valid lesson data found!");
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
          className="img-fluid w-50 h-50 p-1 mt-2"
          alt="Back"
        />
        <p>Back</p>
      </div>

      <div className="lecture-quiz-container d-flex justify-content-center fw-bold col-md-6">
        <div
          className="lecture-outer justify-content-center rounded-5"
          onClick={handleClick}
        >
          <p>Lecture</p>
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
