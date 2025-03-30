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
        <div className="lessonTracker d-flex flex-column text-white rounded-4 p-3">
          <div className="basicTracker rounded-4 m-2 mb-4">
            <div className="basicTitle fs-1 text-center mb-3">Basic</div>
            <div className="basic1tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 1 <span>50%</span>
            </div>
            <div className="basic2tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 2 <span>0%</span>
            </div>
            <div className="basic3tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 3 <span>0%</span>
            </div>
            <div className="basic4tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 4 <span>0%</span>
            </div>
            <div className="basic5tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 5 <span>0%</span>
            </div>
          </div>
          <div className="intermediateTracker rounded-4 m-2 mb-4">
            <div className="interTitle text-center mb-3">Intermediate</div>
            <div className="inter1tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 1 <span>50%</span>
            </div>
            <div className="inter2tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 2 <span>20%</span>
            </div>
            <div className="inter3tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 3 <span>0%</span>
            </div>
            <div className="inter4tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 4 <span>0%</span>
            </div>
            <div className="inter5tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 5 <span>0%</span>
            </div>
          </div>
          <div className="advancedTracker rounded-4 m-2 mb-4">
            <div className="advancedTitle  text-center mb-3">Advanced</div>
            <div className="advanced1tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 1 <span>30%</span>
            </div>
            <div className="advanced2tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 2 <span>10%</span>
            </div>
            <div className="advanced3tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 3 <span>0%</span>
            </div>
            <div className="advanced4tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 4 <span>0%</span>
            </div>
            <div className="advanced5tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
              Lesson 5 <span>0%</span>
            </div>
          </div>
        </div>
      </div>

      <LessonButtons />
    </>
  );
}

export default Dashboard;
