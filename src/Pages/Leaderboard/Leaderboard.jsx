import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../../Components/Sidenav";
import LbComponent from "./LbComponent";
import "../../css/Leaderboard.css";

function Leaderboard() {
  return (
    <>
      <div className="leaderboard-container">
        <Sidenav />
        <div className="leaderboard-content1">
          <div className="leaderboard-wrapper">
            <LbComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
