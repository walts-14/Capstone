import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import luffy from "../../assets/luffy.jpg";
import fire from "../../assets/fire.png";
import trophy from "../../assets/trophy.png";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import repeat from "../../assets/repeat logo.png";
import "../../css/Dashboard.css";
import Sidenav from "../../Components/Sidenav";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LessonButtons from "./LessonButtons.jsx";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [streak, setStreak] = React.useState(0);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn"); // Also clear logged-in state
    navigate("/login", { replace: true }); // Ensure redirection
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setUserName(userName);
  });

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("userEmail");

    if (!storedUserEmail) {
        console.error("❌ No email found in localStorage");
        return;
    }

    const fetchStreak = async () => {
      const storedUserEmail = localStorage.getItem("userEmail");
      console.log("📩 Email sent from Frontend:", storedUserEmail);  // ✅ Verify email
  
      if (!storedUserEmail) {
          console.error("❌ No email found in localStorage");
          return;
      }
  
      try {
          const response = await axios.post("/api/update-streak", {
              email: storedUserEmail
          });
  
          console.log("🔥 Streak Response Data:", response.data);
          if (response.data.streak !== undefined) {
              setStreak(response.data.streak); 
          } else {
              console.warn("⚠️ No streak data found in response");
          }
      } catch (error) {
          console.error("❌ Error fetching streak data:", error.response?.data || error.message);
      }
  };
  
    fetchStreak();
}, []);

  return (
    <>
      <Sidenav />

      <div className="player-info fw-bold">
        <div className="info-box d-flex align-items-center gap-3">
          <img
            src={fire}
            className="h-auto mt-3 ms-4 mb-3 img-fluid"
            alt="fire image"
          />
          <div className="textt-container">
            <p className="number">{streak}</p>
            <p className="mt-3">Daily streak</p>
          </div>
        </div>
        <div className="info-box d-flex align-items-center gap-1">
          <img
            src={check}
            className="h-auto mt-3 ms-2 mb-3 img-fluid"
            alt="check image"
          />
          <div className="textt-container">
            <p className="number">5</p>
            <p className="mt-3">Right anwers</p>
          </div>
        </div>
        <div className="info-box d-flex align-items-center gap-1">
          <img
            src={ekis}
            className="h-auto mt-3 ms-2 mb-3 img-fluid"
            alt="ekis image"
          />
          <div className="textt-container">
            <p className="number">5</p>
            <p className="mt-3  "> Wrong answers</p>
          </div>
        </div>
        <div className="info-box d-flex align-items-center gap-1">
          <img
            src={repeat}
            className="h-auto mt-4 ms-3 mb-3 img-fluid"
            alt="repeat image"
          />
          <div className="textt-container">
            <p className="number ms-3">5</p>
            <p className="mt-1 ms-3">Repeated items</p>
          </div>
        </div>
      </div>
      <div className="profile-pic">
        <img src={luffy} className="img-fluid" alt="profile" />
        <p className="fs-2">{userName}</p>
      </div>
      <div className="position-lb d-flex align-items-center gap-1">
        <img
          src={trophy}
          className="h-auto mt-4 ms-3 mb-3 img-fluid"
          alt="trophy image"
        />
        <p className="fs-1">#1</p>
        <p className="text-nowrap">{userName}</p>
      </div>
      <div className="btns">
        <button
          type="button"
          className="btn btn-secondary btn-lg fw-bold fs-3 rounded-5"
          onClick={logout}
        >
          Log out
        </button>
      </div>
      <LessonButtons />
    </>
  );
}

export default Dashboard;
