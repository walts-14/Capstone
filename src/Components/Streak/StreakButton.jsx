// src/Components/Streak/StreakButton.jsx
import React, { useState, useEffect, useContext } from "react";
import fire from "../../assets/fire.png";  // adjust the path as needed
import medal from "../../assets/diamond.png"; // adjust the path as needed
import "./StreakButton.css";
import { ProgressContext } from "../../Pages/Dashboard/ProgressContext";

/**
 * unwrapDefault(val)
 * - resolves module-wrapped objects like { default: ... }
 * - returns primitives where possible
 * - stringifies complex objects as a last resort
 */
const unwrapDefault = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val !== "object") return val;
  if (Object.prototype.hasOwnProperty.call(val, "default")) return unwrapDefault(val.default);
  // prefer any primitive value inside object
  for (const v of Object.values(val)) {
    if (typeof v !== "object") return v;
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
};

export default function StreakButton() {
  const { streakData = {}, incrementStreak } = useContext(ProgressContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalShownDate, setModalShownDate] = useState(null);
  const MODAL_SHOWN_KEY = "streakModalShownDate";

  // safe primitive values derived from possibly-wrapped streakData
  const safeCurrentStreak = (() => {
    const s = unwrapDefault(streakData?.currentStreak);
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  })();
  const safeLastUpdatedStr = (() => {
    const lu = unwrapDefault(streakData?.lastUpdated);
    // If it's a date-like string, leave it; else try to parse if it's numeric
    if (!lu) return "";
    if (typeof lu === "string") return lu;
    if (typeof lu === "number") return new Date(lu).toString();
    try {
      return String(lu);
    } catch {
      return "";
    }
  })();

  // normalize image src
  const fireSrc = unwrapDefault(fire);
  const medalSrc = unwrapDefault(medal);

  // On mount, load last shown date from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MODAL_SHOWN_KEY);
      if (stored) setModalShownDate(stored);
      else setModalShownDate(null);
    } catch (e) {
      console.warn("StreakButton: failed to read modalShownDate", e);
      setModalShownDate(null);
    }
  }, []);

  const toggle = () => {
    // toggle manual modal (info)
    setIsOpen((v) => !v);
    // Do not touch showModal (reward) here
  };

  // Fix close modal function to close both modal states
  const closeModal = () => {
    setShowModal(false);
    setIsOpen(false);
  };

  // Reward modal logic — runs after modalShownDate is loaded
  useEffect(() => {
    // Wait until modalShownDate is known (null on initial until read)
    if (modalShownDate === null) return;

    const today = new Date().toDateString();

    // already shown today
    if (modalShownDate === today) return;

    // if user opened manual modal, don't show reward modal
    if (isOpen) return;

    // if lastUpdated equals today -> show reward modal
    if (safeLastUpdatedStr) {
      const lastDate = new Date(safeLastUpdatedStr);
      if (!isNaN(lastDate.getTime()) && lastDate.toDateString() === today) {
        setShowModal(true);
        setModalShownDate(today);
        try { localStorage.setItem(MODAL_SHOWN_KEY, today); } catch (e) {}
        return;
      }
    }

    // if no lastUpdated and currentStreak < 1 -> increment then show reward
    if ((!safeLastUpdatedStr || safeLastUpdatedStr === "") && safeCurrentStreak < 1) {
      try {
        if (typeof incrementStreak === "function") {
          incrementStreak();
        } else {
          console.warn("StreakButton: incrementStreak not available from context; skipping server call and updating UI only.");
        }
      } catch (e) {
        console.error("StreakButton: incrementStreak failed", e);
      }
      setShowModal(true);
      setModalShownDate(today);
      try { localStorage.setItem(MODAL_SHOWN_KEY, today); } catch (e) {}
      return;
    }

    // if a day has passed since lastUpdated -> increment and show modal
    if (safeLastUpdatedStr) {
      const lastDate = new Date(safeLastUpdatedStr);
      if (!isNaN(lastDate.getTime())) {
        const now = new Date();
        const diffTime = now.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 1) {
          try {
            if (typeof incrementStreak === "function") {
              incrementStreak();
            } else {
              console.warn("StreakButton: incrementStreak not available from context; skipping server call and updating UI only.");
            }
          } catch (e) {
            console.error("StreakButton: incrementStreak failed", e);
          }
          setShowModal(true);
          setModalShownDate(today);
          try { localStorage.setItem(MODAL_SHOWN_KEY, today); } catch (e) {}
        }
      }
    }
    // run when streak-related values change or when modalShownDate is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeLastUpdatedStr, safeCurrentStreak, modalShownDate, isOpen]);

  // helper to compute reward based on day number (same logic you had)
  const calcReward = (day) => {
    const d = Number(day) || 1;
    if (d === 1) return 5;
    if (d === 2) return 10;
    if (d === 3) return 15;
    if (d === 4) return 20;
    if (d === 5) return 30;
    if (d === 6) return 40;
    if (d >= 7) return 50;
    return 0;
  };

  // Render primitive-safe values only
  const displayStreakNum = safeCurrentStreak;

  return (
    <>
      <button className="streak-btn" onClick={toggle} type="button">
        <img src={fireSrc} alt="streak" className="streak-icon" />
        <div className="streak-info">
          <div className="streak-num">{String(displayStreakNum)}</div>
          <span className="streak-label">Day <br /> Streak</span>
        </div>
      </button>

      {isOpen && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header with flame icon + number */}
            <div className="streak-modal-header">
              <div className="streak-header-number">{String(displayStreakNum)}</div>
              <img src={fireSrc} alt="flame" className="streak-header-flame" />
            </div>
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">
              Learn new FSL to earn points and build streak
            </p>
            <div className="streak-modal-reward">
              <img src={medalSrc} alt="medal" className="streak-reward-icon" />
              <span className="streak-reward-text">
                +{String(calcReward(displayStreakNum))}
              </span>
            </div>
            <button className="streak-close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header with flame icon + number */}
            <div className="streak-modal-header">
              <div className="streak-header-number">{String(displayStreakNum)}</div>
              <img src={fireSrc} alt="flame" className="streak-header-flame" />
            </div>
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">
              Learn new FSL to earn points and build streak
            </p>
            <div className="streak-modal-reward">
              <img src={medalSrc} alt="medal" className="streak-reward-icon" />
              <span className="streak-reward-text">
                +{String(calcReward(displayStreakNum))}
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
