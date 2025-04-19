// src/contexts/ProgressContext.jsx
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

export const ProgressProvider = ({ children, userId }) => {
  const [progressData, setProgressData] = useState(() => {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return initialProgress;
    const parsed = JSON.parse(stored);
    return {
      basic: { ...initialProgress.basic, ...parsed.basic },
      intermediate: { ...initialProgress.intermediate, ...parsed.intermediate },
      advanced: { ...initialProgress.advanced, ...parsed.advanced },
    };
  });

  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    lastUpdated: null,
    streakFreeze: false,
  });

  // Fetch progress and streak from the backend on mount.
  useEffect(() => {
    async function fetchData() {
      try {
        const progressRes = await API.get(`/progress/${userId}`);
        if (progressRes.data && progressRes.data.progress) {
          setProgressData(progressRes.data.progress);
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressRes.data.progress));
        }
        const streakRes = await API.get(`/streak/${userId}`);
        if (streakRes.data && streakRes.data.streak) {
          setStreakData(streakRes.data.streak);
        }
      } catch (error) {
        console.error("Error fetching progress/streak:", error);
      }
    }
    if (userId) fetchData();
  }, [userId]);

  // Sync progress to backend and localStorage when progressData changes.
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
    async function syncProgress() {
      try {
        await API.put(`/progress/${userId}`, { progress: progressData });
        console.log("Progress synced with backend");
      } catch (error) {
        console.error("Error syncing progress:", error);
      }
    }
    if (userId) syncProgress();
  }, [progressData, userId]);

  // Sync streak to backend when streakData changes.
  useEffect(() => {
    async function syncStreak() {
      try {
        await API.put(`/streak/${userId}`, { streak: streakData });
        console.log("Streak synced with backend");
      } catch (error) {
        console.error("Error syncing streak:", error);
      }
    }
    if (userId) syncStreak();
  }, [streakData, userId]);

  // Function to update progress in a given lesson and part.
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

  // Example function to increment the streak.
  const incrementStreak = () => {
    setStreakData(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      lastUpdated: new Date(),
    }));
  };

  return (
    <ProgressContext.Provider value={{ progressData, updateProgress, streakData, incrementStreak }}>
      {children}
    </ProgressContext.Provider>
  );
};
