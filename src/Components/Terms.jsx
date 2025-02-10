import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Terms.css";

function Terms() {
  return (
    <>
      <div className="terms-container fw-bold mb-1">
        <a href="#">
          <div className="terms-content rounded-3">
            <span className="fs-3"> Lesson 1 </span>
            <span className="fs-4"> 25 items</span>
            <p className="fs-1"> Introduction to Sign Language</p>
          </div>
        </a>
        <a href="#">
          <div className="terms-content rounded-3">
            <span className="fs-3"> Lesson 2 </span>
            <span className="fs-4"> 25 items</span>
            <p className="fs-1">Common Everyday Signs</p>
          </div>
        </a>
        <a href="#">
          <div className="terms-content rounded-3">
            <span className="fs-3"> Lesson 3 </span>
            <span className="fs-4"> 25 items</span>
            <p className="fs-1"> Numbers and Days of the Week</p>
          </div>
        </a>
        <a href="#">
          <div className="terms-content rounded-3">
            <span className="fs-3"> Lesson 4 </span>
            <span className="fs-4"> 25 items</span>
            <p className="fs-1"> Matching and Memory Game</p>
          </div>
        </a>
      </div>
    </>
  );
}
export default Terms;
