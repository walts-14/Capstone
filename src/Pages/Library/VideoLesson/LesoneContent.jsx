import React, { useEffect, useRef, useState, useContext } from "react";
import Back from "../../../assets/BackButton.png";
import leftArrow from "../../../assets/leftArrow.png";
import rightArrow from "../../../assets/rightArrow.png";
import "../../../css/lesoneContent.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ProgressContext } from "../../../Pages/Dashboard/ProgressContext";

const LesoneContent = () => {
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProgress } = useContext(ProgressContext);
  const videoRef = useRef(null);

  const showButton = location.state?.showButton || false;
  const fromLecture = location.state?.fromLecture || false;

  const [termsArray, setTermsArray] = useState([]);
  const [step, setStep] = useState(null);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const level = lessonKey.startsWith("terms") ? "basic" : "intermediate";

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((video) => ({
          id: video._id,
          word: video.word,
          definition: video.description || "Definition not provided",
          video: video.videoUrl,
        }));
        setTermsArray(transformed);
        setLoading(false);

        const index = transformed.findIndex((term) => term.id === termId);
        setStep(index < 15 ? 1 : 2);
      })
      .catch((err) => {
        console.error("Video fetch error:", err);
        setError(err);
        setLoading(false);
      });
  }, [termId]);

  const currentIndex = termsArray.findIndex((term) => term.id === termId);
  const firstPageTerms = termsArray.slice(0, 15);
  const secondPageTerms = termsArray.slice(15, 30);
  const currentStepTerms = step === 1 ? firstPageTerms : secondPageTerms;

  useEffect(() => {
    if (currentIndex === -1 && termsArray.length > 0) {
      const targetIndex = step === 2 ? 15 : 0;
      const firstTermId = termsArray[targetIndex]?.id;
      if (firstTermId) {
        navigate(`/lesonecontent/${lessonKey}/${firstTermId}`, {
          state: { showButton, fromLecture },
        });
      }
    }
  }, [currentIndex, step, termsArray, lessonKey, navigate, showButton, fromLecture]);

  useEffect(() => {
    if (
      !hasUpdated &&
      currentIndex !== -1 &&
      currentIndex === (step === 1 ? 14 : 29)
    ) {
      updateProgress(level, lessonKey, step === 1 ? "step1Lecture" : "step2Lecture");
      setHasUpdated(true);
    }
  }, [hasUpdated, currentIndex, step, updateProgress, level, lessonKey]);

  useEffect(() => {
    setHasUpdated(false);
  }, [step]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => console.error("Video play error:", err));
    }
  }, [termId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading content: {error.message}</p>;
  if (currentIndex === -1) return <p>No term found.</p>;

  const currentTerm = termsArray[currentIndex];
  const prevTerm = termsArray[currentIndex - 1] || termsArray[0];
  const nextTerm = termsArray[currentIndex + 1] || termsArray[termsArray.length - 1];

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentIndex > 0) {
      navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, {
        state: { showButton, fromLecture },
      });
    }
    if (direction === "next" && currentIndex < termsArray.length - 1) {
      navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
        state: { showButton, fromLecture },
      });
    }
  };

  const handleBack = () => {
    if (fromLecture) {
      navigate(`/lectureorquiz/${lessonKey}`, { state: { lessonKey } });
    } else {
      navigate(`/terms/${lessonKey}`, { state: { lessonKey } });
    }
  };

  return (
    <div>
      <div className="back-button">
        <button onClick={handleBack}>
          <img src={Back} alt="Back" />
        </button>
      </div>

      <div className="container-lecture d-flex flex-column align-items-center justify-content-center">
        <div className="tryone-container">
          <video
            ref={videoRef}
            key={currentTerm.video}
            width="650"
            height="400"
            controls
            autoPlay
            loop
          >
            <source src={currentTerm.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="text-container d-flex flex-column align-items-center justify-content-center gap-5 mt-4">
          <div className="letter-container">
            <button onClick={() => handleNavigation("prev")} disabled={currentIndex === 0}>
              <img src={leftArrow} alt="Left Arrow" className="arrow" />
            </button>

            <div className="textOne">
              <p className="m-0">{currentTerm.word}</p>
            </div>

            <button
              onClick={() => handleNavigation("next")}
              disabled={currentIndex === termsArray.length - 1}
            >
              <img src={rightArrow} alt="Right Arrow" className="arrow" />
            </button>
          </div>

          <div className="textOne">
            <p>{currentTerm.definition}</p>
          </div>
        </div>

        {showButton && currentIndex === termsArray.length - 1 && (
          <div
            className="special-button-container"
            onClick={() =>
              navigate(`/quiz/${lessonKey}`, { state: { currentStep: step } })
            }
          >
            <button className="special-button">
              {step === 1 ? "Go to Step 1 Quiz" : "Go to Step 2 Quiz"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LesoneContent;
