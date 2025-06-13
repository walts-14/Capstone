import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../../Components/Sidenav";
import LbComponent from "./LbComponent";
import "../../css/Leaderboard.css";
import medal1 from "../../assets/medal1.png";
import medal2 from "../../assets/medal2.png";
import medal3 from "../../assets/medal3.png";
import profile1 from "../../assets/profile1.png";
import profile2 from "../../assets/profile2.png";
import profile3 from "../../assets/profile3.png";
import diamond from "../../assets/diamond.png";

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
