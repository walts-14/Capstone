import React from "react";
import { Link } from "react-router-dom";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "../Library/LibraryButtons";
import "../../css/LevelofDifficulty.css"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

function AdvancedLibrary() {
  return (
    <div style={{ "--level-bg-start": "#601c15", "--level-bg-end": "#86271E" }}>
      <Sidenav />
      <LibraryButtons />
      <div className="level-container fw-bold mb-1">
        <Link to="/terms/termsnine">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 1</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">
              Advanced Vocabulary - School, Work, and Hobbies
            </p>
          </div>
        </Link>
        <Link to="/terms/termsten">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 2</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Storytelling Basics</p>
          </div>
        </Link>
        <Link to="/terms/termseleven">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 3</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Cultural Insights and Idioms</p>
          </div>
        </Link>
        <Link to="/terms/termstwelve">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 4</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Expressing Opinions and Debate</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdvancedLibrary;
