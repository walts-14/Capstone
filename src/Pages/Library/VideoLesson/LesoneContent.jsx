// src/Pages/Library/VideoLesson/LesoneContent.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Back from "../../../assets/BackButton.png";
import leftArrow from "../../../assets/leftArrow.png";
import rightArrow from "../../../assets/rightArrow.png";
import "../../../css/lesoneContent.css";
import { ProgressContext } from "../../../Pages/Dashboard/ProgressContext";
import TrimmedVideo from "./TrimmedVideo";
import Sidenav from "../../../Components/Sidenav";

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

const lessonNumberMapping = {
  termsone: 1,
  termstwo: 2,
  termsthree: 3,
  termsfour: 4,
  termsfive: 1,
  termssix: 2,
  termsseven: 3,
  termseight: 4,
  termsnine: 1,
  termsten: 2,
  termseleven: 3,
  termstwelve: 4,
};

const LesoneContent = () => {
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProgress } = useContext(ProgressContext);
  const videoRef = useRef(null);

  const showButton = location.state?.showButton || false;
  const fromLecture = location.state?.fromLecture || false;
  const lectureStep = location.state?.step;

  const level = levelMapping[lessonKey] || "basic";
  const lessonNumber = lessonNumberMapping[lessonKey] || 1;

  const [termsArray, setTermsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [isTermFlipped, setIsTermFlipped] = useState(false);
  const [isDefFlipped, setIsDefFlipped] = useState(false);

  // helper to match TermsCard coloring logic
  const getOverrideStyle = () => {
    // intermediate lessons
    if (
      ["termsfive", "termssix", "termsseven", "termseight"].includes(lessonKey)
    ) {
      return {
        backgroundColor: "var(--intermediate-yellow)",
        boxShadow: "0 5px 1px 8px var(--intermediate-shadow)",
      };
    }
    // advanced lessons
    if (
      ["termsnine", "termsten", "termseleven", "termstwelve"].includes(
        lessonKey
      )
    ) {
      return {
        backgroundColor: "var(--advance-red)",
        boxShadow: "0 5px 1px 8px var(--advance-shadow)",
      };
    }
    // default basic
    return {};
  };

  // 1. Fetch and sort
  useEffect(() => {
    const qs = new URLSearchParams({
      level,
      lessonNumber: lessonNumber.toString(),
    });
    setLoading(true);
    fetch(`http://localhost:5000/api/videos?${qs}`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => a.termNumber - b.termNumber);
        setTermsArray(
          data.map((v) => ({
            id: v._id,
            word: v.word,
            definition: v.description,
            video: v.videoUrl,
            termNumber: v.termNumber,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [lessonKey]);

  // 2. Partition
  const firstPageTerms = termsArray.slice(0, 15);
  const secondPageTerms = termsArray.slice(15, 30);

  // 3. Find index
  const idx1 = firstPageTerms.findIndex((t) => t.id === termId);
  const idx2 = secondPageTerms.findIndex((t) => t.id === termId);

  // 4. Determine step
  const step = fromLecture && lectureStep ? lectureStep : idx1 !== -1 ? 1 : 2;

  const currentPageTerms = step === 1 ? firstPageTerms : secondPageTerms;
  const currentIndex = step === 1 ? idx1 : idx2;

  // 5. Redirect invalid IDs
  useEffect(() => {
    if (currentIndex === -1 && currentPageTerms.length) {
      navigate(`/lesonecontent/${lessonKey}/${currentPageTerms[0].id}`, {
        state: { showButton, fromLecture, step },
      });
    }
  }, [currentIndex, currentPageTerms]);

  // 6. Progress
  // 6. Progress
  useEffect(() => {
    // Only auto-update here if we did NOT come from lecture.
    if (
      !fromLecture &&
      !hasUpdated &&
      currentIndex === currentPageTerms.length - 1
    ) {
      updateProgress(
        level,
        lessonKey,
        step === 1 ? "step1Lecture" : "step2Lecture"
      );
      setHasUpdated(true);
    }
  }, [hasUpdated, currentIndex, step]);

  useEffect(() => {
    setHasUpdated(false);
  }, [step]);

  // 7. Replay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  }, [termId]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error loading content.</p>;
  if (currentIndex === -1) return <p>No term found.</p>;

  // Utilities
  const currentTerm = currentPageTerms[currentIndex];
  const prevTerm = currentPageTerms[currentIndex - 1] || currentPageTerms[0];
  const nextTerm =
    currentPageTerms[currentIndex + 1] || currentPageTerms.slice(-1)[0];

  const navStyle = getOverrideStyle();

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentIndex > 0) {
      return navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, {
        state: { showButton, fromLecture, step },
      });
    }
    if (direction === "next") {
      if (fromLecture) {
        if (currentIndex === currentPageTerms.length - 1) {
          return navigate("/finishlecture", {
            state: { lessonKey, level, step },
          });
        }
        return navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
          state: { showButton, fromLecture, step },
        });
      }
      if (step === 1 && currentIndex === firstPageTerms.length - 1) {
        return navigate(
          `/lesonecontent/${lessonKey}/${secondPageTerms[0].id}`,
          { state: { showButton, fromLecture, step: 2 } }
        );
      }
      if (currentIndex < currentPageTerms.length - 1) {
        return navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
          state: { showButton, fromLecture, step },
        });
      }
      console.log("End of lesson reached.");
    }
  };

  // Split term
  let englishTerm = currentTerm.word;
  let filipinoTerm = "";
  const parenMatch = /^(.*?)\s*\((.*?)\)$/.exec(currentTerm.word);
  if (parenMatch) {
    englishTerm = parenMatch[1].trim();
    filipinoTerm = parenMatch[2].trim();
  } else if (currentTerm.word && currentTerm.word.includes(" - ")) {
    [englishTerm, filipinoTerm] = currentTerm.word.split(" - ");
    englishTerm = englishTerm.trim();
    filipinoTerm = filipinoTerm.trim();
  }

  // Split definition
  const rawDef = currentTerm.definition || "";
  let englishDef = rawDef;
  let filipinoDef = "";
  if (rawDef.includes("Filipino:") && rawDef.includes("English:")) {
    const engMatch = /English:\s*([^]*)Filipino:/.exec(rawDef);
    const filMatch = /Filipino:\s*([^]*)$/.exec(rawDef);
    englishDef = engMatch ? engMatch[1].trim() : "";
    filipinoDef = filMatch ? filMatch[1].trim() : "";
  } else if (rawDef.includes("Tagalog:")) {
    [englishDef, filipinoDef] = rawDef.split(/Tagalog:/);
    englishDef = englishDef.replace(/^English:/i, "").trim();
    filipinoDef = filipinoDef.trim();
  } else {
    englishDef = rawDef.trim();
    filipinoDef = "";
  }

  const handleBack = () => {
    if (location.state?.fromLecture) {
      navigate(`/page/${lessonKey}`, {
        state: {
          lessonKey,
          difficulty: location.state?.difficulty,
          step: location.state?.step,
        },
      });
    } else {
      navigate(`/terms/${lessonKey}`, { state: { lessonKey } });
    }
  };

  return (
    <>
      <Sidenav />
      <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
        <img src={Back} className="img-fluid p-1 mt-1" alt="Back" />
      </div>

      <div className="container-lecture d-flex flex-column align-items-center justify-content-center">
        <div className="tryone-container">
          <TrimmedVideo
            src={currentTerm.video}
            width={200}
            height={150}
            start={0.5} // cut off the first 1 second
            end={11} // when it reaches 8s, loop back to 1s
            playbackRate={1.3}
          />
        </div>

        <div className="text-container d-flex flex-column align-items-center justify-content-center gap-5">
          {/* Term Card: static for termsone, flip for others */}
          <div className="letter-container">
            <button onClick={() => handleNavigation("prev")}>
              <img src={leftArrow} alt="Left Arrow" className="arrow" />
            </button>
            {lessonKey === "termsone" ? (
              <div className="textOne" style={navStyle}>
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "-2rem",
                  }}
                >
                  {englishTerm}
                </p>
              </div>
            ) : (
              <div
                className={`textOne flip-card${
                  isTermFlipped ? " flipped" : ""
                }`}
                style={navStyle}
                onClick={() => setIsTermFlipped((prev) => !prev)}
                tabIndex={0}
                role="button"
                aria-pressed={isTermFlipped}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <p>{englishTerm}</p>
                  </div>
                  <div className="flip-card-back">
                    <p>{filipinoTerm ? filipinoTerm : "Filipino"}</p>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => handleNavigation("next")}>
              <img src={rightArrow} alt="Right Arrow" className="arrow" />
            </button>
          </div>
          {/* Definition Card: static for termsone, flip for others */}
          {lessonKey === "termsone" ? (
            <div className="textOne" style={navStyle}>
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "-2rem",
                }}
              >
                {englishDef}
              </p>
            </div>
          ) : (
            <div
              className={`textOne flip-card${isDefFlipped ? " flipped" : ""}`}
              style={navStyle}
              onClick={() => setIsDefFlipped((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-pressed={isDefFlipped}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <p className="m-0">{englishDef}</p>
                </div>
                <div className="flip-card-back">
                  <p className="m-0">
                    {filipinoDef
                      ? filipinoDef
                      : "Filipino definition not available."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LesoneContent;
