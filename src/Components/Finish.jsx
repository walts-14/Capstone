import React from "react";
import "../css/Finish.css";
import Applause from "../assets/Applause.png";

function Finish() {
  return (
    <>
      <div className="finishtext d-flex flex-column align-items-center position-relative fw-bold fs-1">
        <img src={Applause} class="img-fluid p-1 mb-3" alt="applause img" />
        <p> You've Finish the Lesson </p>
      </div>
    </>
  );
}

export default Finish;
