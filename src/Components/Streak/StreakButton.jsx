// src/Components/Streak/StreakButton.jsx
import React, { useState, useEffect, useContext } from "react";
import fireImport from "../../assets/fire.png";
import medalImport from "../../assets/diamond.png";
import "../StreakButton.css";
import { ProgressContext } from "../../Pages/Dashboard/ProgressContext";

/* small helpers */

// Recursively search an object for any node that is an object with a `default` key.
// Returns array of { path, value } found; path is like "streakData.currentStreak" or "fireImport"
const deepFindDefault = (obj, base = "") => {
  const found = [];
  const seen = new WeakSet();
  const walk = (val, path) => {
    if (val && typeof val === "object") {
      if (seen.has(val)) return;
      seen.add(val);
      if (Object.prototype.hasOwnProperty.call(val, "default")) {
        found.push({ path, value: val });
        // still continue into default to find nested ones
        walk(val.default, path + ".default");
      } else {
        for (const k of Object.keys(val)) {       
          try {
            walk(val[k], path ? `${path}.${k}` : k);
          } catch (e) {
            // defensive
          }
        }
      }
    }
  };
  walk(obj, base);
  return found;
};

// If a possible JSX child is an object, return a safe representation (string or <pre>).
// Also logs a console.error so upstream can be fixed.
const sanitizeForJSX = (name, val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return val;
  if (React.isValidElement(val)) return val;
  if (Array.isArray(val)) return val.map((v, i) => sanitizeForJSX(`${name}[${i}]`, v));
  // if object, try unwrap default, then stringify
  if (typeof val === "object") {
    if (Object.prototype.hasOwnProperty.call(val, "default")) {
      const unwrapped = val.default;
      console.warn(`StreakButton: "${name}" contained a module-like object with .default — unwrapping for render. Path: ${name}`, val);
      return sanitizeForJSX(`${name}.default`, unwrapped);
    }
    console.error(`StreakButton: "${name}" is an object and would cause React to throw — converting to JSON for safe render. Fix upstream source.`, val);
    try {
      return <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(val, null, 2)}</pre>;
    } catch (e) {
      return String(val);
    }
  }
  // fallback
  return String(val);
};

// normalize asset imports like { default: '/path' } -> '/path'
const normalizeAsset = (imp) =>
  imp && typeof imp === "object" && Object.prototype.hasOwnProperty.call(imp, "default") ? imp.default : imp;

export default function StreakButton() {
  const { streakData = {}, incrementStreak, currentUserEmail } = useContext(ProgressContext) || {};

  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalShownDate, setModalShownDate] = useState(null);
  const MODAL_SHOWN_KEY = (email) => `streakModalShownDate_${email}`;

  // Convert the shapes your ProgressContext promises into local safe primitives.
  // But keep the original raw shapes for diagnostic scanning.
  const rawCurrentStreak = streakData?.currentStreak;
  const rawLastUpdated = streakData?.lastUpdated;

  const safeCurrentStreak = (() => {
    const n = Number(rawCurrentStreak);
    return Number.isFinite(n) ? n : 0;
  })();

  const safeLastUpdatedDate = (() => {
    if (!rawLastUpdated) return null;
    const d = new Date(rawLastUpdated);
    return isNaN(d.getTime()) ? null : d;
  })();

  const safeLastUpdatedStr = safeLastUpdatedDate ? safeLastUpdatedDate.toString() : "";

  // normalize image src (ensure primitive string)
  const fireSrcRaw = normalizeAsset(fireImport);
  const medalSrcRaw = normalizeAsset(medalImport);

  // --- DIAGNOSTICS: find any .default shapes in the important locals ---
  useEffect(() => {
    const toScan = {
      streakData,
      rawCurrentStreak,
      rawLastUpdated,
      fireImport,
      medalImport,
      fireSrcRaw,
      medalSrcRaw,
    };
    const found = deepFindDefault(toScan, "root");
    if (found.length) {
      console.error("StreakButton: found module-wrapped objects (contain 'default') inside these paths — these can cause 'Objects are not valid as a React child' errors. Fix upstream exports / API responses. Listing found items:", found);
      // print a readable summary for each
      found.forEach((f) => {
        console.groupCollapsed(`[StreakButton] .default found at ${f.path}`);
        console.log(f.value);
        console.groupEnd();
      });
    } else {
      // helpful debug - comment out if noisy
      // console.debug("StreakButton: no module-wrapped (.default) shapes detected in scanned locals.");
    }
  }, [streakData, rawCurrentStreak, rawLastUpdated, fireSrcRaw, medalSrcRaw]);

  // Defensive: create sanitized values for render-time usage
  const fireSrc = sanitizeForJSX("fireSrc", fireSrcRaw);
  const medalSrc = sanitizeForJSX("medalSrc", medalSrcRaw);
  const displayStreakNum = sanitizeForJSX("displayStreakNum", safeCurrentStreak);
  const lastUpdatedStrSafe = sanitizeForJSX("lastUpdatedStr", safeLastUpdatedStr);

  // Load last shown date for current user from localStorage when user changes
  useEffect(() => {
    if (!currentUserEmail) { setModalShownDate(null); return; }
    try {
      const stored = localStorage.getItem(MODAL_SHOWN_KEY(currentUserEmail));
      if (stored) setModalShownDate(stored);
      else setModalShownDate(null);
    } catch (e) {
      console.warn("StreakButton: failed to read modalShownDate", e);
      setModalShownDate(null);
    }
  }, [currentUserEmail]);

  const toggle = () => {
    setIsOpen((v) => !v);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsOpen(false);
  };

  // Combined reward modal and auto-show logic
  useEffect(() => {
    if (!currentUserEmail) return;

    const key = MODAL_SHOWN_KEY(currentUserEmail);
    const today = new Date();
    const todayStr = today.toDateString();

    try {
      const stored = localStorage.getItem(key);
      if (stored === todayStr) return;
    } catch (e) {
      console.warn("StreakButton: failed to read modalShownDate from localStorage", e);
    }

    const updateStreak = (reset = false) => {
      try {
        if (typeof incrementStreak === "function") {
          incrementStreak(reset);
        } else {
          console.warn("StreakButton: incrementStreak not available from context; skipping server call.");
        }
      } catch (e) {
        console.error("StreakButton: incrementStreak failed", e);
      }
    };

    const lastDate = safeLastUpdatedDate;
    const now = new Date();

    if (!lastDate) {
      updateStreak(true);
      setShowModal(true);
      setModalShownDate(todayStr);
      try {
        localStorage.setItem(key, todayStr);
      } catch (e) {}
      return;
    }

    const diffTime = now.setHours(0, 0, 0, 0) - lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      updateStreak(false);
      setShowModal(true);
      setModalShownDate(todayStr);
      try {
        localStorage.setItem(key, todayStr);
      } catch (e) {}
    } else if (diffDays > 1) {
      updateStreak(true);
      setShowModal(true);
      setModalShownDate(todayStr);
      try {
        localStorage.setItem(key, todayStr);
      } catch (e) {}
    }
  }, [currentUserEmail, safeLastUpdatedDate, incrementStreak]);


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

  // Ensure displayStreakNumber is a number for calcReward
  const displayStreakNumber = Number(displayStreakNum) || 0;

  // Render — using sanitized values (sanitizeForJSX already returns safe renderable types)
  return (
    <>
      <button className="streak-btn" onClick={toggle} type="button">
        {typeof fireSrc === "string" ? <img src={fireSrc} alt="streak" className="streak-icon" /> : fireSrc}
        <div className="streak-info">
          <div className="streak-num">{String(displayStreakNumber)}</div>
          <span className="streak-label">Day <br /> Streak</span>
        </div>
      </button>

      {isOpen && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="streak-modal-header">
              <div className="streak-header-number">{String(displayStreakNumber)}</div>
              {typeof fireSrc === "string" ? <img src={fireSrc} alt="flame" className="streak-header-flame" /> : fireSrc}
            </div>
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">Learn new FSL to earn points and build streak</p>
            <div className="streak-modal-reward">
              {typeof medalSrc === "string" ? <img src={medalSrc} alt="medal" className="streak-reward-icon" /> : medalSrc}
              <span className="streak-reward-text">+{String(calcReward(displayStreakNumber))}</span>
            </div>
            <button className="streak-close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="streak-modal-backdrop" onClick={closeModal}>
          <div className="streak-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="streak-modal-header">
              <div className="streak-header-number">{String(displayStreakNumber)}</div>
              {typeof fireSrc === "string" ? <img src={fireSrc} alt="flame" className="streak-header-flame" /> : fireSrc}
            </div>
            <h2 className="streak-modal-title">DAY STREAK!</h2>
            <p className="streak-modal-subtitle">Learn new FSL to earn points and build streak</p>
            <div className="streak-modal-reward">
              {typeof medalSrc === "string" ? <img src={medalSrc} alt="medal" className="streak-reward-icon" /> : medalSrc}
              <span className="streak-reward-text">+{String(calcReward(displayStreakNumber))}</span>
            </div>
            <button className="streak-close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
