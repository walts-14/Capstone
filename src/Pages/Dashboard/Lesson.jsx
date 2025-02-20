import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Lesson.css";
import { useNavigate } from "react-router-dom";

function Lesson() {
  const navigate = useNavigate();
  return (
    <>
      <div className="lessons-container">
        <div className="lessons rounded-4" onClick={() => navigate("/page1")}>
          1
        </div>

        <div className="lessons rounded-4"> 2</div>
        <div className="lessons rounded-4"> 3</div>
        <div className="lessons rounded-4"> 4</div>
        <div className="lessons rounded-4"> 5</div>
      </div>

      <div className="lessons-container2">
        <div className="lessons2 rounded-4"> 1</div>
        <div className="lessons2 rounded-4"> 2</div>
        <div className="lessons2 rounded-4"> 3</div>
        <div className="lessons2 rounded-4"> 4</div>
        <div className="lessons2 rounded-4"> 5</div>
      </div>

      <div className="lessons-container3">
        <div className="lessons3 rounded-4"> 1</div>
        <div className="lessons3 rounded-4"> 2</div>
        <div className="lessons3 rounded-4"> 3</div>
        <div className="lessons3 rounded-4"> 4</div>
        <div className="lessons3 rounded-4"> 5</div>
      </div>
    </>
  );
}

export default Lesson;
