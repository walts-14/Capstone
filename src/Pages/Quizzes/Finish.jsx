import React from "react";
import "../../css/Finish.css";
import { useLocation, useNavigate } from "react-router-dom";
import Applause from "../../assets/Applause.png";
import diamond from "../../assets/diamond.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import repeatLogo from "../../assets/repeat logo.png";
import arrow from "../../assets/arrow.png";
import dashboardlogo from "../../assets/dashboardlogo.png";

function Finish() {
  const navigate = useNavigate();
  const location = useLocation();
  const { correctAnswers = 0, wrongAnswers = 0 } = location.state || {};

  return (
    <>
      <div className="finishtext d-flex flex-column align-items-center position-relative fw-bold fs-1">
        <img src={Applause} className="img-fluid p-1 mb-3" alt="applause img" />
        <p> You've Finish the Lesson </p>
        <div className="dia-reward d-flex pt-1">
          <img src={diamond} className="img-fluid p-1 ms-5" alt="diamond img" />
          <p className="dia-number ms-3 me-5"> {correctAnswers * 10} </p>
        </div>
        <div className="stats-quiz d-flex flex-row gap-1 text-center">
          <img src={check} className="tama img-fluid p-1 " alt="check img" />
          <p className="check-number ms-2"> {correctAnswers} </p>
          <img src={ekis} className="mali img-fluid p-1 ms-5" alt="ekis img" />
          <p className="ekis-number ms-2"> {wrongAnswers} </p>
          <img
            src={repeatLogo}
            className="ulit img-fluid p-1 ms-5"
            alt="repeat img"
          />
          <p className="repeat-number"> 3 </p>
        </div>
      </div>
      <div className="finishbuttons rounded-4 d-flex align-items-center justify-content-center">
        <div
          type="button"
          className="dashboard-button d-flex justify-content-center align-items-center mt-2 ms-5 rounded-4 fs-3"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={dashboardlogo}
            className="img-fluid d-flex ms-2 p-1 mt-1"
            alt="dashboard img"
            onClick={() => navigate("/dashboard")}
          />
          <p className="ms-2 mt-4"> Dashboard </p>
        </div>
        <button
          type="button"
          className="continue d-flex justify-content-center rounded-4 pt-2 mb-4 ms-auto me-5 "
          onClick={() => navigate("/correct")}
        >
          Continue
          <img
            src={arrow}
            className="img-fluid d-flex ms-2 p-1 mt-1"
            alt="arrow img"
            onClick={() => navigate("/correct")}
          />
        </button>
      </div>
    </>
  );
}

export default Finish;
