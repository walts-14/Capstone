import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const ProgressContext = createContext();
export const useProgress = () => useContext(ProgressContext);

// Must exactly match your backend’s shape:
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

export const ProgressProvider = ({ children, initialUserEmail = "", initialUserName = "" }) => {
  // Use initialUserEmail and initialUserName props if provided, else fallback to localStorage
  const storedEmail = initialUserEmail || localStorage.getItem("userEmail") || "";
  const storedName  = initialUserName  || localStorage.getItem("userName")  || "";
  const storedUsername = localStorage.getItem("userUsername") || "";

  const [currentUserEmail, setCurrentUserEmail] = useState(storedEmail);
  const [currentUserName, setCurrentUserName]   = useState(storedName);
  const [currentUserUsername, setCurrentUserUsername] = useState(storedUsername);

  // Sync currentUserUsername state with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const username = localStorage.getItem("userUsername") || "";
      console.log("ProgressContext: localStorage userUsername =", username);
      setCurrentUserUsername(username);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also call once on mount to sync initial value
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const [progressData, setProgressData] = useState(() => {
    const saved = storedEmail
      ? localStorage.getItem(`progress_${storedEmail}`)
      : null;
    if (saved) {
      console.log("Loaded progress from localStorage for", storedEmail, ":", saved);
    }
    return saved ? JSON.parse(saved) : initialProgress;
  });

  const [streakData, setStreakData] = useState(() => {
    // Try to use value from localStorage if available (optional), else fallback to backend fetch
    return {
      currentStreak: null,
      lastUpdated: null,
      streakFreeze: false,
    };
  });

  const STORAGE_KEY = (email) => `progress_${email}`;

  // 1) Fetch progress & streak when email changes
  useEffect(() => {
    if (!currentUserEmail) {
      setProgressData(initialProgress);
      return;
    }
    (async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY(currentUserEmail));
        if (saved) {
          console.log("Using cached progress from localStorage for", currentUserEmail, ":", saved);
          setProgressData(JSON.parse(saved));
        } else {
          console.log("No cached progress found for", currentUserEmail);
          setProgressData(initialProgress);
        }

        const [prgRes, strRes] = await Promise.all([
        axios.get(`/api/progress/email/${encodeURIComponent(currentUserEmail)}`),
        axios.get(`/api/streak/email/${encodeURIComponent(currentUserEmail)}`)
        ]);

        if (prgRes.data.progress) {
          console.log("Fetched progress from backend for", currentUserEmail, ":", prgRes.data.progress);
          setProgressData(prgRes.data.progress);
          localStorage.setItem(
            STORAGE_KEY(currentUserEmail),
            JSON.stringify(prgRes.data.progress)
          );
        }

        if (strRes.data.streak) {
          setStreakData(strRes.data.streak);
        }
      } catch (err) {
        console.error("Error fetching progress/streak:", err);
      }
    })();
  }, [currentUserEmail]);

  // 2) Sync progress to backend & localStorage
  useEffect(() => {
    if (!currentUserEmail) return;
    localStorage.setItem(
      STORAGE_KEY(currentUserEmail),
      JSON.stringify(progressData)
    );
    (async () => {
      try {
        await axios.put(
          `/api/progress/email/${encodeURIComponent(currentUserEmail)}`,
          { progress: progressData }
        );
      } catch (err) {
        console.error("Error syncing progress:", err);
      }
    })();
  }, [progressData, currentUserEmail]);

  // 3) Sync streak to backend
  useEffect(() => {
    if (!currentUserEmail) return;
    (async () => {
      try {
        await axios.put(
          `/api/streak/email/${encodeURIComponent(currentUserEmail)}`,
          { streak: streakData }
        );
      } catch (err) {
        console.error("Error syncing streak:", err);
      }
    })();
  }, [streakData, currentUserEmail]);

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

  const incrementStreak = async () => {
    if (!currentUserEmail) return;
    try {
      // Prepare new streak object
      const newStreak = {
        ...streakData,
        currentStreak: (streakData.currentStreak || 0) + 1,
        lastUpdated: new Date(),
      };
      // Call backend to update streak and points, and use backend's streak in state
      const res = await axios.put(`/api/streak/email/${currentUserEmail}`, { streak: newStreak });
      if (res.data && res.data.streak) {
        setStreakData(res.data.streak); // Always use backend's streak
      } else {
        setStreakData(newStreak); // fallback
      }
      if (res.data && res.data.pointsAdded) {
        console.log(`Points added: ${res.data.pointsAdded}`);
      }
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        currentUserEmail,
        setCurrentUserEmail,
        currentUserName,
        setCurrentUserName,
        currentUserUsername,
        setCurrentUserUsername,
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
