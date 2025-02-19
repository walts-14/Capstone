import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import luffy from "../../assets/luffy.jpg";
import "../../css/Dashboard.css";
import Sidenav from "../../Components/Sidenav";
import Lesson from "./Lesson";
import Library from "../Library/Library";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
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
          onClick={() => navigate("/login")}
        >
          Log out
        </button>
      </div>
      
      <div className="basic-lessons">
        <Lesson
          buttonColors={["#174360", "#174360", "#174360", "#174360", "#174360"]}
          shadowStyle="0 7px 0 #205d87"
        />
      </div>
      <div className="intermediate-lessons">
        <Lesson
          buttonColors={["#DCBC3D", "#DCBC3D", "#DCBC3D", "#DCBC3D", "#DCBC3D"]}
          shadowStyle="0 7px 0 #A9890A"
        />
      </div>

      <div className="advanced-lessons">
        <Lesson
          buttonColors={["#CC6055", "#CC6055", "#CC6055", "#CC6055", "#CC6055"]}
          shadowStyle="0 7px 0 #992D22"
        />
      </div>
    </>
  );
}

export default Dashboard;
