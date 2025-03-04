import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import luffy from "../../assets/luffy.jpg";
import "../../css/Dashboard.css";
import Sidenav from "../../Components/Sidenav";
import { useNavigate } from "react-router-dom";
import LessonButtons from "./LessonButtons.jsx";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn"); // Also clear logged-in state
    navigate("/login", { replace: true }); // Ensure redirection
  };

  return (
    <>
      <Sidenav />

      <div className="player-info fw-bold">
        <div className="info-box">
          <p>Daily streak</p>
        </div>
        <div className="info-box">
          <p>Right anwers</p>
        </div>
        <div className="info-box">
          <p> Wrong answers</p>
        </div>
        <div className="info-box">
          <p>Repeated items</p>
        </div>
      </div>
      <div className="profile-pic">
        <img src={luffy} className="img-fluid" alt="profile" />
        <p className="fs-1">Monkey D. Luffy</p>
      </div>
      <div className="position-lb">
        <p className="fs-2 fw-bold"> Monkey D. Luffy</p>
      </div>
      <div className="btns">
        <button
          type="button"
          className="btn btn-primary btn-lg fw-bold fs-3 rounded-5"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg fw-bold fs-3 rounded-5"
          onClick={(logout)}
        >
          Log out
        </button>
      </div>
      <LessonButtons />
    </>
  );
}

export default Dashboard;
