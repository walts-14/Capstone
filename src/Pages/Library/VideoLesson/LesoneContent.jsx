import React, { useEffect, useRef } from "react";
import Back from '../../../assets/BackButton.png';
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LessonTerms from "../Terms/LessonTerms";

const LesoneContent = () => {
  // Expect two URL parameters: lessonKey (e.g., "termsthree") and termId (numeric as string)
  const { lessonKey, termId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const location = useLocation();

  // Retrieve passed state
  const showButton = location.state?.showButton || false;
  const fromLecture = location.state?.fromLecture || false;

  console.log("fromLecture:", fromLecture); // Add this line to debug

  // Get the correct array based on the lessonKey (e.g., LessonTerms["termsthree"])
  const termsArray = LessonTerms[lessonKey] || [];
  console.log("LessonTerms for lessonKey:", lessonKey, termsArray);

  // Find the current term using the numerical termId
  const currentTerm = termsArray.find(term => term.id === parseInt(termId, 10));
  if (!currentTerm) {
    return <p>Term not found</p>;
  }

  const { terms, definition, video } = currentTerm;
  const currentIndex = termsArray.findIndex(term => term.id === parseInt(termId, 10));
  const prevTerm = termsArray[(currentIndex - 1 + termsArray.length) % termsArray.length];
  const nextTerm = termsArray[(currentIndex + 1) % termsArray.length];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => console.error("Video play error:", error));
    }
  }, [termId]);

  const isLastTerm = currentIndex === termsArray.length - 1;

  // Dynamic Back Button: If fromLecture is true, navigate back to LectureorQuiz; else, to term list.
  const handleBack = () => {
    if (location.state?.fromLecture) {
      navigate(`/page/${lessonKey}`, { state: { lessonKey } });
    } else {
      navigate(`/terms/${lessonKey}`, { state: { lessonKey } });
    }
  };
  

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
          <button
            onClick={() => navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, {
              state: { showButton, fromLecture }
            })}
          >
            <img src={leftArrow} alt="Left Arrow" className="arrow" />
          </button>

          <div className="textOne">
            <p className="m-0">{terms}</p>
          </div>

          <button
            onClick={() => navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
              state: { showButton, fromLecture }
            })}
          >
            <img src={rightArrow} alt="Right Arrow" className="arrow" />
          </button>
        </div>

        <div className="textOne">
          <p>{definition}</p>
        </div>
      </div>

      {/* Show special button only if `showButton` is true AND it's the last term */}
      {showButton && isLastTerm && (
        <div className="special-button-container"
          onClick={() => navigate(`/quiz/${lessonKey}`)}
        >
          <button className="special-button">This is a Special Button</button>
        </div>
      )}
    </>
  );
};

export default LesoneContent;
