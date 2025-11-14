// Recursively sanitize any object, unwrapping .default and converting to primitives where possible
const sanitizeDeep = (val) => {
  if (val === null || val === undefined) return val;
  if (typeof val !== "object") return val;
  if (Object.prototype.hasOwnProperty.call(val, "default")) return sanitizeDeep(val.default);
  if (Array.isArray(val)) return val.map(sanitizeDeep);
  const out = {};
  for (const k in val) {
    if (Object.prototype.hasOwnProperty.call(val, k)) {
      out[k] = sanitizeDeep(val[k]);
    }
  }
  return out;
};
// src/Pages/Dashboard/ProgressContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "../api.js";

export const ProgressContext = createContext();
export const useProgress = () => useContext(ProgressContext);

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

// helper to unwrap { default: ... } and also return primitive-friendly values
const unwrap = (v) => {
  if (v === null || v === undefined) return v;
  if (typeof v !== "object") return v;
  if (Object.prototype.hasOwnProperty.call(v, "default")) return unwrap(v.default);
  return v;
};

export const ProgressProvider = ({ children, initialUserEmail = "", initialUserName = "" }) => {
  const storedEmail = initialUserEmail || localStorage.getItem("userEmail") || "";
  const storedName  = initialUserName  || localStorage.getItem("userName")  || "";
  const storedUsername = localStorage.getItem("userUsername") || "";

  const [currentUserEmail, setCurrentUserEmail] = useState(storedEmail);
  const [currentUserName, setCurrentUserName]   = useState(storedName);
  const [currentUserUsername, setCurrentUserUsername] = useState(storedUsername);

  useEffect(() => {
    const handleStorageChange = () => {
      const username = localStorage.getItem("userUsername") || "";
      console.log("ProgressContext: localStorage userUsername =", username);
      setCurrentUserUsername(username);
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [progressData, setProgressData] = useState(() => {
    const saved = storedEmail ? localStorage.getItem(`progress_${storedEmail}`) : null;
    if (saved) {
      console.log("Loaded progress from localStorage for", storedEmail, ":", saved);
    }
    return saved ? JSON.parse(saved) : initialProgress;
  });

  // ensure streakData has safe, primitive-friendly values
  const [streakData, setStreakData] = useState(() => ({
    currentStreak: null,
    lastUpdated: null,
    streakFreeze: false,
  }));

  // Central points state so UI can display authoritative points from backend
  const [points, setPoints] = useState(null);

  // Ref to avoid sending identical streak repeatedly (helps prevent duplicate server calls from refreshing)
  const lastSentStreakRef = useRef(null);
  // Ref to prevent concurrent/in-flight claim calls from calling incrementStreak multiple times
  const claimInProgressRef = useRef(false);
  // Refs to indicate we've completed the initial server load; guard sync effects until set
  const progressInitializedRef = useRef(false);
  const streakInitializedRef = useRef(false);

  const STORAGE_KEY = (email) => `progress_${email}`;

  // Fetch progress & streak when email changes
  useEffect(() => {
    if (!currentUserEmail) {
      setProgressData(initialProgress);
      return;
    }
    // Clear any previously-sent streak payload when switching users
    try { lastSentStreakRef.current = null; } catch (e) {}
    // Reset points while new user data loads to avoid flashing previous user's points
    try { setPoints(null); } catch (e) {}
    // Try to restore cached points for this user to avoid UI flash while backend responds
    try {
      const cachedPts = localStorage.getItem(`points_${currentUserEmail}`);
      if (cachedPts != null) setPoints(Number(cachedPts));
    } catch (e) {}
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

        if (prgRes?.data?.progress) {
          console.log("Fetched progress from backend for", currentUserEmail, "raw:", prgRes.data.progress);
          const progress = unwrap(prgRes.data.progress);
          console.log("Fetched progress unwrapped:", progress);
          setProgressData(progress);
          localStorage.setItem(STORAGE_KEY(currentUserEmail), JSON.stringify(progress));
        }

        if (strRes?.data?.streak) {
          console.log("Fetched streak raw:", strRes.data.streak);
          const s = sanitizeDeep(strRes.data.streak) || {};
          // Normalize streak fields to safe types
          const normalized = {
            currentStreak: s.currentStreak == null ? null : Number(s.currentStreak),
            lastUpdated: s.lastUpdated ? String(s.lastUpdated) : null,
            streakFreeze: !!s.streakFreeze,
            ...s, // keep any extras but primitives preferred
          };
          console.log("Fetched streak normalized:", normalized);
          setStreakData(normalized);
        }
  // Try to get the user's points from the backend as part of the initial load
        try {
          const ts = Date.now();
          const ptsRes = await axios.get(`/api/points/email/${encodeURIComponent(currentUserEmail)}?_=${ts}`);
          if (ptsRes?.data?.points != null) {
            setPoints(Number(ptsRes.data.points));
            try { localStorage.setItem(`points_${currentUserEmail}`, String(ptsRes.data.points)); } catch (e) {}
          }
        } catch (e) {
          // ignore points fetch failure for now
        }
        // Mark initial load complete so sync effects can start operating
        try { progressInitializedRef.current = true; } catch (e) {}
        try { streakInitializedRef.current = true; } catch (e) {}
      } catch (err) {
        console.error("Error fetching progress/streak:", err);
      }
    })();
  }, [currentUserEmail]);

  // Persist points to localStorage whenever they change for this user
  useEffect(() => {
    if (!currentUserEmail) return;
    try { if (points != null) localStorage.setItem(`points_${currentUserEmail}`, String(points)); } catch (e) {}
  }, [points, currentUserEmail]);

  // Sync progress to backend & localStorage
  useEffect(() => {
    if (!currentUserEmail) return;
    // Don't sync to backend until we've finished the initial fetch (prevents accidental updates on reload)
    if (!progressInitializedRef.current) {
      try { localStorage.setItem(STORAGE_KEY(currentUserEmail), JSON.stringify(progressData)); } catch (e) {}
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY(currentUserEmail), JSON.stringify(progressData));
    } catch (e) {
      console.warn("Failed to set progress in localStorage", e);
    }
    (async () => {
      try {
        await axios.put(`/api/progress/email/${encodeURIComponent(currentUserEmail)}`, { progress: progressData });
      } catch (err) {
        console.error("Error syncing progress:", err);
      }
    })();
  }, [progressData, currentUserEmail]);

  // Sync streak to backend (avoid superadmin)
  useEffect(() => {
    if (!currentUserEmail) return;
    if (currentUserEmail.toLowerCase().includes('superadmin')) return;
    const serialized = JSON.stringify(streakData || {});
    // Avoid syncing streak until initial server load completes
    if (!streakInitializedRef.current) return;
    if (lastSentStreakRef.current === serialized) return; // avoid redundant PUTs
    (async () => {
      try {
        await axios.put(`/api/streak/email/${encodeURIComponent(currentUserEmail)}`, { streak: streakData });
        lastSentStreakRef.current = serialized;
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

  const incrementStreak = async (reset = false) => {
    if (!currentUserEmail) return;
    if (currentUserEmail.toLowerCase().includes('superadmin')) return;
    if (claimInProgressRef.current) return; // already in progress
    claimInProgressRef.current = true;
    try {
      const newStreak = reset
        ? { ...streakData, currentStreak: 1, lastUpdated: new Date().toISOString() }
        : { ...streakData, currentStreak: (Number(streakData.currentStreak) || 0) + 1, lastUpdated: new Date().toISOString() };

      // Mark this streak as "last sent" to avoid the sync effect re-sending the same payload
      try {
        lastSentStreakRef.current = JSON.stringify(newStreak);
      } catch (e) {
        /* ignore */
      }

      // Debug: print payload before sending
      try { console.debug("incrementStreak: PUT payload ->", { email: currentUserEmail, streak: newStreak }); } catch (e) {}
  const res = await axios.put(`/api/streak/email/${encodeURIComponent(currentUserEmail)}`, { streak: newStreak });
      // Debug: print backend response for diagnosis
      try { console.debug("incrementStreak: backend response ->", res?.data); } catch (e) {}

      // Always unwrap backend response
      const backendStreak = sanitizeDeep(res?.data?.streak) || res?.data?.streak || null;
      if (backendStreak) {
        const normalized = {
          currentStreak: backendStreak.currentStreak == null ? Number(newStreak.currentStreak) : Number(backendStreak.currentStreak),
          lastUpdated: backendStreak.lastUpdated ? String(backendStreak.lastUpdated) : String(newStreak.lastUpdated),
          streakFreeze: !!backendStreak.streakFreeze,
          ...backendStreak,
        };
        console.log("incrementStreak: using backend normalized streak:", normalized);
        setStreakData(normalized);
        // update lastSentStreakRef so the sync effect doesn't immediately re-send identical streak
        try { lastSentStreakRef.current = JSON.stringify(normalized); } catch (e) {}
        return { streak: normalized, points: res?.data?.points, pointsAdded: res?.data?.pointsAdded };
      } else {
        console.log("incrementStreak: backend did not return streak — using optimistic newStreak:", newStreak);
        setStreakData(sanitizeDeep(newStreak));
        return { streak: sanitizeDeep(newStreak), points: res?.data?.points, pointsAdded: res?.data?.pointsAdded };
      }

      // Use authoritative points value returned by backend (if present)
      if (res?.data?.points != null) {
        setPoints(Number(res.data.points));
      }
      if (res?.data?.pointsAdded) {
        console.log(`Points added: ${res.data.pointsAdded}`);
      }
    } catch (err) {
      console.error("Error updating streak:", err);
    }
    finally {
      claimInProgressRef.current = false;
    }
  };

  // Reset streak (set to 0) and persist to backend
  const resetStreak = async () => {
    if (!currentUserEmail) return;
    if (currentUserEmail.toLowerCase().includes('superadmin')) return;
    try {
      const newStreak = { ...streakData, currentStreak: 0, lastUpdated: new Date().toISOString() };
      const res = await axios.put(`/api/streak/email/${encodeURIComponent(currentUserEmail)}`, { streak: newStreak });
      const backendStreak = sanitizeDeep(res?.data?.streak) || res?.data?.streak || null;
      if (backendStreak) {
        const normalized = {
          currentStreak: backendStreak.currentStreak == null ? Number(newStreak.currentStreak) : Number(backendStreak.currentStreak),
          lastUpdated: backendStreak.lastUpdated ? String(backendStreak.lastUpdated) : String(newStreak.lastUpdated),
          streakFreeze: !!backendStreak.streakFreeze,
          ...backendStreak,
        };
        setStreakData(normalized);
        try { lastSentStreakRef.current = JSON.stringify(normalized); } catch (e) {}
        return { streak: normalized, points: res?.data?.points, pointsAdded: res?.data?.pointsAdded };
      } else {
        setStreakData(sanitizeDeep(newStreak));
        return { streak: sanitizeDeep(newStreak), points: res?.data?.points, pointsAdded: res?.data?.pointsAdded };
      }

      if (res?.data?.points != null) {
        setPoints(Number(res.data.points));
      }
    } catch (err) {
      console.error("Error resetting streak:", err);
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
  resetStreak,
        points,
        setPoints,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

// Persist points to localStorage whenever they change for the current user
// (this runs outside the provider component but uses localStorage directly)
// Note: components should still prefer context `points` when available.
try {
  // no-op placeholder; actual persistence occurs inside the provider via setPoints usage
} catch (e) {}
