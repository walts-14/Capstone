import { createContext, useState, useEffect } from "react";

export const LivesContext = createContext();

export const LivesProvider = ({ children }) => {
  const [lives, setLives] = useState(() => {
    return parseInt(localStorage.getItem("userLives")) || 5;
  });

  useEffect(() => {
    localStorage.setItem("userLives", lives);
  }, [lives]);

  return (
    <LivesContext.Provider value={{ lives, setLives }}>
      {children}
    </LivesContext.Provider>
  );
};
