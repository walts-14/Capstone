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
import ProgressTracker from "./ProgressTracker.jsx"; // Import ProgressTracker component

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
      console.log("📩 Email sent from Frontend:", storedUserEmail); // ✅ Verify email

      if (!storedUserEmail) {
        console.error("❌ No email found in localStorage");
        return;
      }

      try {
        const response = await axios.post("/api/update-streak", {
          email: storedUserEmail,
        });

        console.log("🔥 Streak Response Data:", response.data);
        if (response.data.streak !== undefined) {
          setStreak(response.data.streak);
        } else {
          console.warn("⚠️ No streak data found in response");
        }
      } catch (error) {
        console.error(
          "❌ Error fetching streak data:",
          error.response?.data || error.message
        );
      }
    };

    fetchStreak();
  }, []);

  return (
    <>
      <Sidenav />
      <div className="tracker">
        <div className="position-lb d-flex align-items-center gap-1">
          <img
            src={trophy}
            className="h-auto mt-4 ms-3 mb-3 pl-5 img-fluid"
            alt="trophy image"
          />
          <p className="fs-1 text-center ms-4 ">#1</p>
          <p className="text-nowrap fs-2">{userName}</p>
        </div>
        <ProgressTracker />
      </div>

      <LessonButtons />
    </>
  );
}

export default Dashboard;
