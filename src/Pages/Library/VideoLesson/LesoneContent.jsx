import React from "react";
import video from "../../../video/A.mp4";
import Back from '../../../assets/BackButton.png'
import leftArrow from '../../../assets/leftArrow.png';
import rightArrow from '../../../assets/rightArrow.png';
import "../../../css/lesoneContent.css";
const LesoneContent = () => {
  
  const poster = "https://static.vecteezy.com/system/resources/previews/001/984/164/original/color-abstract-background-sun-rise-can-be-used-in-poster-banner-flyer-ans-website-free-vector.jpg";
  return (
    <>
    <div className="tryone-container">
      <video width="650" height="400" controls> 
        <source src={video} />
      </video>
      </div>
      <div className="back-button">
        <a href="/lessonone"> 
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

