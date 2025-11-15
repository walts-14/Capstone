import React from "react";
import { Link } from "react-router-dom";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "./LibraryButtons";
import "../../css/LevelofDifficulty.css"; // Ensure this path is correct

function BasicLibrary() {
  return (
    <div style={{ "--level-bg-start": "#174360", "--level-bg-end": "#205D87" }}>
      <Sidenav />
      <div className="library-main-layout">
        <div className="library-buttons-top">
          <LibraryButtons />
        </div>
        <div className="level-container font-bold">
          <Link to="/terms/termsone">
            <div className="level-content rounded-xl">
              <span className="text-3xl">Lesson 1</span>
              <span className="text-2xl pt-2">30 items</span>
              <p className="text-5xl">Introduction to Sign Language A-Z</p>
            </div>
          </Link>
          <Link to="/terms/termstwo">
            <div className="level-content rounded-xl">
              <span className="text-3xl">Lesson 2</span>
              <span className="text-2xl pt-2">30 items</span>
              <p className="text-5xl">
                Common Expressions and Polite Greetings
              </p>
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
              <p className="text-5xl">
                Classroom and School Map Interpretation
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BasicLibrary;
