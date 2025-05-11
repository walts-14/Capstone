import React from "react";
import { Link } from "react-router-dom";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "./LibraryButtons";
import "../../css/LevelofDifficulty.css"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

function IntermediateLibrary() {
  return (
    <div style={{ "--level-bg-start": "#947809", "--level-bg-end": "#d4ac0d" }}>
      <Sidenav />
      <LibraryButtons />
      <div className="level-container fw-bold mb-1">
        <Link to="/terms/termsfive">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 1</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Basic Greetings & Introductions</p>
          </div>
        </Link>
        <Link to="/terms/termssix">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 2</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Casual Conversations</p>
          </div>
        </Link>
        <Link to="/terms/termsseven">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 3</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Expressing Emotions & Feelings</p>
          </div>
        </Link>
        <Link to="/terms/termseight">
          <div className="level-content rounded-3">
            <span className="fs-3">Lesson 4</span>
            <span className="fs-4">30 items</span>
            <p className="fs-1">Making Requests & Offers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default IntermediateLibrary;
