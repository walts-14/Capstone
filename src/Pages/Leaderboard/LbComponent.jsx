// frontend/src/pages/leaderboard/LbComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";

import medal1 from "../../assets/medal1.png";
import medal2 from "../../assets/medal2.png";
import medal3 from "../../assets/medal3.png";

import profile1 from "../../assets/profile1.png";
import profile2 from "../../assets/profile2.png";
import profile3 from "../../assets/profile3.png";

import diamond from "../../assets/diamond.png";

function LbComponent() {
  const [leaderboard, setLeaderboard] = useState([]);
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leaderboard");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error.response?.data || error.message);
      }
    };
    fetchLeaderboard();
  }, []);

  // helper to pick profilePic or fallback
  const picFor = (idx, fallback) =>
    sortedLeaderboard[idx]?.profilePic || fallback;

  return (
    <>
      <div className="leaderboard-header d-flex flex-row align-items-center justify-content-center">
        {/* Second Place */}
       {/* Second Place */}
<div className="second-place d-flex align-items-center gap-2">
  <img src={medal2} className="img-fluid" alt="medal img" />
  <div className="d-flex flex-column align-items-start">
    <div className="profile-second d-flex align-items-center gap-2">
      <img
        src={picFor(1, profile2)}
        className="img-fluid user-avatar"
        alt="profile img"
      />
      <p className="text-white fs-1">
        {sortedLeaderboard[1]?.name || "TBD"}
      </p>
    </div>
    <div className="dia-total-second d-flex align-items-center text-white">
      <img src={diamond} className="img-fluid me-2" alt="diamond img" />
      <p className="fs-3 mt-2 ms-2">
        {sortedLeaderboard[1]?.points ?? 0}
      </p>
    </div>
  </div>
</div>

{/* First Place */}
<div
  className="first-place d-flex align-items-center gap-2"
  style={{ marginBottom: "5rem" }}
>
  <img src={medal1} className="img-fluid ms-5" alt="medal img" />
  <div className="d-flex flex-column align-items-start">
    <div className="profile-first d-flex align-items-center gap-2">
      <img
        src={picFor(0, profile1)}
        className="img-fluid user-avatar"
        alt="profile img"
      />
      <p className="text-white fs-1">
        {sortedLeaderboard[0]?.name || "TBD"}
      </p>
    </div>
    <div className="dia-total-first d-flex align-items-center text-white">
      <img src={diamond} className="img-fluid me-2" alt="diamond img" />
      <p className="fs-3 mt-2 ms-2">
        {sortedLeaderboard[0]?.points ?? 0}
      </p>
    </div>
  </div>
</div>

{/* Third Place */}
<div className="third-place d-flex align-items-center gap-2">
  <img src={medal3} className="img-fluid" alt="medal img" />
  <div className="d-flex flex-column align-items-start">
    <div className="profile-third d-flex align-items-center gap-2">
      <img
        src={picFor(2, profile3)}
        className="img-fluid user-avatar"
        alt="profile img"
      />
      <p className="text-white fs-1">
        {sortedLeaderboard[2]?.name || "TBD"}
      </p>
    </div>
    <div className="dia-total-third d-flex align-items-center text-white">
      <img src={diamond} className="img-fluid me-2" alt="diamond img" />
      <p className="fs-3 mt-2 ms-2">
        {sortedLeaderboard[2]?.points ?? 0}
      </p>
    </div>
  </div>
</div>

        </div>

      {/* Table Header */}
      <div className="user-points rounded-5 d-flex text-center justify-content-between align-items-center pt-2">
        <span className="text-white fs-2 me-auto ms-5">Users</span>
        <span className="text-white fs-2">Grade Level</span>
        <span className="text-white fs-2 ms-auto me-5">Points</span>
      </div>

      {/* User List */}
      <div className="lb-users">
        {sortedLeaderboard.length > 0 ? (
          <ul className="list-unstyled mt-3 text-white fw-bold">
            {sortedLeaderboard.map((user, index) => (
              <div
                className="user-rank fs-1 rounded-4 d-flex align-items-center text-nowrap px-4 py-2"
                key={user._id || index}
              >
                {/* Column 1: Rank, Avatar, Name */}
                <div
                  className="d-flex align-items-center"
                  style={{ minWidth: "300px", gap: "1rem" }}
                >
                  <span className="number-label text-white">
                    {index + 1}.
                  </span>
                  <img
                    src={user.profilePic || profile3}
                    alt="profile"
                    className="user-avatar img-fluid"
                  />
                  <span className="user-name text-white fs-2">
                    {user.name || "No Name"}
                  </span>
                </div>

                {/* Column 2: Grade Level */}
                <div className="gradelevels text-center text-white fs-2">
                  {user.yearLevel || "N/A"}
                </div>

                {/* Column 3: Points */}
                <div className="points-wrapper d-flex align-items-center justify-content-end">
                  <img src={diamond} alt="diamonds" className="me-4" />
                  <span className="fs-2 me-5">
                    {user.points > 0 ? user.points : 0}
                  </span>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-white text-center mt-3">
            No leaderboard data available.
          </p>
        )}
      </div>
    </>
  );
}

export default LbComponent;
