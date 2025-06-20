import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../../Components/Sidenav";
import LbComponent from "./LbComponent";
import "../../css/Leaderboard.css";

function Leaderboard() {
  return (
    <>
      <div className="leaderboard-container flex flex-col items-center justify-center my-4">
        <Sidenav />
        <div className="leaderboard-scroll-wrapper overflow-y-auto w-full max-h-screen p-4 mr-9">
          <LbComponent />
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
