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
       if (currentIndex === -1 && currentStepTerms.length > 0) {
         const firstTermId = currentStepTerms[0].id;
         if (firstTermId) {
           navigate(`/lesonecontent/${lessonKey}/${firstTermId}`, {
             state: { showButton, fromLecture },
           });
         }
       }
     }, [step, currentIndex, currentStepTerms, lessonKey, navigate, showButton, fromLecture]);
   

    // auto-update progress at end of step
    // Only mark progress when user arrived via the lecture flow (fromLecture === true).
    useEffect(() => {
      if (fromLecture && !hasUpdated && currentIndex === currentStepTerms.length - 1) {
        updateProgress(level, lessonKey, step === 1 ? "step1Lecture" : "step2Lecture");
        setHasUpdated(true);
      }
    }, [fromLecture, hasUpdated, currentIndex, currentStepTerms, level, lessonKey, step, updateProgress]);

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

    return (
      <>
        <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
            <img src={Back} className="img-fluid p-1 mt-1" alt="Back" />
            
        </div>

        <div className="container-lecture d-flex flex-column align-items-center justify-content-center">
          <div className="tryone-container">
            <video ref={videoRef} key={currentTerm.video} width="650" height="400" controls autoPlay loop>
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

              {/* Remove the disabled attribute from the next button so it remains clickable even at the end */}
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