import { useState, useEffect } from "react";
import "../../css/Introductions.css";
import Sidenav from "../../Components/Sidenav";
import Interpreter from "./Interpreter";
import HowtoPlay from "./HowtoPlay";

export default function Introduction() {
  const [activeComponent, setActiveComponent] = useState("interpreter");

  // ensure Interpreter is the default whenever this screen mounts
  useEffect(() => {
    setActiveComponent("interpreter");
  }, []);

  return (
    <>
      <Sidenav />
      <div className="introduction-container">
        <div className="intro-header">
          <div className="intro-text">INTRODUCTION</div>
          <div className="twobuttons">
            <button
              className={`rounded-2 me-3 ${
                activeComponent === "interpreter" ? "active-btn" : ""
              }`}
              onClick={() => setActiveComponent("interpreter")}
            >
              Interpreter
            </button>
            <button
              className={`rounded-2 ${
                activeComponent === "howtoplay" ? "active-btn" : ""
              }`}
              onClick={() => setActiveComponent("howtoplay")}
            >
              How to Play
            </button>
          </div>
        </div>

        <div className="scroll-area">
          <div className="component-display">
            {activeComponent === "interpreter" && <Interpreter />}
            {activeComponent === "howtoplay" && <HowtoPlay />}
          </div>
        </div>
      </div>
    </>
  );
}
