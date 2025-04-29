// src/Pages/Library/VideoLesson/LesoneContent.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Back from "../../../assets/BackButton.png";
import leftArrow from "../../../assets/leftArrow.png";
import rightArrow from "../../../assets/rightArrow.png";
import "../../../css/lesoneContent.css";
import { ProgressContext } from "../../../Pages/Dashboard/ProgressContext";

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

const LesoneContent = () => {
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProgress } = useContext(ProgressContext);
  const videoRef = useRef(null);

  const showButton  = location.state?.showButton  || false;
  const fromLecture = location.state?.fromLecture || false;

  // **READ THE STEP IF YOU CAME FROM LECTURE**
  const lectureStep = location.state?.step; // 1 or 2
  const level        = levelMapping[lessonKey]       || "basic";
  const lessonNumber = lessonNumberMapping[lessonKey] || 1;

  const [termsArray, setTermsArray] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [hasUpdated, setHasUpdated] = useState(false);

  // 1. Fetch only this lesson’s videos, sorted by termNumber
  useEffect(() => {
    const qs = new URLSearchParams({
      level,
      lessonNumber: lessonNumber.toString(),
    });
    setLoading(true);
    fetch(`http://localhost:5000/api/videos?${qs}`)
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => a.termNumber - b.termNumber);
        setTermsArray(
          data.map(v => ({
            id:         v._id,
            word:       v.word,
            definition: v.description,
            video:      v.videoUrl,
            termNumber: v.termNumber,
          }))
        );
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [lessonKey]);

  // 2. Split into two pages of 15 terms each
  const firstPageTerms  = termsArray.slice(0, 15);
  const secondPageTerms = termsArray.slice(15, 30);

  // 3. Find where our clicked term lives
  const idx1 = firstPageTerms.findIndex(t => t.id === termId);
  const idx2 = secondPageTerms.findIndex(t => t.id === termId);

  // 4. Compute step: use lectureStep if fromLecture, otherwise infer
  const step = fromLecture && lectureStep
    ? lectureStep
    : (idx1 !== -1 ? 1 : 2);

  const currentPageTerms = step === 1 ? firstPageTerms : secondPageTerms;
  const currentIndex     = step === 1 ? idx1 : idx2;

  // 5. Redirect on invalid termId
  useEffect(() => {
    if (currentIndex === -1 && currentPageTerms.length) {
      navigate(
        `/lesonecontent/${lessonKey}/${currentPageTerms[0].id}`,
        { state: { showButton, fromLecture, step } }
      );
    }
  }, [currentIndex, currentPageTerms]);

  // 6. Progress updates
  useEffect(() => {
    if (!hasUpdated && currentIndex === currentPageTerms.length - 1) {
      updateProgress(
        level,
        lessonKey,
        step === 1 ? "step1Lecture" : "step2Lecture"
      );
      setHasUpdated(true);
    }
  }, [hasUpdated, currentIndex, step]);

  useEffect(() => { setHasUpdated(false); }, [step]);

  // 7. Replay on term change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  }, [termId]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error loading content.</p>;
  if (currentIndex === -1) return <p>No term found.</p>;

  const currentTerm = currentPageTerms[currentIndex];
  const prevTerm    = currentPageTerms[currentIndex - 1] || currentPageTerms[0];
  const nextTerm    = currentPageTerms[currentIndex + 1] || currentPageTerms.slice(-1)[0];

  const handleNavigation = direction => {
    if (direction === "prev" && currentIndex > 0) {
      return navigate(
        `/lesonecontent/${lessonKey}/${prevTerm.id}`,
        { state: { showButton, fromLecture, step } }
      );
    }
    if (direction === "next") {
      // lecture flow?
      if (fromLecture) {
        if (currentIndex === currentPageTerms.length - 1) {
          return navigate("/finishlecture", { state: { lessonKey, level, step } });
        }
        return navigate(
          `/lesonecontent/${lessonKey}/${nextTerm.id}`,
          { state: { showButton, fromLecture, step } }
        );
      }
      // normal terms flow
      if (step === 1 && currentIndex === firstPageTerms.length - 1) {
        return navigate(
          `/lesonecontent/${lessonKey}/${secondPageTerms[0].id}`,
          { state: { showButton, fromLecture, step: 2 } }
        );
      }
      if (currentIndex < currentPageTerms.length - 1) {
        return navigate(
          `/lesonecontent/${lessonKey}/${nextTerm.id}`,
          { state: { showButton, fromLecture, step } }
        );
      }
      console.log("End of lesson reached.");
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

  return (
    <>
      <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
        <img src={Back} className="img-fluid p-1 mt-1" alt="Back" />
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
          </video>
        </div>

        <div className="text-container d-flex flex-column align-items-center justify-content-center gap-5 mt-4">
          <div className="letter-container">
            <button onClick={() => handleNavigation("prev")}>
              <img src={leftArrow} alt="Left Arrow" className="arrow" />
            </button>
            <div className="textOne">
              <p className="m-0">{currentTerm.word}</p>
            </div>
            <button onClick={() => handleNavigation("next")}>
              <img src={rightArrow} alt="Right Arrow" className="arrow" />
            </button>
          </div>
          <div className="textOne">
            <p>{currentTerm.definition}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LesoneContent;
