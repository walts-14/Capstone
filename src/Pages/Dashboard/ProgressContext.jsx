// ProgressContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ProgressContext = createContext();

const initialProgress = {
  basic: {
    termsone: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwo: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsthree: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsfour: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  intermediate: {
    lesson1: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    lesson2: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    lesson3: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    lesson4: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  advanced: {
    lesson1: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    lesson2: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    lesson3: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    lesson4: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  }
};

const PROGRESS_STORAGE_KEY = 'progressData';

export const ProgressProvider = ({ children }) => {
  // Try to initialize from localStorage, else use initialProgress
  const [progressData, setProgressData] = useState(() => {
    const storedData = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : initialProgress;
  });

  // Save progressData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
  }, [progressData]);

  // Update progress for a given level, lessonKey, and part (e.g., "step1Lecture")
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

  return (
    <ProgressContext.Provider value={{ progressData, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
