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

  const showButton = location.state?.showButton || false;
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

  return (
    <>
      <div className="tryone-container">
        <video ref={videoRef} key={video} width="650" height="400" controls autoPlay loop>
          <source src={video} type="video/mp4" />
        </video>
      </div>

      <div className="back-button">
        <button onClick={() => navigate(`/terms/${lessonKey}`)}>
          <img src={Back} alt="Back" />
        </button>
      </div>

      <div className="text-container">
        <div className="letter-container">
        <button
            onClick={() => navigate(`/lesonecontent/${lessonKey}/${prevTerm.id}`, {
              state: { showButton } // Preserve showButton state
            })}
          >
            <img src={leftArrow} alt="Left Arrow" className="arrow" />
          </button>

          <div className="textOne">
            <p className="m-0">{terms}</p>
          </div>
          
          <button
            onClick={() => navigate(`/lesonecontent/${lessonKey}/${nextTerm.id}`, {
              state: { showButton } // Preserve showButton state
            })}
          >
            <img src={rightArrow} alt="Right Arrow" className="arrow" />
          </button>  

          

          
        </div>

        <div className="textOne">
          <p>{definition}</p>
        </div>
        
         {/* Show special button only if `showButton` is true */}
      {showButton && isLastTerm &&  (
        <div className="special-button-container"
          onClick={() => navigate(`/quiz/${lessonKey}`)} >
          <button className="special-button">This is a Special Button</button>
        </div>
      )}

      </div>
    </>
  );
};

export default LesoneContent;
