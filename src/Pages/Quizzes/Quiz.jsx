import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backkpoint from "../../assets/backkpoint.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Quiz.css";

function Quiz() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="back fs-1 fw-bold d-flex"
        onClick={() => navigate("/page1")}
      >
        <img
          src={backkpoint}
          class="img-fluid w-50 h-50 p-1 mt-2"
          alt="ideas image"
          onClick={() => navigate("/page1")}
        />
        <p>Back</p>
      </div>
      <div className="grid text-center fw-bold rounded-4">
        <div className="g-col-6">.g-col-6</div>
        <div className="g-col-6">.g-col-6</div>
        <div className="g-col-6">.g-col-6</div>
        <div className="g-col-6">.g-col-6</div>
      </div>
    </>
  );
}

export default Quiz;
