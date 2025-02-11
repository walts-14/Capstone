import React from "react";
import Sidenav from "./Sidenav";
import LibraryButtons from "./LibraryButtons";
import "../css/AdvancedLibrary.css";

function AdvancedLibrary() {
  return (
    <>
      <Sidenav />
      <LibraryButtons />
      <div className="adv-container fw-bold mb-1">
        <a href="#">
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
            <p className="fs-1"> Cultural Insights and Idioms</p>
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
