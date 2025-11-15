// ProgressTracker.jsx
import React, { useContext, useEffect, useState } from "react";
import { ProgressContext } from "./ProgressContext.jsx";
import axios from "axios";
import trophy from "../../assets/trophy.png";
import fire from "../../assets/fire.png";
import medal from "../../assets/diamond.png";
import progress from "../../assets/ProgressIcon.png";

// Helper to compute % complete for a lesson
const calculateProgress = (progressObj = {}) => {
  let score = 0;
  if (progressObj.step1Lecture) score += 25;
  if (progressObj.step1Quiz) score += 25;
  if (progressObj.step2Lecture) score += 25;
  if (progressObj.step2Quiz) score += 25;
  return score;
};

const lessonsByLevel = {
  basic: ["termsone", "termstwo", "termsthree", "termsfour"],
  intermediate: ["termsfive", "termssix", "termsseven", "termseight"],
  advanced: ["termsnine", "termsten", "termseleven", "termstwelve"],
};
const lessonOffsets = { basic: 0, intermediate: 4, advanced: 8 };

// Utility: unwrap objects that look like module wrappers { default: ... } or nested objects
const unwrapDefault = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val !== "object") return val;
  if (Object.prototype.hasOwnProperty.call(val, "default")) return unwrapDefault(val.default);
  for (const v of Object.values(val)) {
    if (typeof v !== "object") return v;
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
};
const srcFrom = (img) => unwrapDefault(img);

// New utility to calculate overall progress and current lesson
const calculateOverallProgress = (progressData) => {
  if (!progressData) return { overallPercent: 0, currentLesson: 1 };

  const levels = ["basic", "intermediate", "advanced"];
  let totalSteps = 0;
  let completedSteps = 0;
  let currentLesson = 1;
  let lessonFound = false;

  for (const level of levels) {
    const lessons = lessonsByLevel[level];
    for (let i = 0; i < lessons.length; i++) {
      const lessonKey = lessons[i];
      const lessonProgress = progressData[level]?.[lessonKey] || {};
      const steps = ["step1Lecture", "step1Quiz", "step2Lecture", "step2Quiz"];
      totalSteps += steps.length;

      // Count completed steps
      let lessonCompletedSteps = 0;
      for (const step of steps) {
        if (lessonProgress[step]) {
          completedSteps++;
          lessonCompletedSteps++;
        }
      }

      // Determine current lesson as first lesson with incomplete steps
      if (!lessonFound && lessonCompletedSteps < steps.length) {
        currentLesson = lessonOffsets[level] + i + 1;
        lessonFound = true;
      }
    }
  }

  // If all lessons completed, currentLesson is max lesson
  if (!lessonFound) {
    currentLesson = 12;
  }

  const overallPercent =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return { overallPercent, currentLesson };
};

  function StreakButton() {
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
      // \Do NOT set showModal here
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
      if (
        streakData.lastUpdated &&
        new Date(streakData.lastUpdated).toDateString() === today
      ) {
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

    const getStreakReward = (day) => {
      if (day === 1) return 5;
      else if (day === 2) return 10;
      else if (day === 3) return 15;
      else if (day === 4) return 20;
      else if (day === 5) return 30;
      else if (day === 6) return 40;
      else if (day >= 7) return 50;
      else return 0;
    };

    const currentStreakValue =
      streakData.currentStreak == null ? 1 : streakData.currentStreak;

    return (
      <>
        {/* Streak Button */}
        <button
          className="btnstreak h-[10vh] w-[5.5vw] rounded-4 px-3 py-2 cursor-pointer static flex items-center justify-center"
          style={{ background: "#271d3e", boxShadow: "0 0 0 5px #F44336" }}
          onClick={toggle}
        >
          <div className="flex flex-row items-center justify-center">
            <img src={fire} alt="streak" className="h-auto w-12 mb-1" />
            <div className="flex flex-col ">
               <p className=" text-white text-4xl mx-0 h-[45px] flex items-center justify-center">
              {currentStreakValue}
            </p>
            <span className="text-[#878194] text-center text-base leading-4 mt-1">
              Day <br /> Streak
            </span>
            </div>
           
          </div>
        </button>

        {/* Manual Info Modal */}
        {isOpen && (
          <div
            className="streak fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="streakContainer text-white p-8 rounded-3xl w-[70%] h-[46vh] max-w-[500px] text-center border-4 gap-2 mr-40"
              style={{ background: "#100429", borderColor: "#FF6536" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with flame icon + number */}
              <div className="flex items-center justify-center gap-2 h-[10vh]">
                <div className="currentText text-[6.5rem] font-bold">
                  {currentStreakValue}
                </div>
                <img src={fire} alt="flame" className="w-20 h-auto mb-4" />
              </div>
              <h2 className="text-3xl mb-4 uppercase">DAY STREAK!</h2>
              <p className="text-2xl mb-4 opacity-80">
                Learn new FSL to earn points and build streak
              </p>
              <div className="rewardStreak flex items-center justify-center gap-2 mb-10 h-[50px]">
                <img src={medal} alt="medal" className="w-14 h-auto" />
                <span className="text-6xl font-bold text-yellow-400">
                  +{getStreakReward(currentStreakValue)}
                </span>
              </div>
              <button
                className="closeBtn py-3 px-6 rounded-full border-none text-white cursor-pointer text-4xl w-full"
                style={{ background: "#c0392b" }}
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}


 {/* Streak Button MOBILE */}
        <button
          className="mobile-btnstreak p-1 cursor-pointer static flex items-center justify-center"
          style={{ background: "#271d3e", boxShadow: "0 0 0 3px #F44336", borderRadius: "12px" }}
          onClick={toggle}
        >
          <div className="flex flex-row items-center justify-center h-[7vh] w-[20vw]">
            <img src={fire} alt="streak" className="h-9 w-9 mb-1" />
            <div className="flex flex-col ">
               <div className="text-white text-2xl h-[30px] flex items-center justify-center">
              {currentStreakValue}
               </div>
              <span className="text-[#878194] text-center text-[9px] leading-2">
                Day <br /> Streak
              </span>
            </div>
           
          </div>
        </button>

        {/* Manual Info Modal */}
        {isOpen && (
          <div
            className="mobile-streak fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="text-white p-4 rounded-3xl w-[70%] h-[46vh] max-w-[500px] text-center border-4 gap-2 z-999"
              style={{ background: "#100429", borderColor: "#FF6536" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with flame icon + number */}
              <div className="flex items-center justify-center gap-2 h-[10vh]">
                <div className="text-[4rem] font-bold">
                  {currentStreakValue}
                </div>
                <img src={fire} alt="flame" className="w-12 h-auto mb-2" />
              </div>
              <h2 className="text-1xl mb-2 uppercase">DAY STREAK!</h2>
              <p className="text-1xl mb-2 opacity-80">
                Learn new FSL to earn points and build streak
              </p>
              <div className="flex items-center justify-center gap-2 mb-1 h-[50px]">
                <img src={medal} alt="medal" className="w-10 h-auto" />
                <span className="text-4xl font-bold text-yellow-400">
                  +{getStreakReward(currentStreakValue)}
                </span>
              </div>
              <button
                className="  border-none text-white cursor-pointer text-5xl h-[32px] w-full"
                style={{ background: "#c0392b", borderRadius: "12px" }}
                onClick={closeModal}
              >
                Close 
              </button>
            </div>
          </div>
        )}





        {/* Reward Modal */}
        {showModal && (
          <div
            className="streak fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
            onClick={closeModal}
          >
            <div
              className="text-white p-8 rounded-5xl w-[70%] h-[45vh] max-w-[500px] text-center border-4 gap-2 mr-40"
              style={{ background: "#100429", borderColor: "#FF6536" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with flame icon + number */}
              <div className="flex items-center justify-center gap-2 h-[10vh]">
                <div className="text-[6.5rem] font-bold">
                  {currentStreakValue}
                </div>
                <img src={fire} alt="flame" className="w-20 h-auto mb-4" />
              </div>
              <h2 className="text-3xl mb-4 uppercase">DAY STREAK!</h2>
              <p className="text-2xl mb-4 opacity-80">
                Learn new FSL to earn points and build streak
              </p>
              <div className="flex items-center justify-center gap-2 mb-10 h-[50px]">
                <img src={medal} alt="medal" className="w-14 h-auto" />
                <span className="text-6xl font-bold text-yellow-400">
                  +{getStreakReward(currentStreakValue)}
                </span>
              </div>
              <button
                className="py-3 px-6 border-none text-white rounded-full cursor-pointer text-3xl w-full"
                style={{ background: "#c0392b" }}
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

export default function ProgressTracker({ student }) {
  // Recursively sanitize any object with a 'default' key
  const sanitizeObjectRecursive = (data) => {
    if (typeof data === "object" && data !== null) {
      if (data.default) return sanitizeObjectRecursive(data.default);
      const sanitized = Array.isArray(data) ? [] : {};
      for (const key in data) {
        sanitized[key] = sanitizeObjectRecursive(data[key]);
      }
      return sanitized;
    }
    return data;
  };

  // Sanitize the student prop early (safe — uses only the prop)
  const sanitizedStudent = sanitizeObjectRecursive(student);

  // Get context (must come before state initialization that uses it)
  const {
    progressData: contextProgressData,
    streakData,
    currentUserUsername,
    currentUserName,
    currentUserEmail,
  } = useContext(ProgressContext);

  // Which email to fetch progress for
  const studentEmail = sanitizedStudent?.email || currentUserEmail || "";

  // Display username (unwrap any `.default` or module-like object)
  const [displayUsername, setDisplayUsername] = useState(
    unwrapDefault(sanitizedStudent?.username) || currentUserUsername || localStorage.getItem("userUsername") || "UnknownStudent"
  );

  useEffect(() => {
    setDisplayUsername(
      unwrapDefault(sanitizedStudent?.username) || currentUserUsername || localStorage.getItem("userUsername") || "UnknownStudent"
    );
  }, [sanitizedStudent, currentUserUsername]);

  // Rank
  const [userRank, setUserRank] = useState(null);

  // Initialize progressData state using a sanitized copy of contextProgressData
  const sanitizeProgressRecursive = (data) => {
    if (typeof data === "object" && data !== null) {
      if (data.default) {
        return sanitizeProgressRecursive(data.default);
      }
      const sanitized = Array.isArray(data) ? [] : {};
      for (const key in data) {
        sanitized[key] = sanitizeProgressRecursive(data[key]);
      }
      return sanitized;
    }
    return data;
  };
  const [progressData, setProgressData] = useState(sanitizeProgressRecursive(contextProgressData));

  // Mobile modal state for progress panel
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const targetName = unwrapDefault(sanitizedStudent?.name)?.trim() || (currentUserName || "").trim() || "";

  // Defensive logger (will not throw)
  const logDefaultObjects = (data, path = "root") => {
    try {
      if (typeof data === "object" && data !== null) {
        if (data.default) {
          console.warn(`Found {default: ...} object at path: ${path}`, data);
        }
        for (const key in data) {
          logDefaultObjects(data[key], `${path}.${key}`);
        }
      }
    } catch (e) {
      // don't let logger crash the app
      console.warn("logDefaultObjects error:", e);
    }
  };

  // Log sanitized copies (safe)
  logDefaultObjects(sanitizedStudent, "prop.student");
  logDefaultObjects(progressData, "state.progressData");
  logDefaultObjects(contextProgressData, "context.progressData");

  // Calculate overall progress and current lesson
  const sanitizedProgressData = sanitizeProgressRecursive(progressData);
  const { overallPercent, currentLesson } = calculateOverallProgress(sanitizedProgressData);

  // Leaderboard effect
  useEffect(() => {
    if (!targetName) {
      setUserRank("Unranked");
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get("/api/leaderboard", {
          headers: axios.defaults.headers.common,
        });
        const sorted = [...data].sort((a, b) => b.points - a.points);
        const idx = sorted.findIndex(
          u => (unwrapDefault(u.name) || "").trim().toLowerCase() === targetName.toLowerCase()
        );
        setUserRank(idx >= 0 ? idx + 1 : "Unranked");
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        setUserRank("Unranked");
      }
    })();
  }, [targetName]);

  // Progress fetch effect
  useEffect(() => {
    if (!studentEmail) {
      setProgressData(sanitizeProgressRecursive(contextProgressData));
      return;
    }
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/email/${encodeURIComponent(studentEmail)}`,
          { headers: axios.defaults.headers.common }
        );
        // guard against module wrappers:
        const incoming = res?.data?.progress || contextProgressData;
        setProgressData(sanitizeProgressRecursive(incoming));
      } catch (err) {
        console.error("Error fetching progress:", err);
        setProgressData(sanitizeProgressRecursive(contextProgressData));
      }
    })();
  }, [studentEmail, contextProgressData]);

  const styles = {
    basic: { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced: { backgroundColor: "#AA362A" },
  };

  const trophySrc = srcFrom(trophy);

  // Render the lessons/progress panel. Accepts isModal to change sizing/styling
  const renderLessonsPanel = (isModal = false) => {
    const panelClass = isModal
      ? "panelClass text-white rounded-3xl p-3  h-280 w-full overflow-y-auto "
      : "panelClass absolute top-40 right-0 text-white rounded-4xl p-3 max-h-[43rem] h-auto w-[25vw] overflow-y-scroll";
    const panelStyle = isModal
      ? {
          backgroundColor: "#271D3E",
          fontFamily: '"Baloo", sans-serif',
          boxShadow: "0 0 0 5px #C0C0C0",
        }
      : {
          backgroundColor: "var(--dark-purple)",
          fontFamily: '"Baloo", sans-serif',
          boxShadow: "0 0 0 5px #C0C0C0",
        };

    return (
      <div className={panelClass} style={panelStyle}>
        {Object.keys(lessonsByLevel).map((level) => (
          <div
            key={level}
            className={`Difprogress rounded-4xl mt-2 mb-3 m-0`}
            style={{
              backgroundColor: "var(--input-gray)",
              border: "0px solid var(--input-gray)",
              height: isModal ? "auto" : "47vh",
            }}
          >
            <div
              className={`DifHeader text-4xl text-center mb-3 h-auto ${isModal ? "w-full" : "w-[13vw]"} p-2`}
              style={{
                backgroundColor:
                  level === "basic"
                    ? "var(--basic-blue)"
                    : level === "intermediate"
                    ? "#D4AC0D "
                    : "#C0392B",
                borderRadius: "40px 10px 70px 0",
                fontFamily: '"Baloo", sans-serif',
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>

            {lessonsByLevel[level].map((lessonKey, idx) => {
              const prog = sanitizedProgressData[level]?.[lessonKey] || {};
              const pct = calculateProgress(prog);
              const lbl = `Lesson ${lessonOffsets[level] + idx + 1}`;
              return (
                <div
                  key={lessonKey}
                  className="Lesprogress flex mx-3 my-3 rounded-2xl p-2 justify-between"
                  style={styles[level]}
                >
                  <span
                    className="Leslabel text-white text-4xl p-2"
                    style={{ fontFamily: '"Baloo", sans-serif' }}
                  >
                    {lbl}
                  </span>
                  <span
                    className="Perclabel text-4xl p-2"
                    style={{
                      color: "#160A2E",
                      fontFamily: '"Baloo", sans-serif',
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      
      <div className="tracker flex flex-row items-center justify-center gap-4 fixed right-12 top-20 z-[100]">
        {/* Streak button (fixed) */}

        <div  className="flex items-center ">
            { <StreakButton /> }
        </div>

        {/* Leaderboard box - align with streak button */}
        <div
          className="btnleaderboard flex items-center text-white rounded-3xl h-[10vh] w-[18vw]  gap-3 px-3 "
          style={{
            backgroundColor: "var(--dark-purple)",
            fontFamily: '"Baloo", sans-serif',
            boxShadow: "0 0 0 5px #DCBC3D",
            alignItems: 'center'
          }}
        >
          <img
            src={trophySrc}
            className="h-10 w-auto me-2"
            alt="trophy"
            style={{ display: 'block' }}
          />
          <div className="flex flex-col justify-center">
            <p className="fs-1 text-left ms-1" style={{ margin: 0, lineHeight: 1 }}>
              {userRank == null ? "..." : (typeof userRank === "number" ? `#${userRank}` : String(userRank))}
            </p>
            <span className="truncate fs-2 ms-1 " style={{ margin: 0, lineHeight: 1 }}>
              {unwrapDefault(displayUsername)}
            </span>
          </div>
        </div>
     
      {renderLessonsPanel(false)}
    </div>

    <div className="mobile-tracker flex flex-row items-center justify-center gap-4 fixed right-7 top-20 z-[1]">
       <div className="streakleaderboard flex flex-row items-center justify-center gap-3 fixed right-5 top-7"> 
        {/* Leaderboard box - align with streak button */}
        <div
          className="flex items-center text-white  h-[8.3vh] w-[45vw]  gap-2 px-1"
          style={{
            backgroundColor: "var(--dark-purple)",
            fontFamily: '"Baloo", sans-serif',
            boxShadow: "0 0 0 3px #DCBC3D",
            alignItems: "center",
            borderRadius: "12px",
          }}
        >
          <img src={trophySrc} className="h-9 w-9" alt="trophy" style={{ display: "block" }} />
          <div className="flex flex-col justify-center">
            <p className="text-1xl" style={{ margin: 0, lineHeight: 1 }}>
              {userRank == null ? "..." : (typeof userRank === "number" ? `#${userRank}` : String(userRank))}
            </p>
            <p className="text-nowrap text-2xl ms-1" style={{ margin: 0, lineHeight: 1 }}>
              {unwrapDefault(displayUsername)}
            </p>
          </div>
        </div>
         {/* Streak button (fixed) */}
        <div className="flex items-center ">
          {<StreakButton />}
        </div>

        {/* Mobile progress open button (replaces inline progress panel) */}
        <div >
          <button
            onClick={() => setMobileModalOpen(true)}
            className="flex items-center py-[2px] px-[11px] h-[8.3vh] w-[15vw] text-align "
            style={{ backgroundColor: "#271D3E", fontFamily: '"Baloo", sans-serif',
                     fontFamily: '"Baloo", sans-serif',
                     boxShadow: "0 0 0 3px #C0C0C0", 
                     borderRadius: "12px"}}
          >
            <img src={progress} alt="" className="h-9 w-9" />
          </button>
        </div>
      </div>
        
    </div>

    {/* Mobile modal showing the progress tracker when open */}
    {mobileModalOpen && (
      <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black bg-opacity-50" onClick={() => setMobileModalOpen(false)}>
        <div
          className="mt-4 w-[94%] h-[83vh] max-w-[640px] rounded-3xl p-4 relative"
          style={{ backgroundColor: "#271D3E", color: "white", fontFamily: '"Baloo", sans-serif' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Close progress modal"
            onClick={() => setMobileModalOpen(false)}
            style={{ position: "absolute", left: 12, top: 12 }}
            className="text-white text-3xl font-bold"
          >
            ✕
          </button>

          <div className="mt-8">{renderLessonsPanel(true)}</div>
        </div>
      </div>
    )}

    {/* Responsive styles for smooth transition */}
      <style>{`
        /* Tablet sidenav and logo - show between 640px-1024px */
        @media (max-width: 768px) {
         .btnstreak {
            display: flex !important;
          }
          .mobile-tracker {
            display: none !important;
          }
          .mobile-btnstreak {
            display: none !important;
          }
          .mobile-streak {
            display: none !important;
          } 
          .tracker {
            position: fixed !important;
            top: 60px !important;
            right: 3vw !important;
            gap: 18px !important;
          }
          .streak {
            z-index: 9999;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            
          }
          .streakContainer {
            width: 420px;
            height: 420px;
            margin-right: 0px !important;
          } 
          .uppercase {
            margin-bottom: 4px !important;
            margin-top: 8px !important;
          }
          .closeBtn {
            border-radius: 12px !important;
            font-size: 24px !important;
          }
          .btnstreak {
            width: 10vw !important;
            height: 10vh !important;
          }
          .btnstreak img, .btnleaderboard img {
            width: 2.8rem !important;
            height: 2.3rem !important;
            margin-right: 0px !important;
          }
          .btnstreak p {
            font-size: 2rem !important;
            margin: 0px !important;
            height: 30px !important;
            leading: 1 !important;
          }
          .btnstreak span {
            font-size: 0.7rem !important;
            margin-top: 0px !important;
          }
          .btnleaderboard {
            border-radius: 18px !important;
            gap: 0rem !important;
            padding: 4px !important;
          }
          .btnleaderboard p {
            font-size: 1.5rem !important;
          }
          .btnleaderboard span {
            font-size: 1rem !important;
          }
          .panelClass {
            height: 72vh !important;
            width: 30.3vw !important;
            position: fixed !important;
            top: 150px !important;
            right: 3vw !important;
            z-index: -1;
          }
          /* Progress panel adjustments for small phones */
          /* make level headers and lesson labels smaller and panels height:auto */
          .Difprogress {
            height: 38vh !important;
            max-height: none !important;
            border-radius: 20px !important;
          }
          /* header inside each level box: pill sizing + font-size */
           .DifHeader {
            font-size: 1.5rem !important; /* requested header font-size */
            padding: 0.15rem !important;
            line-height: 1 !important;
            width: 172px !important;
            height: 28px !important;
            display: inline-block !important;
            text-align: center !important;
            vertical-align: middle !important;
            overflow: visible !important;
            margin-button: 0px;
          }

          .Lesprogress {
            margin: 0.5rem !important;
            height: 40px !important;
           
          }
          /* lesson label and percent text size */
          .rounded-2xl .Leslabel,
          .Lesprogress .Perclabel {
            font-size: 1rem !important; /* requested lesson/percent size */
            width: auto !important;
            padding: 4px !important;
          }
          /* ensure the header padding boxes behave on small screens */
          .Difprogress > DifHeader {
            box-sizing: border-box !important;
          }
          /* reduce inner padding for compact layout */
          .Lesprogress {
            padding: 0.4rem !important;
          }
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
           .btnstreak {
            display: none !important;
          }
          .tracker {
            display: none !important;
          }
          .streak {
            display: none !important;
     
          } 
          .mobile-tracker {
            display: flex !important;
            height: 7.5rem !important;
          }
          .mobile-btnstreak {
            display: flex !important;
          
          }
          .mobile-streak {
            display: flex !important;
            z-index: 9999;
          } 
          
          .panelClass {
            height: 72vh !important;
            z-index: 1;
            width: 80vw !important;
            position: fixed !important;
            top: 71px !important;
            right: 10vw !important;
          }
          /* Progress panel adjustments for small phones */
          /* make level headers and lesson labels smaller and panels height:auto */
          .Difprogress {
            height: 38vh !important;
            max-height: none !important;
            border-radius: 20px !important;
          }
          /* header inside each level box: pill sizing + font-size */
           .DifHeader {
            font-size: 1.5rem !important; /* requested header font-size */
            padding: 0.15rem !important;
            line-height: 1 !important;
            width: 172px !important;
            height: 28px !important;
            display: inline-block !important;
            text-align: center !important;
            vertical-align: middle !important;
            overflow: visible !important;
            margin-button: 0px;
          }

          .Lesprogress {
            margin: 0.5rem !important;
            height: 40px !important;
           
          }
          /* lesson label and percent text size */
          .rounded-2xl .Leslabel,
          .Lesprogress .Perclabel {
            font-size: 1rem !important; /* requested lesson/percent size */
            width: auto !important;
            padding: 4px !important;
          }
          /* ensure the header padding boxes behave on small screens */
          .Difprogress > DifHeader {
            box-sizing: border-box !important;
          }
          /* reduce inner padding for compact layout */
          .Lesprogress {
            padding: 0.4rem !important;
          }
          
        }
        
        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
          .tracker {
            display: flex !important;
          }
          .tablet-logo {
            display: none !important;
          }
          .mobile-tracker {
            display: none !important;
          }
           .mobile-btnstreak {
            display: none !important;
          }
          .mobile-streak {
            display: none !important;
          }   
          .btnstreak {
            display: flex !important;
          }
          .mobile-tracker {
            display: none !important;
          }
          .mobile-btnstreak {
            display: none !important;
          }
          .mobile-streak {
            display: none !important;
          } 
          .tracker {
            position: fixed !important;
            top: 60px !important;
            right: 3vw !important;
            gap: 18px !important;
          }
          .streak {
            z-index: 9999;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            
          }
          .streakContainer {
            width: 420px;
            height: 420px;
            margin-right: 0px !important;
          } 
          .uppercase {
            margin-bottom: 4px !important;
            margin-top: 8px !important;
          }
          .closeBtn {
            border-radius: 12px !important;
            font-size: 24px !important;
          }
          .btnstreak {
            width: 10vw !important;
            height: 10vh !important;
          }
          .btnstreak img, .btnleaderboard img {
            width: 2.8rem !important;
            height: 2.3rem !important;
            margin-right: 0px !important;
          }
          .btnstreak p {
            font-size: 2rem !important;
            margin: 0px !important;
            height: 30px !important;
            leading: 1 !important;
          }
          .btnstreak span {
            font-size: 0.7rem !important;
            margin-top: 0px !important;
          }
          .btnleaderboard {
            border-radius: 18px !important;
            gap: 0rem !important;
            padding: 4px !important;
          }
          .btnleaderboard p {
            font-size: 1.5rem !important;
          }
          .btnleaderboard span {
            font-size: 1rem !important;
          }
          .panelClass {
            height: 72vh !important;
            width: 30.3vw !important;
            position: fixed !important;
            top: 150px !important;
            right: 2.5vw !important;
            z-index: -1;
          }
          /* Progress panel adjustments for small phones */
          /* make level headers and lesson labels smaller and panels height:auto */
          .Difprogress {
            height: 38vh !important;
            max-height: none !important;
            border-radius: 20px !important;
          }
          /* header inside each level box: pill sizing + font-size */
           .DifHeader {
            font-size: 1.5rem !important; /* requested header font-size */
            padding: 0.15rem !important;
            line-height: 1 !important;
            width: 172px !important;
            height: 28px !important;
            display: inline-block !important;
            text-align: center !important;
            vertical-align: middle !important;
            overflow: visible !important;
            margin-button: 0px;
          }

          .Lesprogress {
            margin: 0.5rem !important;
            height: 40px !important;
           
          }
          /* lesson label and percent text size */
          .rounded-2xl .Leslabel,
          .Lesprogress .Perclabel {
            font-size: 1rem !important; /* requested lesson/percent size */
            width: auto !important;
            padding: 4px !important;
          }
          /* ensure the header padding boxes behave on small screens */
          .Difprogress > DifHeader {
            box-sizing: border-box !important;
          }
          /* reduce inner padding for compact layout */
          .Lesprogress {
            padding: 0.4rem !important;
          }
        }

      `}</style>
    </>
  );
}
