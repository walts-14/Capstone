import React from "react";
import video from "../../../video/A.mp4";
import Back from '../../../assets/BackButton.png'
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
import { useParams, useNavigate } from "react-router-dom";
import OneTerms from "../Terms/OneTerms";

const LesoneContent = () => {
  const { termId } = useParams(); // Get the term ID from URL
  const navigate = useNavigate();

  const termData = OneTerms.find(term => term.id === parseInt(termId)); // Find the matching term
  
  if (!termData) {
    return <p>Term not found</p>; // Handle invalid term ID
  }

  const { terms, definition, video } = termData;

  // Handle previous and next buttons
  const currentIndex = OneTerms.findIndex(term => term.id === parseInt(termId));
  const prevTerm = OneTerms[currentIndex - 1] || OneTerms[OneTerms.length - 1]; // Loop back if at the start
  const nextTerm = OneTerms[currentIndex + 1] || OneTerms[0]; // Loop back if at the end

  return (
    <>
      <div className="tryone-container">
        <video width="650" height="400" controls>
          <source src={video} />
        </video>
      </div>

      <div className="back-button">
        <button onClick={() => navigate("/terms/termsone")}>
          <img src={Back} alt="Back" />
        </button>
      </div>

      <div className="text-container">
        <div className="letter-container">
          <button onClick={() => navigate(`/lesonecontent/${prevTerm.id}`)}>
            <img src={leftArrow} alt="Left Arrow" className="arrow" />
          </button>

          <div className="textOne">
            <p className="m-0">{terms}</p>
          </div>

          <button onClick={() => navigate(`/lesonecontent/${nextTerm.id}`)}>
            <img src={rightArrow} alt="Right Arrow" className="arrow" />
          </button>
        </div>

        <div className="textOne">
          <p>{definition}</p>
        </div>
      </div>
    </>
  );
};

export default LesoneContent;

