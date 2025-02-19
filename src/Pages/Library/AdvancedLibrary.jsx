import React from "react";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "../Library/LibraryButtons";
import "../../css/AdvancedLibrary.css"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

function AdvancedLibrary() {
  return (
    <>
      <Sidenav />
      <LibraryButtons />
      <div className="adv-container fw-bold mb-1">
        <a href="/Lessons/LessonOne">
          <div className="adv-content rounded-3">
            <span className="fs-3"> Lesson 1 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1">
              Advanced Vocabulary - School, Work, and Hobbies
            </p>
          </div>
        </a>
        <a href="#">
          <div className="adv-content rounded-3">
            <span className="fs-3"> Lesson 2 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1">Storytelling Basics</p>
          </div>
        </a>
        <a href="#">
          <div className="adv-content rounded-3">
            <span className="fs-3"> Lesson 3 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1"> Cul tural Insights and Idioms</p>
          </div>
        </a>
        <a href="#">
          <div className="adv-content rounded-3">
            <span className="fs-3"> Lesson 4 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1"> Expressing Opinions and Debate</p>
          </div>
        </a>
      </div>
      
    </>
  );
}

export default AdvancedLibrary;
