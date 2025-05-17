import React, { useContext, useEffect, useState } from "react";
import { ProgressContext } from "./ProgressContext.jsx";
import axios from "axios";
import trophy from "../../assets/trophy.png";
import StreakButton from "../../Components/Streak/StreakButton.jsx";

// Helper to compute % complete for a lesson
const calculateProgress = (progressObj = {}) => {
  let score = 0;
  if (progressObj.step1Lecture) score += 25;
  if (progressObj.step1Quiz)    score += 25;
  if (progressObj.step2Lecture) score += 25;
  if (progressObj.step2Quiz)    score += 25;
  return score;
};

const lessonsByLevel = {
  basic:        ["termsone","termstwo","termsthree","termsfour"],
  intermediate: ["termsfive","termssix","termsseven","termseight"],
  advanced:     ["termsnine","termsten","termseleven","termstwelve"],
};
const lessonOffsets = { basic: 0, intermediate: 4, advanced: 8 };

export default function ProgressTracker({ student }) {
  const {
    progressData: contextProgressData,
    streakData,
    currentUserUsername,
    currentUserName,
    currentUserEmail,
  } = useContext(ProgressContext);

  // Display the username: prioritize the student prop when showing someone else's progress
  const displayUsername = student?.username
    || currentUserUsername
    || localStorage.getItem("userUsername")
    || "UnknownStudent";

  // Rank: still matching by the API’s `name` field against currentUserName
  const [userRank, setUserRank] = useState(null);

  // Which email to fetch progress for
  const studentEmail = student?.email || currentUserEmail;
  const [progressData, setProgressData] = useState(contextProgressData);
 const targetName = student?.name?.trim() || currentUserName?.trim() || "";
  // ———— Leaderboard effect ————
  useEffect(() => {
    if (!targetName) {
      setUserRank("Unranked");
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get("/api/leaderboard", {
          headers: axios.defaults.headers.common
        });
        const sorted = [...data].sort((a, b) => b.points - a.points);
        // match on the student’s name
        const idx = sorted.findIndex(
          u => u.name.trim().toLowerCase() === targetName.toLowerCase()
        );
        setUserRank(idx >= 0 ? idx + 1 : "Unranked");
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        setUserRank("Unranked");
      }
    })();
  }, [targetName]);

  // ———— Progress fetch effect ————
  useEffect(() => {
    if (!studentEmail) {
      setProgressData(contextProgressData);
      return;
    }
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/email/${studentEmail}`,
          { headers: axios.defaults.headers.common }
        );
        setProgressData(res.data.progress || contextProgressData);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setProgressData(contextProgressData);
      }
    })();
  }, [studentEmail, contextProgressData]);

  const styles = {
    basic:        { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced:     { backgroundColor: "#86271E" },
  };

  return (
    <>
      <div className="tracker">
        <StreakButton />
        <div className="position-lb d-flex align-items-center gap-1">
          <img
            src={trophy}
            className="h-auto mt-4 ms-3 mb-3 img-fluid"
            alt="trophy"
          />
          <p className="fs-1 text-center ms-2">
            {userRank == null
              ? "..."
              : typeof userRank === "number"
              ? `#${userRank}`
              : "Unranked"}
          </p>
          <p className="text-nowrap fs-2">{displayUsername}</p>
        </div>
      </div>

      <div className="lessonTracker d-flex flex-column text-white rounded-4 p-3">
        {Object.keys(lessonsByLevel).map((level) => (
          <div key={level} className={`${level}Tracker rounded-4 mt-4`}>
            <div className={`${level}Title fs-1 text-center mb-3`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>

            {lessonsByLevel[level].map((lessonKey, idx) => {
              const prog = progressData[level]?.[lessonKey] || {};
              const pct  = calculateProgress(prog);
              const lbl  = `Lesson ${lessonOffsets[level] + idx + 1}`;
              return (
                <div
                  key={lessonKey}
                  className={`${level}tracker d-flex m-3 rounded-4 p-2 justify-content-between`}
                  style={styles[level]}
                >
                  <span>{lbl}</span>
                  <span style={{ color: "#160A2E" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
