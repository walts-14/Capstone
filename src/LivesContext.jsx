import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const LivesContext = createContext();

export const LivesProvider = ({ children }) => {
  const [lives, setLives] = useState(5);

  useEffect(() => {
    const fetchLives = async () => {
      const userEmail = localStorage.getItem("userEmail"); 
      if (!userEmail) {
        console.error("User email not found in localStorage.");
        return;
      }
      try {
        const response = await axios.get(`/api/lives/email/${userEmail}`);
        setLives(response.data.lives);
      } catch (error) {
        console.error("❌ Error fetching lives:", error);
      }
    };

    const checkRegeneration = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;
      
      try {
        console.log("Checking lives regeneration at", new Date().toISOString());
        const response = await axios.post(`/api/lives/email/${userEmail}/regenerate`);
        if (response.data.lives !== lives) {
          console.log("Lives regenerated to:", response.data.lives);
          setLives(response.data.lives);
        }
      } catch (error) {
        console.error("❌ Error regenerating lives:", error);
      }
    };

    fetchLives();
    
    // Check regeneration every minute
    const interval = setInterval(checkRegeneration, 60000);
    return () => clearInterval(interval);
  }, []);

  const loseLife = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found in localStorage.");
      return;
    }
    try {
      const response = await axios.post(`/api/lives/email/${userEmail}/lose-life`);
      setLives(response.data.lives);
    } catch (error) {
      console.error("❌ Error deducting life:", error);
    }
  };

  const gainLife = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found in localStorage.");
      return;
    }
    try {
      const response = await axios.post(`/api/lives/email/${userEmail}/gain-life`);
      setLives(response.data.lives);
    } catch (error) {
      console.error("❌ Error gaining life:", error);
    }
  };

  return (
    <LivesContext.Provider value={{ lives, setLives, loseLife, gainLife }}>
      {children}
    </LivesContext.Provider>
  );
};
