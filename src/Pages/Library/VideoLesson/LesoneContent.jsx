import React, { useEffect, useRef } from "react";
import Back from '../../../assets/BackButton.png';
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
import { useParams, useNavigate } from "react-router-dom";
import OneTerms from "../Terms/OneTerms";

const LesoneContent = () => {
  const { termId } = useParams(); // Get the term ID from URL
  const navigate = useNavigate();
  const videoRef = useRef(null); // Reference to video element

  const termData = OneTerms.find(term => term.id === parseInt(termId)); // Find the matching term
  if (!termData) {
    return <p>Term not found</p>; // Handle invalid term ID
  }

  const { terms, definition, video } = termData;

  // Find previous and next terms (loop around at start/end)
  const currentIndex = OneTerms.findIndex(term => term.id === parseInt(termId));
  const prevTerm = OneTerms[currentIndex - 1] || OneTerms[OneTerms.length - 1]; // Wrap to last item if at start
  const nextTerm = OneTerms[currentIndex + 1] || OneTerms[0]; // Wrap to first item if at end

  // Auto-play video when term changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reload video source
      videoRef.current.play().catch(error => console.error("Video play error:", error));
    }
  }, [termId]); // Runs whenever termId changes (user clicks next/previous)

  return (
    <>
      <div className="tryone-container">
        <video ref={videoRef} key={video} width="650" height="400" controls autoPlay loop>
          <source src={video} type="video/mp4" />
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
