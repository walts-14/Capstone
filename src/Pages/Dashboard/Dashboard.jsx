import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import trophy from "../../assets/trophy.png";
import "../../css/Dashboard.css";
import fire from "../../assets/fire.png";
import Sidenav from "../../Components/Sidenav";
import LessonButtons from "./LessonButtons.jsx";
import ProgressTracker from "./ProgressTracker.jsx"; // Import ProgressTracker component

function Dashboard() {
  const [userName, setUserName] = React.useState("");

  return (
    <>
      <Sidenav />
      <div className="tracker">
        <div className="streak d-flex rounded-4">
          <img src={fire} className="img-fluid p-2" alt="fire.png" />
          <div className="streak-num">
            <p className="fs-1 text-white pt-2 text-center"> 2</p>
            <p className="day-streak text-center">Day Streak</p>
          </div>
        </div>
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
