// src/Pages/Library/VideoLesson/LesoneContent.jsx
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

  const showButton  = location.state?.showButton  || false;
  const fromLecture = location.state?.fromLecture || false;
  const level       = lessonKey.startsWith("terms") ? "basic" : "intermediate";

  const [termsArray, setTermsArray] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // ─── only one declaration of step & hasUpdated ─────────────────
  const [step, setStep]             = useState(parseInt(termId, 10) > 15 ? 2 : 1);
  const [hasUpdated, setHasUpdated] = useState(false);

  // fetch videos once
  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then(res => res.json())
      .then(data => {
        setTermsArray(data.map(v => ({
          id: v._id,
          word: v.word,
          definition: v.description,
          video: v.videoUrl
        })));
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const firstPageTerms  = termsArray.slice(0, 15);
  const secondPageTerms = termsArray.slice(15, 30);
  const currentStepTerms = step === 1 ? firstPageTerms : secondPageTerms;
  const currentIndex     = currentStepTerms.findIndex(t => t.id === termId);

  // redirect if invalid index
  useEffect(() => {
    if (currentIndex === -1 && currentStepTerms.length) {
      const fallback = currentStepTerms[0].id;
      navigate(`/lesonecontent/${lessonKey}/${fallback}`, { state: { showButton, fromLecture } });
    }
  }, [currentIndex, currentStepTerms, lessonKey, navigate, showButton, fromLecture]);

  // auto-update progress at end of step
  useEffect(() => {
    if (!hasUpdated && currentIndex === currentStepTerms.length - 1) {
      updateProgress(level, lessonKey, step === 1 ? "step1Lecture" : "step2Lecture");
      setHasUpdated(true);
    }
  }, [hasUpdated, currentIndex, currentStepTerms, level, lessonKey, step, updateProgress]);

  // reset the “hasUpdated” when step changes
  useEffect(() => { setHasUpdated(false); }, [step]);

  // replay video on term change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  }, [termId]);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error loading content.</p>;
  if (currentIndex === -1) return <p>No term found.</p>;

  const currentTerm = currentStepTerms[currentIndex];
  const prevTerm    = currentStepTerms[currentIndex - 1] || currentStepTerms[0];
  const nextTerm    = currentStepTerms[currentIndex + 1] || currentStepTerms.slice(-1)[0];

  const handleNav = dir => {
    const target = dir === "prev" ? prevTerm : nextTerm;
    navigate(`/lesonecontent/${lessonKey}/${target.id}`, { state: { showButton, fromLecture } });
  };

  const handleBack = () => {
    const to = fromLecture ? `/lectureorquiz/${lessonKey}` : `/terms/${lessonKey}`;
    navigate(to, { state: { lessonKey } });
  };

  return (
    <>
      <div className="back-button">
        <button onClick={handleBack}><img src={Back} alt="Back" /></button>
      </div>

      <div className="container-lecture d-flex flex-column align-items-center justify-content-center">
        <div className="tryone-container">
          <video ref={videoRef} key={currentTerm.video} width="650" height="400" controls autoPlay loop>
            <source src={currentTerm.video} type="video/mp4" />
          </video>
        </div>
        <div className="text-container d-flex flex-column align-items-center justify-content-center gap-5 mt-4">
          <div className="letter-container">
            <button onClick={() => handleNav("prev")} disabled={currentIndex === 0}>
              <img src={leftArrow} alt="Prev" className="arrow" />
            </button>
            <div className="textOne"><p className="m-0">{currentTerm.word}</p></div>
            <button onClick={() => handleNav("next")} disabled={currentIndex === currentStepTerms.length - 1}>
              <img src={rightArrow} alt="Next" className="arrow" />
            </button>
          </div>
          <div className="textOne"><p>{currentTerm.definition}</p></div>
        </div>
        {showButton && currentIndex === currentStepTerms.length - 1 && (
          <div className="special-button-container"
               onClick={() => navigate(`/quiz/${lessonKey}`, { state: { currentStep: step } })}>
            <button className="special-button">
              {step === 1 ? "Go to Step 1 Quiz" : "Go to Step 2 Quiz"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LesoneContent;
