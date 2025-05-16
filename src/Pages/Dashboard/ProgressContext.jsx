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

  // New points state added
  const [points, setPoints] = useState(0);

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

  // Fetch user profile if username missing in localStorage
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (localStorage.getItem("userUsername")) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.username) {
            localStorage.setItem("userUsername", data.username);
            setCurrentUserUsername(data.username);
          }
          if (data.email) {
            localStorage.setItem("userEmail", data.email);
            setCurrentUserEmail(data.email);
          }
          if (data.name) {
            localStorage.setItem("userName", data.name);
            setCurrentUserName(data.name);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
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

  const [streakData, setStreakData] = useState({
    currentStreak: 1,  // Changed from 0 to 1 to match backend default
    lastUpdated:   null,
    streakFreeze:  false,
  });

  const STORAGE_KEY = (email) => `progress_${email}`;

  // 1) Fetch progress, streak, and points when email changes
  useEffect(() => {
    if (!currentUserEmail) {
      setProgressData(initialProgress);
      setPoints(0);
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

        const [prgRes, strRes, ptsRes] = await Promise.all([
          axios.get(`/api/progress/email/${encodeURIComponent(currentUserEmail)}`),
          axios.get(`/api/streak/email/${encodeURIComponent(currentUserEmail)}`),
          axios.get(`/api/points/email/${encodeURIComponent(currentUserEmail)}`)  // Fetch points
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

        if (ptsRes.data.points !== undefined) {
          setPoints(ptsRes.data.points);
        }
      } catch (err) {
        console.error("Error fetching progress/streak/points:", err);
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
    setStreakData(prev => {
      const newStreak = {
        ...prev,
        currentStreak: prev.currentStreak + 1,
        lastUpdated: new Date(),
      };
      // Call backend to update streak and points
      if (currentUserEmail) {
        axios.put(`/api/streak/email/${currentUserEmail}`, { streak: newStreak })
          .then(res => {
            if (res.data.pointsAdded !== undefined) {
              setPoints(prevPoints => prevPoints + res.data.pointsAdded);
              console.log(`Points added: ${res.data.pointsAdded}`);
            }
          })
          .catch(err => {
            console.error("Error updating streak:", err);
          });
      }
      return newStreak;
    });
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
        points,  // expose points state
        setPoints,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
