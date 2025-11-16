
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import arrow from "../../assets/arrow.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/Quiz.css";
import toast from "react-hot-toast";
import axios from "axios";
import LivesandDiamonds from "../../Components/LiveandDiamonds";
import ResultBanner from "./ResultBanner";
import LazyVideo from "./LazyVideo";

function Practice() {
  const navigate = useNavigate();
  const { lessonKey } = useParams();
  const location = useLocation();
  const currentStep = location.state?.currentStep || 1;

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
  const quizPart = currentStep;
  const totalQuestions = 5; // Practice mode: 5 questions

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const backendURL = "http://localhost:5000";

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const lessonNumberMapping = {
          termsone: 1,
          termstwo: 2,
          termsthree: 3,
          termsfour: 4,
          termsfive: 5,
          termssix: 6,
          termsseven: 7,
          termseight: 8,
          termsnine: 1,
          termsten: 2,
          termseleven: 3,
          termstwelve: 4,
        };
        const lessonNumber = lessonNumberMapping[lessonKey] || 1;
        const response = await axios.get(
          `${backendURL}/api/quizzes/stored`,
          { params: { level, lessonNumber, quizPart } }
        );
        const limited = Array.isArray(response.data)
          ? response.data.slice(0, totalQuestions)
          : [];
        setQuizQuestions(limited);
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setCorrectAnswers(0);
        setWrongAnswers(0);
        setShowResult(false);
        setIsCorrect(false);
        setQuizFinished(false);
      } catch (error) {
        toast.error("Failed to load practice questions. Please try again.");
      }
    };
    fetchQuizQuestions();
  }, [level, lessonKey, quizPart, backendURL]);

  useEffect(() => {
    if (!quizQuestions.length) return;
    const links = quizQuestions.flatMap(q =>
      q.choices.map(({ videoUrl }) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = videoUrl;
        document.head.appendChild(link);
        return link;
      })
    );
    return () => { links.forEach(link => document.head.removeChild(link)); };
  }, [quizQuestions]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleChoiceClick = (index) => {
    if (showResult) return;
    setSelectedAnswerIndex(index);
    const selectedChoice = currentQuestion.choices[index];
    setIsCorrect(selectedChoice.videoId === currentQuestion.correctAnswer);
  };

  const handleNext = async () => {
    if (selectedAnswerIndex === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }
    if (!showResult) {
      setShowResult(true);
      // Practice mode: no points awarded, no life deduction
      if (isCorrect) setCorrectAnswers(prev => prev + 1);
      else setWrongAnswers(prev => prev + 1);
      return;
    }

    if ((currentQuestionIndex + 1) >= totalQuestions) {
      setQuizFinished(true);
      toast.success("Practice completed!");
      navigate("/finish", {
        state: { correctAnswers, wrongAnswers, lessonKey, level, mode: "practice", currentStep },
      });
      return;
    }
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswerIndex(null);
    setShowResult(false);
  };

  const handleBack = () => {
    navigate(`/page/${lessonKey}`, {
      state: {
        lessonKey,
        difficulty: location.state?.difficulty,
        step: location.state?.step,
      },
    });
  };

  if (quizQuestions.length === 0 && !quizFinished) {
    return <div>Loading practice...</div>;
  }

  return (
    <div className="practice-mode">
      <div className="back fs-1 fw-bold d-flex" onClick={handleBack}>
        <img src={backkpoint} className="img-fluid p-1 mt-1" alt="Back" />
        <p>Back</p>
      </div>
      <div className="lives-quizz d-flex position-absolute gap-4">
        <LivesandDiamonds showDiamonds={false} showLives={false} />
      </div>
      {!quizFinished && (
        <div className="progress" role="progressbar" aria-valuenow={(currentQuestionIndex / totalQuestions) * 100} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}></div>
        </div>
      )}
      {quizFinished ? null : (
        <>
          <div className="quiz-container fw-bold d-flex">
            <p className="quiz-question">{currentQuestion.question}</p>
          </div>
          <div className="grid text-center fw-bold rounded-4 ">
            {currentQuestion.choices.map((option, index) => {
              const correctIndex = currentQuestion.choices.findIndex((c) => c.videoId === currentQuestion.correctAnswer);
              const isSelected = selectedAnswerIndex === index;
              let extraClass = "";
              if (isSelected) {
                extraClass = showResult ? (isCorrect ? " selected correct" : " selected wrong") : " selected";
              }
              if (showResult && !isCorrect && index === correctIndex) {
                extraClass = " correct";
              }
              return (
                <div
                  key={`${currentQuestion.question}-${index}`}
                  className={`choices d-flex justify-content-between align-items-center rounded-4 col-md-6 col-lg-11 m-5` + extraClass}
                  onClick={() => handleChoiceClick(index)}
                  style={{ pointerEvents: showResult ? "none" : "auto" }}
                >
                  <div className={`choice-${["A", "B", "C", "D"][index].toLowerCase()} rounded-4 m-4${isSelected ? " selected" : ""}`}>
                    <strong>{["A", "B", "C", "D"][index]}</strong>
                    <LazyVideo src={option.videoUrl} poster="path/to/placeholder.jpg" width={200} height={150} />
                  </div>
                </div>
              );
            })}
          </div>
          {showResult && (
            <ResultBanner isCorrect={isCorrect} checkIcon={check} wrongIcon={ekis} />
          )}
          <button type="button" className="continue d-flex rounded-4 p-3 pt-2 ms-auto" onClick={handleNext}>
            Next
            <img src={arrow} className="img-fluid d-flex ms-auto p-1 mt-1" alt="Next" />
          </button>
        </>
      )}
        {/* Responsive styles for smooth transition */}
     <style>{`
       
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
       .progress {
          margin-left: 14px !important;
          margin-top: 10vh !important;
          align-items: center !important;
          width: 92vw !important;
          height: 18px !important;
          border-radius: 50px !important;
        }

        .grid {
          height: 200vh !important;
          width: 100vw !important;
          border-radius: 0px !important;
          gap: 60px 78px !important;
          margin-top: 15px !important;
        }

        .choices {
          height: 22vh !important;
          width: 46vw !important;
          position: relative !important;
          top: 8vh !important;
          right: 33px !important;
          margin: 0 auto !important;
        }

        .choice-a, .choice-b, .choice-c, .choice-d {
          height: 5vh !important;
          width: 50vw !important;
          position: relative !important;
          bottom: 7vh !important;
          right: 0 !important;
          margin: 8px auto !important;
          border-radius: 12px !important;
        }
        
        .choice-a strong, .choice-b strong, .choice-c strong, .choice-d strong {
          margin-top: 2px !important;
          font-size: 1rem !important;
        }

        .choice-a video, .choice-b video, .choice-c video, .choice-d video {
          width: 41vw !important;
          height: auto !important;
          max-width: 300px !important;
          max-height: 45vh !important;
          object-fit: contain !important;
          display: block !important;
     
          border-radius: 12px !important;
          margin: 0 auto !important;
          position: absolute !important;
          top: 5vh !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 1 !important;
        }

        .continue {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          position: absolute !important;
          top: 91vh !important;
          left: 12px !important;
          height: 6vh !important;
          width: 92vw !important;
          font-size: 1.6rem !important;
          padding-top: 10px !important;
          border-radius: 12px !important;
        }

        .continue img {
          margin: 0px !important;
          margin-top: 10px !important;
          margin-left: 8px !important;
          width: 2.2rem !important;
          height: 2rem !important;
        }
        .continue p {
          margin-bottom: 0px !important;
          margin-top: 4px !important;
        }      
        .quiz-question {
          display: block !important;
          font-size: 1.3rem !important;
          position: fixed !important;
          left: 50% !important;
          top: 8rem !important;
          transform: translateX(-50%) !important;
          width: 92vw !important;
          text-align: center !important;
        }

         .back {
            display: flex !important;
            justify-content: center !important;
            position: fixed !important;
            left: 4rem !important;
            top: -0.5rem !important;
            font-size: 1.5rem !important;
          }
          .back img {
            width: 2rem !important;
            height: 1.5rem !important;
          }
      }
        .lives-quizz {
          display: flex !important;
          position: absolute !important;
          top:  0.5rem !important;
          left: 18rem !important; /* 14rem ≈ 224px — keeps it toward the right on small screens */
          transform: scale(1) !important;
        }
           /* Mobile sidenav - only show below 640px */
        @media (min-width: 425px) {
          .lives-quizz {
          display: flex !important;
          position: absolute !important;
          top:  0.5rem !important;
          left: 21rem !important; /* 14rem ≈ 224px — keeps it toward the right on small screens */
          transform: scale(1) !important;
        }
          .choice-a video, .choice-b video, .choice-c video, .choice-d video {
          width: 39vw !important;
          height: auto !important;
          max-width: 300px !important;
          max-height: 45vh !important;
          object-fit: contain !important;
          display: block !important;
          
          border-radius: 12px !important;
          margin: 0 auto !important;
          position: absolute !important;
          top: 5vh !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 1 !important;
        }
          .choices {
          height: 23vh !important;
          width: 44vw !important;
          position: relative !important;
          top: 4vh !important;
          right: 33px !important;
          margin: 0 auto !important;
        }
      }
        
         /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 768px) {
           .back {
            display: flex !important;
            justify-content: center !important;
            position: fixed !important;
            left: 2rem !important;
            top: 0rem !important;
            font-size: 1.5rem !important;
            }
           
          .lives-quizz {
          display: flex !important;
          position: absolute !important;
          top:  7rem !important;
          left: 40rem !important; /* 14rem ≈ 224px — keeps it toward the right on small screens */
          
         }
          .back img {
            width: 2rem !important;
            height: 1.5rem !important;
          }
          .grid {
            height: 60vh !important;
            width: 90vw !important;
            border-radius: 18px !important;
            gap: 56px 102px !important;
            margin-top: 15px !important;
          }

          .quiz-question {
            display: block !important;
            font-size: 1.7rem !important;
            position: fixed !important;
            left: 50% !important;
            top: 10rem !important;
            transform: translateX(-50%) !important;
            width: 80vw !important;
            text-align: center !important;
          }
          .choices {
            height: 20vh !important;
            width: 38vw !important;
            position: relative !important;
            top: 8vh !important;
            right: 38px !important;
            margin: 0 auto !important;
           }
          .choice-a, .choice-b, .choice-c, .choice-d {
            height: 7vh !important;
            width: 7vw !important;
            position: absolute !important;
            bottom: 6vh !important;
            left: 7px !important;
            margin: 0px auto !important;
            border-radius: 12px !important;
          }
          .choice-a strong, .choice-b strong, .choice-c strong, .choice-d strong {
            margin-top: 2px !important;
            font-size: 1.5rem !important;
          }
          .choice-a video, .choice-b video, .choice-c video, .choice-d video {
            width: 41vw !important;
            height: auto !important;
            max-width: 180px !important;
            max-height: 30vh !important;
            object-fit: contain !important;
            display: block !important;
        
            border-radius: 12px !important;
            margin: 0 auto !important;
            position: absolute !important;
            top: -2rem !important;
            
            left: 10.7rem !important;
            transform: translateX(-50%) !important;
            z-index: 1 !important;
          }
          
          .continue {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-size: 1.6rem !important;
            padding-top: 10px !important;
            margin-bottom: 45px !important;
          } 
          .continue img {
            margin: 0px !important;
            margin-top: 10px !important;
            margin-left: 8px !important;
            width: 2.5rem !important;
            height: 2.3rem !important;
          }
          .continue p {
            margin-bottom: 0px !important;
            margin-top: 4px !important;
          }      
        }

        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
           .back {
            display: flex !important;
            justify-content: center !important;
            position: fixed !important;
            left: 1.3rem !important;
            top: -0.5rem !important;
            font-size: 1.5rem !important;
            }
          .lives-quizz {
          display: flex !important;
          position: absolute !important;
          top:  7rem !important;
          left: 55rem !important; /* 14rem ≈ 224px — keeps it toward the right on small screens */
          
         }
          .back img {
            width: 2rem !important;
            height: 1.5rem !important;
          }
          .grid {
            height: 60vh !important;
            width: 90vw !important;
            border-radius: 18px !important;
            gap: 56px 102px !important;
            margin-top: 15px !important;
          }

          .quiz-question {
            display: block !important;
            font-size: 1.7rem !important;
            position: fixed !important;
            left: 50% !important;
            top: 11rem !important;
            transform: translateX(-50%) !important;
            width: 80vw !important;
            text-align: center !important;
          }
          .choices {
            height: 20vh !important;
            width: 34vw !important;
            position: relative !important;
            top: 8vh !important;
            right: 38px !important;
            margin: 0 auto !important;
           }
          .choice-a, .choice-b, .choice-c, .choice-d {
            height: 7vh !important;
            width: 5vw !important;
            position: absolute !important;
            bottom: 6vh !important;
            left: 22px !important;
            margin: 0px auto !important;
            border-radius: 12px !important;
          }
          .choice-a strong, .choice-b strong, .choice-c strong, .choice-d strong {
            margin-top: 2px !important;
            font-size: 1.5rem !important;
          }
          .choice-a video, .choice-b video, .choice-c video, .choice-d video {
            width: 41vw !important;
            height: auto !important;
            max-width: 198px !important;
            max-height: 35vh !important;
            object-fit: contain !important;
            display: block !important;
            border-radius: 12px !important;
            margin: 0 auto !important;
            position: absolute !important;
            top: -2.3rem !important;
            
            left: 13.2rem !important;
            transform: translateX(-50%) !important;
            z-index: 1 !important;
          }
          
          .continue {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-size: 1.6rem !important;
            padding-top: 10px !important;
            margin-bottom: 45px !important;
          } 
          .continue img {
            margin: 0px !important;
            margin-top: 10px !important;
            margin-left: 8px !important;
            width: 2.5rem !important;
            height: 2.3rem !important;
          }
          .continue p {
            margin-bottom: 0px !important;
            margin-top: 4px !important;
          }      
        }

            /* Desktop sidenav - show above 1024px */
        @media (min-width: 1440px) {
            .back {
            display: flex !important;
            justify-content: center !important;
            position: fixed !important;
            left: 1rem !important;
            top: -0.8rem !important;
            font-size: 2.3rem !important;
            }
          .lives-quizz {
          display: flex !important;
          position: absolute !important;
          top:  7rem !important;
          left: 78rem !important; /* 14rem ≈ 224px — keeps it toward the right on small screens */
          
         }
           .back img {
              width: 3rem !important;
              height: 2.5rem !important;
            } 
          .grid {
            height: 60vh !important;
            width: 90vw !important;
            border-radius: 18px !important;
            gap: 140px 132px !important;
            margin-top: 15px !important;
          }

          .quiz-question {
            display: block !important;
            font-size: 2.2rem !important;
            position: fixed !important;
            left: 50% !important;
            top: 11rem !important;
            transform: translateX(-50%) !important;
            width: 80vw !important;
            text-align: center !important;
          }
          .choices {
            height: 22vh !important;
            width: 33vw !important;
            position: relative !important;
            top: 8vh !important;
            right: 38px !important;
            margin: 0 auto !important;
           }
          .choice-a, .choice-b, .choice-c, .choice-d {
            height: 7vh !important;
            width: 5vw !important;
            position: absolute !important;
            bottom: 6vh !important;
            left: 22px !important;
            margin: 0px auto !important;
            border-radius: 12px !important;
          }
          .choice-a strong, .choice-b strong, .choice-c strong, .choice-d strong {
            margin-top: 2px !important;
            font-size: 2.3rem !important;
          }
          .choice-a video, .choice-b video, .choice-c video, .choice-d video {
            width: 48vw !important;
            height: auto !important;
            max-width: 300px !important;
            max-height: 35vh !important;
            object-fit: contain !important;
            display: block !important;
            border-radius: 12px !important;
            margin: 0 auto !important;
            position: absolute !important;
            top: -4.2rem !important;
     
            left: 16.2rem !important;
            transform: translateX(-50%) !important;
            z-index: 1 !important;
          }
          
          .continue {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-size: 1.6rem !important;
            padding-top: 10px !important;
            margin-bottom: 45px !important;
          } 
          .continue img {
            margin: 0px !important;
            margin-top: 10px !important;
            margin-left: 8px !important;
            width: 2.5rem !important;
            height: 2.3rem !important;
          }
          .continue p {
            margin-bottom: 0px !important;
            margin-top: 4px !important;
          }      
        }
      `}</style>
    </div>
  );
}

export default Practice;
