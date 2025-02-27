import React from "react";
import video from "../../../video/A.mp4";
import Back from '../../../assets/BackButton.png'
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
const LesoneContent = () => {
  
  
  return (
    <>
    <div className="tryone-container">
      <video width="650" height="400" controls> 
        <source src={video} />
      </video>
      </div>
      <div className="back-button">
        <a href="/terms/termsone"> 
          <img src={Back} />
        </a>
        </div> 
        <div className="text-container">
  <div className="letter-container">
    <a href="/previous">
      <img src={leftArrow} alt="Left Arrow" className="arrow" />
    </a>
    <div className="textOne">
      <p className="m-0">A</p>
    </div>
    <a href="/bb">
      <img src={rightArrow} alt="Right Arrow" className="arrow" />
    </a>
  </div>
  <div className="textOne">
    <p>Alphabet, Apple, Ant</p>
  </div>
</div>
      </>
    
  );
}

export default LesoneContent;

