import React, { useEffect, useRef, useState, useContext } from "react";
import Back from "../../../assets/BackButton.png";
import leftArrow from "../../../assets/leftArrow.png";
import rightArrow from "../../../assets/rightArrow.png";
import "../../../css/lesoneContent.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LessonTerms from "../Terms/LessonTerms";
import { ProgressContext } from "../../Dashboard/ProgressContext";
import backkpoint from "../../../assets/backkpoint.png";

const LesoneContent = () => {
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProgress } = useContext(ProgressContext);
  const videoRef = useRef(null);
  const showButton = location.state?.showButton || false;
  const fromLecture = location.state?.fromLecture || false;

  const termsArray = LessonTerms[lessonKey] || [];
  console.log("LessonTerms for lessonKey:", lessonKey, termsArray);

  const levelMapping = {
    termsone: "basic",
    termstwo: "basic",
    termsthree: "basic",
    termsfour: "basic",
    termsfive: "intermediate",
    termssix: "intermediate",
    termsseven: "intermediate",
    termseight: "intermediate",
    termsnine: "advanced",
    termsten: "advanced",
    termseleven: "advanced",
    termstwelve: "advanced",
  };

  const level = levelMapping[lessonKey] || "basic";

  // Determine step based on termId (if id > 15 then step 2)
  const [step, setStep] = useState(parseInt(termId, 10) > 15 ? 2 : 1);
  const [hasUpdated, setHasUpdated] = useState(false);

  const firstPageTerms = termsArray.slice(0, 15);
  const secondPageTerms = termsArray.slice(15, 30);
  const currentStepTerms = step === 1 ? firstPageTerms : secondPageTerms;

  const currentIndex = currentStepTerms.findIndex(
    (term) => term.id === parseInt(termId, 10)
  );

  useEffect(() => {
    if (currentIndex === -1 && currentStepTerms.length > 0) {
      const firstTermId = currentStepTerms[0].id;
      if (firstTermId) {
        navigate(`/lesonecontent/${lessonKey}/${firstTermId}`, {
          state: { showButton, fromLecture },
        });
      }
    }
  }, [
    step,
    currentIndex,
    currentStepTerms,
    lessonKey,
    navigate,
    showButton,
    fromLecture,
  ]);

  useEffect(() => {
    if (
      !hasUpdated &&
      currentIndex === currentStepTerms.length - 1 &&
      currentStepTerms.length > 0
    ) {
      if (step === 1) {
        updateProgress(level, lessonKey, "step1Lecture");
        console.log(
          `Automatically updated progress for ${lessonKey} step1Lecture`
        );
      } else if (step === 2) {
        updateProgress(level, lessonKey, "step2Lecture");
        console.log(
          `Automatically updated progress for ${lessonKey} step2Lecture`
        );
      }
      setHasUpdated(true);
    }
  }, [
    hasUpdated,
    currentIndex,
    currentStepTerms,
    step,
    updateProgress,
    lessonKey,
    level,
  ]);

  useEffect(() => {
    setHasUpdated(false);
  }, [step]);

  if (currentIndex === -1) return <p>Loading...</p>;

  const { terms, definition, video } = currentStepTerms[currentIndex];
  const prevTerm = currentStepTerms[currentIndex - 1] || currentStepTerms[0];
  const nextTerm =
    currentIndex < currentStepTerms.length - 1
      ? currentStepTerms[currentIndex + 1]
      : null;

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentIndex > 0) {
      // Navigate to the previous term
      navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, {
        state: { showButton, fromLecture },
      });
    }
    if (direction === "next") {
      // If coming from lecture or page, use finish component at the end of current step
      if (location.state?.fromLecture) {
        if (currentIndex === currentStepTerms.length - 1) {
          navigate("/finishlecture", {
            state: {
              lessonKey,
              level,
              step,
              // additional state if needed
            },
          });
        } else {
          navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
            state: { showButton, fromLecture },
          });
        }
      } else {
        // User came from the terms page
        if (step === 1) {
          // In step 1 (first 15 terms)
          if (currentIndex === currentStepTerms.length - 1) {
            // At end of step 1, update step to 2 and navigate to first term of step 2
            setStep(2);
            const firstTermIdStep2 = secondPageTerms[0].id; // secondPageTerms contains terms 16-30
            navigate(`/lesonecontent/${lessonKey}/${firstTermIdStep2}`, {
              state: { showButton, fromLecture },
            });
          } else {
            // Continue in step 1 normally
            navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
              state: { showButton, fromLecture },
            });
          }
        } else if (step === 2) {
          // In step 2 (terms 16-30)
          if (currentIndex === currentStepTerms.length - 1) {
            // At the very end of step 2: do nothing or show a message
            console.log("End of lesson reached.");
          } else {
            // Normal navigation in step 2
            navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
              state: { showButton, fromLecture },
            });
          }
        }
      }
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
      videoRef.current
        .play()
        .catch((error) => console.error("Video play error:", error));
    }
  }, [termId, videoRef]);

  return (
    <>
      <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />
        <p>Back</p>
      </div>

      <div className="container-lecture d-flex flex-column align-items-center justify-content-center">
        <div className="tryone-container">
          <video
            ref={videoRef}
            key={video}
            width="650"
            height="400"
            muted
            autoPlay
            loop
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>

        <div className="text-container d-flex flex-column align-items-center justify-content-center gap-5">
          <div className="letter-container">
            <button onClick={() => handleNavigation("prev")}>
              <img src={leftArrow} alt="Left Arrow" className="arrow" />
            </button>

            <div className="textOne align-center text-center">
              <p>{terms}</p>
            </div>

            {/* Remove the disabled attribute from the next button so it remains clickable even at the end */}
            <button onClick={() => handleNavigation("next")}>
              <img src={rightArrow} alt="Right Arrow" className="arrow" />
            </button>
          </div>

          <div className="textOne">
            <p>{definition}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LesoneContent;
