import React, { createContext, useState, useEffect } from "react";
import API from "../api";

export const ProgressContext = createContext();

const initialProgress = {
  basic: {
    termsone:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwo:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsthree: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsfour:  { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  intermediate: {
    termsfive:  { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termssix:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsseven: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termseight: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  advanced: {
    termsnine:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsten:    { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termseleven: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwelve: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  }
};

const PROGRESS_STORAGE_KEY = "progressData";

export const ProgressProvider = ({
  children,
  initialUserId = null,
  initialUserName = ""
}) => {
  const [currentUserId, setCurrentUserId]     = useState(initialUserId);
  const [currentUserName, setCurrentUserName] = useState(initialUserName);

  const [progressData, setProgressData] = useState(initialProgress);

  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    lastUpdated:   null,
    streakFreeze:  false,
  });

  // Fetch progress + streak whenever the “currentUserId” changes
  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      try {
        const [{ data: prg }, { data: str }] = await Promise.all([
          API.get(`/progress/${currentUserId}`),
          API.get(`/streak/${currentUserId}`)
        ]);
        if (prg.progress) {
          setProgressData(prg.progress);
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(prg.progress));
        } else {
          // Clear localStorage progress if backend has no progress data
          localStorage.removeItem(PROGRESS_STORAGE_KEY);
          setProgressData(initialProgress);
        }
        if (str.streak) {
          setStreakData(str.streak);
        }
      } catch (err) {
        console.error("Error fetching progress/streak:", err);
      }
    })();
  }, [currentUserId]);

  // Sync progressData to backend + localStorage
  useEffect(() => {
    if (!currentUserId) return;
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
    (async () => {
      try {
        await API.put(`/progress/${currentUserId}`, { progress: progressData });
      } catch (err) {
        console.error("Error syncing progress:", err);
      }
    })();
  }, [progressData, currentUserId]);

  // Sync streakData to backend
  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      try {
        await API.put(`/streak/${currentUserId}`, { streak: streakData });
      } catch (err) {
        console.error("Error syncing streak:", err);
      }
    })();
  }, [streakData, currentUserId]);

  const updateProgress = (level, lessonKey, part) => {
    setProgressData(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [lessonKey]: {
          ...prev[level][lessonKey],
          [part]: true,
        },
      },
    }));
  };

  const incrementStreak = () => {
    setStreakData(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      lastUpdated:   new Date(),
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        currentUserName,
        setCurrentUserName,
        progressData,
        updateProgress,
        streakData,
        incrementStreak,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
