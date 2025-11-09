// // src/Pages/Library/LectureorQuiz.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import "../../css/LessonorQuiz.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Video from "../../assets/Video.png";
// import Ideas from "../../assets/Ideas.png";
// import backkpoint from "../../assets/backkpoint.png";
// import LivesandDiamonds from "../../Components/LiveandDiamonds";
// import IntroductionModal from "../../Components/IntroductionModal";
// const levelMapping = {
//   termsone: "basic",
//   termstwo: "basic",
//   termsthree: "basic",
//   termsfour: "basic",
//   termsfive: "intermediate",
//   termssix: "intermediate",
//   termsseven: "intermediate",
//   termseight: "intermediate",
//   termsnine: "advanced",
//   termsten: "advanced",
//   termseleven: "advanced",
//   termstwelve: "advanced",
// };

// const lessonNumberMapping = {
//   termsone: 1,
//   termstwo: 2,
//   termsthree: 3,
//   termsfour: 4,
//   termsfive: 1,
//   termssix: 2,
//   termsseven: 3,
//   termseight: 4,
//   termsnine: 1,
//   termsten: 2,
//   termseleven: 3,
//   termstwelve: 4,
// };

// function LectureorQuiz() {
//   const navigate = useNavigate();
//   const { termId: lessonKey } = useParams(); // your slug e.g. "termsfive"
//   const location = useLocation();

//   // DISPLAYED difficulty comes from the route state (set by the library page)
//   const difficulty = location.state?.difficulty?.toUpperCase() || "BASIC";

//   const difficultyColors = {
//     BASIC: "#3498db",
//     INTERMEDIATE: "#dcbc3d",
//     ADVANCED: "#cc6055",
//   };

//   // FETCHED level/lessonNumber still comes from your slug
//   const level = levelMapping[lessonKey] || "basic";
//   const lessonNumber = lessonNumberMapping[lessonKey] || 1;

//   const [lessonTerms, setLessonTerms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const qs = new URLSearchParams({ level, lessonNumber });
//     setLoading(true);
//     fetch(`http://localhost:5000/api/videos?${qs}`)
//       .then((res) => res.json())
//       .then((data) => {
//         data.sort((a, b) => a.termNumber - b.termNumber);
//         setLessonTerms(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching lesson terms", err);
//         setLoading(false);
//       });
//   }, [level, lessonNumber]);

//   // start on the step that was passed in (e.g. step=2), default to 1
//   const [currentStep, setCurrentStep] = useState(
//     () => Number(location.state?.step) || 1
//   );

//   const sliceStart = currentStep === 1 ? 0 : 15;
//   const filteredTerms = lessonTerms.slice(sliceStart, sliceStart + 15);

//   const handleLectureClick = () => {
//     if (filteredTerms.length > 0) {
//       navigate(`/lesonecontent/${lessonKey}/${filteredTerms[0]._id}`, {
//         state: {
//           showButton: true,
//           fromLecture: true,
//           lessonKey, // pass through for LesoneContent
//           step: currentStep,
//           difficulty, // also pass difficulty forward if needed
//         },
//       });
//     } else {
//       console.warn("No terms for step", currentStep);
//     }
//   };

//   if (loading) {
//     return <p>Loading lesson…</p>;
//   }

//   return (
//     <>
//       <div
//         className="back fs-1 fw-bold d-flex"
//         onClick={() => navigate("/dashboard")}
//       >
//         <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />

//         <p>Back</p>
//       </div>

//       <div className="container d-flex flex-column justify-content-center align-items-center">
//         <div className="status-bar">
//           {/* This badge uses the dynamic difficulty */}
//           <div>
//             <IntroductionModal />
//           </div>
//           <div
//             className="difficulty text-center"
//             style={{ backgroundColor: difficultyColors[difficulty] }}
//           >
//             {difficulty}
//           </div>

//           <LivesandDiamonds />
//         </div>

//         <div className={`progress-bar-container step-${currentStep}`}>
//           <button
//             className={`progress-step ${currentStep === 1 ? "active" : ""}`}
//             onClick={() => setCurrentStep(1)}
//           >
//             1
//           </button>
//           <div className="progress-line" />
//           <button
//             className={`progress-step ${currentStep === 2 ? "active" : ""}`}
//             onClick={() => setCurrentStep(2)}
//           >
//             2
//           </button>
//         </div>

//         <div className="lecture-quiz-container">
//           <div
//             className="lecture-outer justify-content-center rounded-5"
//             onClick={handleLectureClick}
//           >
//             <p className="fs-md-5">Lecture</p>
//             <div className="lecture-inner justify-content-center align-items-center">
//               <img src={Video} className="img-fluid" alt="Lecture Video" />
//             </div>
//           </div>

//           <div
//             className="quiz-outer justify-content-center rounded-5"
//             onClick={() =>
//               navigate(`/quiz/${lessonKey}`, {
//                 state: {
//                   showButton: true,
//                   fromLecture: true,
//                   lessonKey, // pass through for LesoneContent
//                   currentStep: currentStep,
//                   difficulty,
//                 },
//               })
//             }
//           >
//             <p>Quiz</p>
//             <div className="quiz-inner justify-content-center">
//               <img src={Ideas} className="img-fluid" alt="Quiz Icon" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default LectureorQuiz;
// src/Pages/Library/LectureorQuiz.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../css/LessonorQuiz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../../assets/Video.png";
import Ideas from "../../assets/Ideas.png";
import backkpoint from "../../assets/backkpoint.png";
import practice from "../../assets/practice.png";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import IntroductionModal from "../../Components/IntroductionModal";
import { useContext } from "react";
import { ProgressContext } from "./ProgressContext.jsx";

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

function LectureorQuiz() {
  const navigate = useNavigate();
  const { termId: lessonKey } = useParams(); // your slug e.g. "termsfive"
  const location = useLocation();

  // DISPLAYED difficulty comes from the route state (set by the library page)
  const difficulty = location.state?.difficulty?.toUpperCase() || "BASIC";

  const difficultyColors = {
    BASIC: "#3498db",
    INTERMEDIATE: "#dcbc3d",
    ADVANCED: "#C0392B",
  };

  // stroke colors to match Dashboard outline style
  const strokeColors = {
    BASIC: "#A6DCFF",
    INTERMEDIATE: "#FFFEA6",
    ADVANCED: "#FF7D6F",
  };

  // FETCHED level/lessonNumber still comes from your slug
  const level = levelMapping[lessonKey] || "basic";
  const lessonNumber = lessonNumberMapping[lessonKey] || 1;

  const [lessonTerms, setLessonTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = new URLSearchParams({ level, lessonNumber });
    setLoading(true);
    fetch(`http://localhost:5000/api/videos?${qs}`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => a.termNumber - b.termNumber);
        setLessonTerms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lesson terms", err);
        setLoading(false);
      });
  }, [level, lessonNumber]);

  // start on the step that was passed in (e.g. step=2), default to 1
  const [currentStep, setCurrentStep] = useState(
    () => Number(location.state?.step) || 1
  );

  const sliceStart = currentStep === 1 ? 0 : 15;
  const filteredTerms = lessonTerms.slice(sliceStart, sliceStart + 15);

  const handleLectureClick = () => {
    if (filteredTerms.length > 0) {
      navigate(`/lesonecontent/${lessonKey}/${filteredTerms[0]._id}`, {
        state: {
          showButton: true,
          fromLecture: true,
          lessonKey, // pass through for LesoneContent
          step: currentStep,
          difficulty, // also pass difficulty forward if needed
        },
      });
    } else {
      console.warn("No terms for step", currentStep);
    }
  };

  if (loading) {
    return <p>Loading lesson…</p>;
  }

  // get the four-part progress flags for this lesson:
  const { progressData } = useContext(ProgressContext);
  const lessonProgress = progressData[level]?.[lessonKey] || {
    step1Lecture: false,
    step1Quiz: false,
    step2Lecture: false,
    step2Quiz: false,
  };

  // which parts are currently unlocked?
  const canLecture =
    currentStep === 1
      ? // Lecture Part 1 is always available
        true
      : // Lecture Part 2 only after you pass Quiz Part 1
        lessonProgress.step1Quiz;

  const canQuiz =
    currentStep === 1
      ? // Quiz Part 1 only after you finish Lecture Part 1
        lessonProgress.step1Lecture
      : // Quiz Part 2 only after you finish Lecture Part 2
        lessonProgress.step2Lecture;

  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/dashboard")}
      >
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />

        <p>Back</p>
      </div>
      <div className="MobileIntroduction">
        <IntroductionModal />
      </div>
      <div className="container d-flex flex-column justify-content-center align-items-center mb-25">
        <div className="status-bar">
          {/* This badge uses the dynamic difficulty */}
          <div className="Introduction">
            <IntroductionModal />
          </div>
          <div
            className="Difficulty text-center px-5 py-2 rounded-2xl font-bold text-white text-[2.5rem] difficulty-button"
            style={{
              backgroundColor: difficultyColors[difficulty],
              boxShadow: `0 0 0 5px ${strokeColors[difficulty] || "#A6DCFF"}`,
            }}
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
            className={`lecture-outer justify-content-center rounded-5${
              !canLecture ? " disabled" : ""
            }`}
            onClick={() => {
              if (!canLecture) return;
              handleLectureClick();
            }}
          >
            <p className="fs-md-5">Lecture</p>
            <div className="lecture-inner justify-content-center align-items-center">
              <img src={Video} className="img-fluid" alt="Lecture Video" />
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div
              className={`quiz-outer justify-content-center rounded-5${
                !canQuiz ? " disabled" : ""
              }`}
              onClick={() => {
                if (!canQuiz) return;
                navigate(`/quiz/${lessonKey}`, {
                  state: {
                    showButton: true,
                    fromLecture: true,
                    lessonKey,
                    currentStep,
                    difficulty,
                  },
                });
              }}
            >
              <p>Quiz</p>
              <div className="quiz-inner justify-content-center">
                <img src={Ideas} className="img-fluid" alt="Quiz Icon" />
              </div>
            </div>

            <div
              className={`practice-outer justify-content-center rounded-5${
                !canQuiz ? " disabled" : ""
              }`}
              onClick={() => {
                if (!canQuiz) return;
                navigate(`/practice/${lessonKey}`, {
                  state: {
                    showButton: true,
                    fromLecture: true,
                    lessonKey,
                    currentStep,
                    difficulty,
                  },
                });
              }}
            >
              <p>Practice</p>
              <div className="practice-inner justify-content-center">
                <img src={practice} className="img-fluid" alt="Practice Icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles for smooth transition */}
      <style>{`
           /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 1023px) {
          .MobileIntroduction {
              display: none !important;
            } 
          .Introduction {
              display: flex !important;
            }
         
        }

           /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
           .MobileIntroduction {
              display: none !important;
            } 
          .Introduction {
              display: flex !important;
            }
       
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
           .back {
            display: flex !important;
            justify-content: center !important;
            position: fixed !important;
            left: 1rem !important;
            font-size: 3rem !important;
          }
          .back img {
            margin-top: 0.8rem !important;  
            width: 3rem !important;
            height: 2.5rem !important;
          }
          .Difficulty {
            display: flex !important;
            height: 75px;
            font-size: 2.6rem;
            padding-inline: 20px !important;
          }
          .status-bar {
            display: flex !important;
            gap: 3rem !important;
            position: absolute !important;
            top: 12rem !important;
          }
          .MobileIntroduction {
            display: flex !important;
            position: absolute !important;
            top: 2.8rem !important;
            left: 36rem !important;
          }
          .Introduction {
            display: none !important;
          }

          .lecture-quiz-container {
            display: flex !important;
            flex-direction: row !important;
            font-size: 2rem !important;
          }
          .lecture-quiz-container p{
            font-size: 3rem !important;
          } 
          
          .lecture-outer {
            width: 17rem !important;
            height: 32.5rem !important;
          }
            
          .lecture-inner {
            height: 27rem !important;
          }
         
          .quiz-outer, .practice-outer {
            width: 17rem !important;
            height: 15rem !important;
            padding: 0px !important;
        
         }
          .quiz-inner img {
            height:  60% !important;
          }
          .quiz-inner, .practice-inner {
            width: 16.4rem !important;
            height: 25vh !important;
            margin-top: 2.8rem !important;
         }
         


        
     

     

      `}</style>
    </>
  );
}

export default LectureorQuiz;
