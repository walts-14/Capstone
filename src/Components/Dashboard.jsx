import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import luffy from "../assets/luffy.jpg";
import "../css/Dashboard.css";
import Lesson from "./Lesson";

function Dashboard() {
  return (
    <>
      <div className="logo fw-bold">
        <p>We Sign</p>
      </div>
      <div className="navbar-bg d-block p-5">
        <nav className="sideNav d-flex flex-column fs-2 ">
          <div className="dashboard">
            <a className="nav-link mb-5" aria-current="page" href="#">
              Dashboard
            </a>
          </div>
          <div className="library mt-4 p-2 pt-4">
            <a className="nav-link mb-5" href="#">
              Library
            </a>
          </div>
          <div className="leaderboard mt-4">
            <a className="nav-link mb-5" href="#">
              Leaderboard
            </a>
          </div>
          <div className="settings mt-4">
            <a className="nav-link mb-5" href="#">
              Settings
            </a>
          </div>
        </nav>
      </div>
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
        <button type="button" className="btn btn-primary btn-lg fw-bold fs-3">
          Sign up
        </button>
        <button type="button" className="btn btn-secondary btn-lg fw-bold fs-3">
          Log out
        </button>
      </div>
      <Lesson />
    </>
  );
}

export default Dashboard;
