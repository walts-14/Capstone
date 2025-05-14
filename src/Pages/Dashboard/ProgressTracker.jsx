import React, { useContext, useEffect, useState } from "react";
import { ProgressContext } from "./ProgressContext.jsx";
import axios from "axios";
import trophy from "../../assets/trophy.png";
import StreakButton from "../../Components/Streak/StreakButton.jsx";

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

const lessonOffsets = {
  basic: 0,
  intermediate: 4,
  advanced: 8,
};

function ProgressTracker({ student }) {
  // Use currentUserName and currentUserEmail from context as fallback
  const { progressData: contextProgressData, streakData, currentUserName, currentUserEmail } =
    useContext(ProgressContext);
  const [userRank, setUserRank] = useState(null);
  const [userName, setUserName] = useState(
    student?.name || currentUserName || "Unknown Student"
  );

  // Use email from student prop or fallback to currentUserEmail
  const studentEmail = student?.email || currentUserEmail;

  // Local state for fetched progress data
  const [progressData, setProgressData] = useState(contextProgressData);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/leaderboard",
          { headers: axios.defaults.headers.common }
        );
        const sortedLeaderboard = [...response.data].sort(
          (a, b) => b.points - a.points
        );
        const normalizedStudentName = (student?.name || currentUserName)
          ?.trim()
          .toLowerCase();
        const rankIndex = sortedLeaderboard.findIndex((u) => {
          if (u.name && normalizedStudentName) {
            return u.name.trim().toLowerCase() === normalizedStudentName;
          }
          return false;
        });
        setUserRank(rankIndex >= 0 ? rankIndex + 1 : "N/A");
        if (rankIndex >= 0) {
          setUserName(
            sortedLeaderboard[rankIndex].name ||
              currentUserName ||
              "Unknown Student"
          );
        }
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        setUserRank("N/A");
      }
    };

    if (studentEmail) fetchLeaderboard();
  }, [studentEmail, currentUserName, student]);

  // Fetch progress for the student if student prop is provided
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (studentEmail) {
          const response = await axios.get(
            `http://localhost:5000/api/progress/email/${studentEmail}`,
            { headers: axios.defaults.headers.common }
          );
          if (response.data.progress) {
            setProgressData(response.data.progress);
          }
        }
      } catch (error) {
        console.error("Error fetching progress for student:", error);
        setProgressData(contextProgressData);
      }
    };

    if (student) {
      fetchProgress();
    } else {
      setProgressData(contextProgressData);
    }
  }, [student, studentEmail, contextProgressData]);

  const styles = {
    basic: { backgroundColor: "#205D87" },
    intermediate: { backgroundColor: "#947809" },
    advanced: { backgroundColor: "#86271E" },
  };

  return (
    <>
      <div className="tracker">
        <StreakButton></StreakButton>
        <div className="position-lb d-flex align-items-center gap-1">
          <img
            src={trophy}
            className="h-auto mt-4 ms-3 mb-3 img-fluid"
            alt="trophy"
          />
          <p className="fs-1 text-center ms-2">
            {userRank === null
              ? "..."
              : typeof userRank === "number"
              ? `#${userRank}`
              : "Unranked"}
          </p>
          {/* ✔︎ display the clicked student’s name */}
          <p className="text-nowrap fs-2">{userName}</p>
        </div>
      </div>

      <div className="lessonTracker d-flex flex-column text-white rounded-4 p-3">
        {Object.keys(lessonsByLevel).map((level) => (
          <div key={level} className={`${level}Tracker rounded-4 mt-4`}>
            <div className={`${level}Title fs-1 text-center mb-3`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>

            {lessonsByLevel[level].map((lessonKey, idx) => {
              const lessonProgress = progressData[level]?.[lessonKey] || {};
              const progressPercent = calculateProgress(lessonProgress);
              const displayName = `Lesson ${lessonOffsets[level] + idx + 1}`;

              return (
                <div
                  key={lessonKey}
                  className={`${level}tracker d-flex m-3 rounded-4 p-2 justify-content-between`}
                  style={styles[level]}
                >
                  <span>{displayName}</span>
                  <span style={{ color: "#160A2E" }}>{progressPercent}%</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default ProgressTracker;
