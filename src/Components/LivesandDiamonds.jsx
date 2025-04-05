import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import heart from "../assets/heart.png";
import diamond from "../assets/diamond.png";
import "../css/Lesson.css";

function LivesandDiamonds() {
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
      <div className="d-flex align-items-center gap-1">
        <img src={heart} className="heart-logo img-fluid" alt="lives logo" />
        <p className="heart-num m-0 text-danger fw-bold">{lives}</p>
      </div>
      <div className="d-flex align-items-center gap-1">
        <img src={diamond} className="dia-logo img-fluid" alt="diamond logo" />
        <p className="dia-num m-0 fw-bold">{points}</p>
      </div>
    </>
  );
}
export default LivesandDiamonds;
