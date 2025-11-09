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
  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => b.points - a.points
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/leaderboard"
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error(
          "❌ Error fetching leaderboard:",
          error.response?.data || error.message
        );
      }
    };
    fetchLeaderboard();
  }, []);

  const picFor = (idx, fallback) =>
    sortedLeaderboard[idx]?.profilePic || fallback;

  return (
    <div className="w-full">
      {/* Top 3 Podium */}
      <div className="top-three-container">
        {/* First Place */}
        {sortedLeaderboard[0] && (
          <div className="podium-position podium-first">
            <img src={medal1} className="medal-image" alt="1st place" />
            <img
              src={picFor(0, profile1)}
              className="podium-avatar"
              alt="profile"
            />
            <p className="podium-name">{sortedLeaderboard[0].name}</p>
            <div className="podium-points">
              <img src={diamond} className="diamond-icon" alt="diamond" />
              <span>{sortedLeaderboard[0].points}</span>
            </div>
          </div>
        )}

        {/* Second Place */}
        {sortedLeaderboard[1] && (
          <div className="podium-position podium-second">
            <img src={medal2} className="medal-image" alt="2nd place" />
            <img
              src={picFor(1, profile2)}
              className="podium-avatar"
              alt="profile"
            />
            <p className="podium-name">{sortedLeaderboard[1].name}</p>
            <div className="podium-points">
              <img src={diamond} className="diamond-icon" alt="diamond" />
              <span>{sortedLeaderboard[1].points}</span>
            </div>
          </div>
        )}

        {/* Third Place */}
        {sortedLeaderboard[2] && (
          <div className="podium-position podium-third">
            <img src={medal3} className="medal-image" alt="3rd place" />
            <img
              src={picFor(2, profile3)}
              className="podium-avatar"
              alt="profile"
            />
            <p className="podium-name">{sortedLeaderboard[2].name}</p>
            <div className="podium-points">
              <img src={diamond} className="diamond-icon" alt="diamond" />
              <span>{sortedLeaderboard[2].points}</span>
            </div>
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="leaderboard-header">
        <span className="header-text">User</span>
        <span className="header-text">Points</span>
      </div>

      {/* User List */}
      <div className="user-list">
        {sortedLeaderboard.length > 0 ? (
          sortedLeaderboard.map((user, index) => (
            <div className="user-rank" key={user._id || index}>
              <div className="user-info">
                <span className="rank-number">{index + 1}.</span>
                <img
                  src={user.profilePic || profile3}
                  alt="profile"
                  className="user-avatar"
                />
                <span className="user-name">{user.name || "No Name"}</span>
              </div>
              <div className="user-points-container">
                <img src={diamond} alt="diamond" className="diamond-icon" />
                <span className="points-text">
                  {user.points > 0 ? user.points : 0}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center mt-3">
            No leaderboard data available.
          </p>
        )}
      </div>
    </div>
  );
}

export default LbComponent;
