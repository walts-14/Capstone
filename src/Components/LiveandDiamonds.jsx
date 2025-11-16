import axios from "axios";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ProgressContext } from "../Pages/Dashboard/ProgressContext.jsx";
import heart from "../assets/heart.png";
import diamond from "../assets/diamond.png";

function LivesandDiamonds({ showDiamonds = true, showLives = true }) {
  const [lives, setLives] = useState(5);
  const [points, setPoints] = useState(0);
  const { points: ctxPoints } = useContext(ProgressContext) || {};

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage.");
          return;
        }
        const response = await axios.get(
          `/api/lives/email/${userEmail}`
        );
        setLives(response.data.lives);
      } catch (error) {
        console.error("Error fetching lives:", error);
      }
    };

    fetchLives();
    const livesInterval = setInterval(fetchLives, 5000);
    return () => clearInterval(livesInterval);
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage.");
          return;
        }
        // Add a short cache-busting timestamp to avoid 304 / cached responses
        const ts = Date.now();
        const response = await axios.get(
          `/api/points/email/${userEmail}?_=${ts}`
        );
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    // If ProgressContext already has authoritative points, use that value
    if (typeof ctxPoints === 'number') {
      console.debug("LiveandDiamonds: using context points", ctxPoints);
      setPoints(ctxPoints);
    } else {
      console.debug("LiveandDiamonds: context points not available, fetching from backend");
      fetchPoints();
    }
    const pointsInterval = setInterval(fetchPoints, 5000);
    return () => clearInterval(pointsInterval);
  }, []);

  // react to context points changes as well
  useEffect(() => {
    if (typeof ctxPoints === 'number') {
      console.debug("LiveandDiamonds: ctxPoints updated ->", ctxPoints);
      setPoints(ctxPoints);
    }
  }, [ctxPoints]);

  return (
    <>
      {showLives && (
        <div className="lives-container flex items-center gap-2">
          <img
            src={heart}
            className="heart-icon w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
            alt="lives logo"
          />
          <p className="lives-number m-0 text-red-500 font-bold text-xl sm:text-2xl md:text-3xl ml-1">{lives}</p>
        </div>
      )}
      {showDiamonds && (
        <div className="diamonds-container flex items-center gap-2 text-white">
          <img
            src={diamond}
            className="diamond-icon w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
            alt="Points"
          />
          <p className="points-number m-0 font-bold text-xl sm:text-2xl md:text-3xl ml-1">{points}</p>
        </div>
      )}

      <style jsx>{`
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
        .lives-container, .diamonds-container { gap: 0px }
        .heart-icon, .diamond-icon { width: 1.5rem; height: auto; }
        .lives-number, .points-number { font-size: 1.3rem; margin-left: 0.25rem; }
        }

        @media (max-width: 768px) {
        .lives-container, .diamonds-container { gap: 0px }
        .heart-icon, .diamond-icon { width: 1.6rem; height: auto; }
        .lives-number, .points-number { font-size: 1.6rem; margin-left: 0.25rem; }
        } 
        /* Laptop breakpoint: 1024x668 and up */
        @media (min-width: 1024px) {
          .lives-container, .diamonds-container { gap: 0.5rem; }
          .heart-icon, .diamond-icon { width: 2rem; height: 2rem; }
          .lives-number, .points-number { font-size: 1.75rem; margin-left: 0.5rem; }
        }

        /* Laptop L: 1440x891 and up - slightly larger */
        @media (min-width: 1440px) {
          .lives-container, .diamonds-container { gap: 0.75rem; }
          .heart-icon, .diamond-icon { width: 3rem; height: 3rem; }
          .lives-number, .points-number { font-size: 2.25rem; margin-left: 0.5rem; }
        }

        /* 4K: 2560x1672 and up - scale up for large displays */
        @media (min-width: 2560px) {
          .lives-container, .diamonds-container { gap: 1rem; }
          .heart-icon, .diamond-icon { width: 4.5rem; height: 4.5rem; }
          .lives-number, .points-number { font-size: 3.5rem; margin-left: 0.75rem; }
        }
      `}</style>
    </>
  );
}

export default LivesandDiamonds;
