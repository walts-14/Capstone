import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import heart from "../assets/heart.png";
import diamond from "../assets/diamond.png";

function LivesandDiamonds({ showDiamonds = true }) {
  const [lives, setLives] = useState(5);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage.");
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/lives/email/${userEmail}`
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
        const response = await axios.get(
          `http://localhost:5000/api/points/email/${userEmail}`
        );
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPoints();
    const pointsInterval = setInterval(fetchPoints, 5000);
    return () => clearInterval(pointsInterval);
  }, []);

  return (
    <>
      <div className="flex items-center gap-1">
        <img
          src={heart}
          className="w-12 h-12 object-contain"
          alt="lives logo"
        />
        <p className="m-0 text-red-500 font-bold text-3xl ml-1">{lives}</p>
      </div>
      {showDiamonds && (
        <div className="flex items-center gap-1 text-white">
          <img
            src={diamond}
            className="w-12 h-12 object-contain"
            alt="Points"
          />
          <p className="m-0 font-bold text-3xl ml-1">{points}</p>
        </div>
      )}
    </>
  );
}

export default LivesandDiamonds;
