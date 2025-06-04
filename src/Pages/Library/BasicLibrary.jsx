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

      <div className="level-container font-bold mb-1">
        <Link to="/terms/termsone">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 1</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Introduction to Sign Language</p>
          </div>
        </Link>
        <Link to="/terms/termstwo">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 2</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Common Everyday Signs</p>
          </div>
        </Link>
        <Link to="/terms/termsthree">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 3</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Numbers and Days of the Week</p>
          </div>
        </Link>
        <Link to="/terms/termsfour">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 4</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Basic Classroom Vocabulary</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default BasicLibrary;
