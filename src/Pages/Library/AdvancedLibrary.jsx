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
      <div className="level-container font-bold mb-1">
        <Link to="/terms/termsnine">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 1</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">
              Advanced Vocabulary - School, Work, and Hobbies
            </p>
          </div>
        </Link>
        <Link to="/terms/termsten">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 2</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Storytelling Basics</p>
          </div>
        </Link>
        <Link to="/terms/termseleven">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 3</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Cultural Insights and Idioms</p>
          </div>
        </Link>
        <Link to="/terms/termstwelve">
          <div className="level-content rounded-xl">
            <span className="text-3xl">Lesson 4</span>
            <span className="text-2xl pt-2">30 items</span>
            <p className="text-5xl">Expressing Opinions and Debate</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdvancedLibrary;
