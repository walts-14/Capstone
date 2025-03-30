import React, { useEffect, useRef, useState } from "react";
import Back from '../../../assets/BackButton.png';
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LessonTerms from "../Terms/LessonTerms";

const LesoneContent = () => {
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();
  
  const showButton = location.state?.showButton || false;
  const fromLecture = location.state?.fromLecture || false;
  
  const termsArray = LessonTerms[lessonKey] || [];
  
  // Track current step
  const [step, setStep] = useState(parseInt(termId, 10) > 15 ? 2 : 1);

  // Define term ranges for each step
  const firstPageTerms = termsArray.slice(0, 15);  // Terms 1-15
  const secondPageTerms = termsArray.slice(15, 30); // Terms 16-30

  const currentStepTerms = step === 1 ? firstPageTerms : secondPageTerms;
  const currentIndex = currentStepTerms.findIndex(term => term.id === parseInt(termId, 10));

  // If term not found in the current step, reset to the first term of that step
  useEffect(() => {
    if (currentIndex === -1) {
      const firstTermId = currentStepTerms.length > 0 ? currentStepTerms[0].id : null;
      if (firstTermId) {
        navigate(`/lesonecontent/${lessonKey}/${firstTermId}`, { state: { showButton, fromLecture } });
      }
    }
  }, [step]);

  if (currentIndex === -1) return <p>Loading...</p>;

  const { terms, definition, video } = currentStepTerms[currentIndex];

  // Get previous and next terms within the step
  const prevTerm = currentStepTerms[currentIndex - 1] || currentStepTerms[0];
  const nextTerm = currentStepTerms[currentIndex + 1] || currentStepTerms[currentStepTerms.length - 1];

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentIndex > 0) {
      navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, {
        state: { showButton, fromLecture }
      });
    }
    if (direction === "next" && currentIndex < currentStepTerms.length - 1) {
      navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
        state: { showButton, fromLecture }
      });
    }
  };

   // Dynamic Back Button: If fromLecture is true, navigate back to LectureorQuiz; else, to term list.
  const handleBack = () => {
    if (location.state?.fromLecture) {
      navigate(`/lectureorquiz/${lessonKey}`, { state: { lessonKey } });
      navigate(`/page/${lessonKey}`, { state: { lessonKey } });
    } else {
      navigate(`/terms/${lessonKey}`, { state: { lessonKey } });
    }
  }

  return (
    <>
      <div className="tryone-container">
        <video ref={videoRef} key={video} width="650" height="400" controls autoPlay loop>
          <source src={video} type="video/mp4" />
        </video>
      </div>

      <div className="back-button">
        <button onClick={handleBack}>
          <img src={Back} alt="Back" />
        </button>
      </div>

    

      <div className="text-container">
        <div className="letter-container">
          <button onClick={() => handleNavigation("prev")} disabled={currentIndex === 0}>
            <img src={leftArrow} alt="Left Arrow" className="arrow" />
          </button>

          <div className="textOne">
            <p className="m-0">{terms}</p>
          </div>

          <button onClick={() => handleNavigation("next")} disabled={currentIndex === currentStepTerms.length - 1}>
            <img src={rightArrow} alt="Right Arrow" className="arrow" />
          </button>
        </div>

        <div className="textOne">
          <p>{definition}</p>
        </div>
      </div>

      {showButton && currentIndex === currentStepTerms.length - 1 && (
        <div
          className="special-button-container"
          onClick={() => navigate(`/quiz/${lessonKey}`, { state: { currentStep: step } })}
        >
          <button className="special-button">
            {step === 1 ? "Go to Step 1 Quiz" : "Go to Step 2 Quiz"}
          </button>
        </div>
      )}

    </>
  );
};

export default LesoneContent;
