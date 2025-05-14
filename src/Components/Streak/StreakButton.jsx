import React, { useState, useEffect, useContext } from "react";
import fire from "../../assets/fire.png";  // adjust the path as needed
import medal from "../../assets/diamond.png"; // adjust the path as needed
import "./StreakButton.css";
import { ProgressContext } from "../../Pages/Dashboard/ProgressContext";

export default function StreakButton() {
  const { streakData, incrementStreak } = useContext(ProgressContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggle = () => setIsOpen((v) => !v);

  // Fix close modal function to close both modal states
  const closeModal = () => {
    setShowModal(false);
    setIsOpen(false);
  };

  // Check if a day has passed since lastUpdated and increment streak if so
  useEffect(() => {
    if (!streakData.lastUpdated) {
      // No lastUpdated means first time, start streak at 1
      if (streakData.currentStreak < 1) {
        incrementStreak();
        setShowModal(true);
      }
      return;
    }
    const lastDate = new Date(streakData.lastUpdated);
    const now = new Date();

    // Calculate difference in days
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      incrementStreak();
      setShowModal(true);
    }
  }, [streakData.lastUpdated, streakData.currentStreak, incrementStreak]);

  // Show modal automatically when streak increments
  useEffect(() => {
    if (streakData.currentStreak > 0) {
      setShowModal(true);
    }
  }, [streakData.currentStreak]);

  return (
    <>
      <button className="streak-btn" onClick={toggle}>
        <img src={fire} alt="streak" className="streak-icon" />
        <div className="streak-info">
          <div className="streak-num">{streakData.currentStreak}</div>
          <span className="streak-label">Day <br /> Streak</span>
        </div>
      </button>

      {(isOpen || showModal) && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header with flame icon + number */}
            <div className="streak-modal-header">
              <div className="streak-header-number">{streakData.currentStreak}</div>
              <img src={fire} alt="flame" className="streak-header-flame" />
            </div>

            {/* Title and subtitle */}
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">
              Learn new FSL to earn points and build streak
            </p>

            {/* Reward row */}
            <div className="streak-modal-reward">
              <img src={medal} alt="medal" className="streak-reward-icon" />
              <span className="streak-reward-text">+100</span>
            </div>

            {/* Close button */}
            <button className="streak-close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
