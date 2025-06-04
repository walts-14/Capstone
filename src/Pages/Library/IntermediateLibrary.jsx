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
      <div className="level-container font-bold mb-1">
        <Link to="/terms/termsfive">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 1</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Basic Greetings & Introductions</p>
          </div>
        </Link>
        <Link to="/terms/termssix">
          <div className="level-content rounded-3">
            <span className="text-3xl">Lesson 2</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Casual Conversations</p>
          </div>
        </Link>
        <Link to="/terms/termsseven">
          <div className="level-content rounded-3">
            <span className="text-3xl">Lesson 3</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Expressing Emotions & Feelings</p>
          </div>
        </Link>
        <Link to="/terms/termseight">
          <div className="level-content rounded-3">
            <span className="text-3xl">Lesson 4</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Making Requests & Offers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default IntermediateLibrary;
