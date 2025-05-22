import React, { useState, useEffect, useContext } from "react";
import fire from "../../assets/fire.png";  // adjust the path as needed
import medal from "../../assets/diamond.png"; // adjust the path as needed
import "./StreakButton.css";
import { ProgressContext } from "../../Pages/Dashboard/ProgressContext";


export default function StreakButton() {
  const { streakData, incrementStreak } = useContext(ProgressContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalShownDate, setModalShownDate] = useState(null);
  const MODAL_SHOWN_KEY = "streakModalShownDate";

  // On mount, load last shown date from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(MODAL_SHOWN_KEY);
    if (stored) setModalShownDate(stored);
  }, []);

  const toggle = () => {
    // Only open the modal for manual view, not the reward modal
    setIsOpen((v) => !v);
    // Do NOT set showModal here
  };

  // Fix close modal function to close both modal states
  const closeModal = () => {
    setShowModal(false);
    setIsOpen(false);
  };

  // Only run reward modal logic after modalShownDate is loaded
  useEffect(() => {
    if (modalShownDate === null) return; // Wait until loaded from localStorage
    const today = new Date().toDateString();
    if (modalShownDate === today) return; // Already shown today
    if (isOpen) return; // Don't show reward modal if info modal is open

    // If streak already updated for today, show modal ONLY if this is the first load for today
    if (streakData.lastUpdated && new Date(streakData.lastUpdated).toDateString() === today) {
      setShowModal(true);
      setModalShownDate(today);
      localStorage.setItem(MODAL_SHOWN_KEY, today);
      return;
    }

    // If no lastUpdated and streak is less than 1, increment and show modal (first ever login)
    if (!streakData.lastUpdated && streakData.currentStreak < 1) {
      incrementStreak();
      setShowModal(true);
      setModalShownDate(today);
      localStorage.setItem(MODAL_SHOWN_KEY, today);
      return;
    }

    // If a day has passed, increment and show modal (first login of a new day)
    if (streakData.lastUpdated) {
      const lastDate = new Date(streakData.lastUpdated);
      const now = new Date();
      const diffTime = now.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 1) {
        incrementStreak();
        setShowModal(true);
        setModalShownDate(today);
        localStorage.setItem(MODAL_SHOWN_KEY, today);
      }
    }
  // Add modalShownDate to dependencies so effect only runs after it's loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakData.lastUpdated, streakData.currentStreak, modalShownDate]);

  // Remove the second useEffect that shows modal automatically on streakData.currentStreak change

  return (
    <>
      <button className="streak-btn" onClick={toggle}>
        <img src={fire} alt="streak" className="streak-icon" />
        <div className="streak-info">
          <div className="streak-num">{streakData.currentStreak == null ? 1 : streakData.currentStreak}</div>
          <span className="streak-label">Day <br /> Streak</span>
        </div>
      </button>

      {isOpen && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header with flame icon + number */}
            <div className="streak-modal-header">
              <div className="streak-header-number">{streakData.currentStreak}</div>
              <img src={fire} alt="flame" className="streak-header-flame" />
            </div>
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">
              Learn new FSL to earn points and build streak
            </p>
            <div className="streak-modal-reward">
              <img src={medal} alt="medal" className="streak-reward-icon" />
              <span className="streak-reward-text">
                +{(() => {
                  const day = streakData.currentStreak == null ? 1 : streakData.currentStreak;
                  if (day === 1) return 5;
                  else if (day === 2) return 10;
                  else if (day === 3) return 15;
                  else if (day === 4) return 20;
                  else if (day === 5) return 30;
                  else if (day === 6) return 40;
                  else if (day >= 7) return 50;
                  else return 0;
                })()}
              </span>
            </div>
            <button className="streak-close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Show reward modal only if showModal is true (not on manual open) */}
      {showModal && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header with flame icon + number */}
            <div className="streak-modal-header">
              <div className="streak-header-number">{streakData.currentStreak}</div>
              <img src={fire} alt="flame" className="streak-header-flame" />
            </div>
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">
              Learn new FSL to earn points and build streak
            </p>
            <div className="streak-modal-reward">
              <img src={medal} alt="medal" className="streak-reward-icon" />
              <span className="streak-reward-text">
                +{(() => {
                  const day = streakData.currentStreak == null ? 1 : streakData.currentStreak;
                  if (day === 1) return 5;
                  else if (day === 2) return 10;
                  else if (day === 3) return 15;
                  else if (day === 4) return 20;
                  else if (day === 5) return 30;
                  else if (day === 6) return 40;
                  else if (day >= 7) return 50;
                  else return 0;
                })()}
              </span>
            </div>
            <button className="streak-close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
