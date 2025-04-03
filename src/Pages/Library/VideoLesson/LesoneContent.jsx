import React, { useEffect, useRef, useState, useContext } from "react";
import Back from '../../../assets/BackButton.png';
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LessonTerms from "../Terms/LessonTerms";
import { ProgressContext } from "../../../Pages/Dashboard/ProgressContext";

const LesoneContent = () => {
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();
  const { updateProgress } = useContext(ProgressContext);

  const showButton = location.state?.showButton || false;
  const fromLecture = location.state?.fromLecture || false;
  
  const termsArray = LessonTerms[lessonKey] || [];
  
  // Determine level based on lessonKey (e.g., "termsone" are basic)
  const level = lessonKey.startsWith("terms") ? "basic" : "intermediate";

  // Track current step: step 1 if termId <= 15, else step 2.
  const [step, setStep] = useState(parseInt(termId, 10) > 15 ? 2 : 1);
  // NEW: local flag to prevent repeated update calls
  const [hasUpdated, setHasUpdated] = useState(false);

  // Define term ranges for each step
  const firstPageTerms = termsArray.slice(0, 15);  // Terms 1-15
  const secondPageTerms = termsArray.slice(15, 30); // Terms 16-30

  const currentStepTerms = step === 1 ? firstPageTerms : secondPageTerms;
  const currentIndex = currentStepTerms.findIndex(term => term.id === parseInt(termId, 10));

  useEffect(() => {
    if (currentIndex === -1 && currentStepTerms.length > 0) {
      const firstTermId = currentStepTerms[0].id;
      if (firstTermId) {
        navigate(`/lesonecontent/${lessonKey}/${firstTermId}`, { state: { showButton, fromLecture } });
      }
    }
  }, [step, currentIndex, currentStepTerms, lessonKey, navigate, showButton, fromLecture]);

  // NEW: Automatically update progress once per step when the last term is reached
  useEffect(() => {
    if (!hasUpdated && currentIndex === currentStepTerms.length - 1 && currentStepTerms.length > 0) {
      if (step === 1) {
        updateProgress(level, lessonKey, "step1Lecture");
        console.log(`Automatically updated progress for ${lessonKey} step1Lecture`);
      } else if (step === 2) {
        updateProgress(level, lessonKey, "step2Lecture");
        console.log(`Automatically updated progress for ${lessonKey} step2Lecture`);
      }
      setHasUpdated(true); // Prevent further updates in the same step
    }
  }, [hasUpdated, currentIndex, currentStepTerms, step, updateProgress, lessonKey, level]);

  // Reset hasUpdated when step changes
  useEffect(() => {
    setHasUpdated(false);
  }, [step]);

  if (currentIndex === -1) return <p>Loading...</p>;

  const { terms, definition, video } = currentStepTerms[currentIndex];

  const prevTerm = currentStepTerms[currentIndex - 1] || currentStepTerms[0];
  const nextTerm = currentStepTerms[currentIndex + 1] || currentStepTerms[currentStepTerms.length - 1];

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentIndex > 0) {
      navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, { state: { showButton, fromLecture } });
    }
    if (direction === "next" && currentIndex < currentStepTerms.length - 1) {
      navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, { state: { showButton, fromLecture } });
    }
  };

  const handleBack = () => {
    if (location.state?.fromLecture) {
      navigate(`/lectureorquiz/${lessonKey}`, { state: { lessonKey } });
      navigate(`/page/${lessonKey}`, { state: { lessonKey } });
    } else {
      navigate(`/terms/${lessonKey}`, { state: { lessonKey } });
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => console.error("Video play error:", error));
    }
  }, [termId, videoRef]);

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
