import React from "react";
import { Link } from "react-router-dom";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "./LibraryButtons";
import "../../css/LevelofDifficulty.css"; // Ensure this path is correct

function BasicLibrary() {
  return (
    <div style={{ "--level-bg-start": "#174360", "--level-bg-end": "#205D87" }}>
      <Sidenav />
      <LibraryButtons />

      <div className="level-container fw-bold mb-1">
        <Link to="/terms/termsone">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 1</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Introduction to Sign Language</p>
          </div>
        </Link>
        <Link to="/terms/termstwo">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 2</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Common Everyday Signs</p>
          </div>
        </Link>
        <Link to="/terms/termsthree">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 3</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Numbers and Days of the Week</p>
          </div>
        </Link>
        <Link to="/terms/termsfour">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 4</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Basic Classroom Vocabulary</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default BasicLibrary;
