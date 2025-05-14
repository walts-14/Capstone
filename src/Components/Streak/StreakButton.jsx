import React, { useState } from "react";
import fire from "../../assets/fire.png";  // adjust the path as needed
import medal from "../../assets/diamond.png"; // adjust the path as needed
import "./StreakButton.css";

export default function StreakButton({ streak }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((v) => !v);

  return (
    <>
      <button className="streak-btn" onClick={toggle}>
        <img src={fire} alt="streak" className="streak-icon" />
        <div className="streak-info"> 
          <div className="streak-num">5</div>
          <span className="streak-label">Day <br/> Streak</span>
        </div>
      </button>

      {isOpen && (
         <div className="modal-backdrop" onClick={toggle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header with flame icon + number */}
            <div className="modal-header">
              <div className="header-number">30</div>
              <img src={fire} alt="flame" className="header-flame" />
            </div>

            {/* Title and subtitle */}
            <h2 className="modal-title">DAY STREAK!</h2>
            <p className="modal-subtitle">
              Learn new FSL to earn points and build streak
            </p>

            {/* Reward row */}
            <div className="modal-reward">
              <img src={medal} alt="medal" className="reward-icon" />
              <span className="reward-text">+100</span>
            </div>

            {/* Close button */}
            <button className="close-btn" onClick={toggle}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
