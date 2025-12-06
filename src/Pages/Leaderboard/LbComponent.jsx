import React, { useEffect, useState, useMemo } from "react";
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
  // Memoize the sorted leaderboard to avoid re-sorting on every render.
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => b.points - a.points);
  }, [leaderboard]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "/api/leaderboard"
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

  // Separate row component to avoid re-rendering list rows unnecessarily.
  const LeaderboardRow = React.memo(function LeaderboardRow({ user, index }) {
    return (
      <div
        className="user-rank text-4xl rounded-2xl flex items-center whitespace-nowrap px-4 py-2"
        key={user._id || index}
      >
        {/* Column 1: Rank, Avatar, Name */}
        <div
          className="flex items-center"
          style={{ minWidth: "300px", gap: "2rem" }}
        >
          <span className="number-label text-white">{index + 1}.</span>
          <img src={user.profilePic || profile3} alt="profile" className="user-avatar" />
          <span className="user-name text-white text-2xl">{user.name || "No Name"}</span>
        </div>

        {/* Column 2: Grade Level */}
        <div className="gradelevels text-center text-white text-2xl">{user.yearLevel || "N/A"}</div>

        {/* Column 3: Points */}
        <div className="points-wrapper flex items-center justify-end">
          <img src={diamond} alt="diamonds" className="mr-4" />
          <span className="text-2xl mr-5">{user.points > 0 ? user.points : 0}</span>
        </div>
      </div>
    );
  });

  return (
    <> 
     <div className="top-three-container">
        {/* First Place */}
        {sortedLeaderboard[0] && (
          <div className="podium-position podium-first">
            <img src={medal1} className="medal-image" alt="1st place" />
             <div>
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
           
          </div>
        )}

        {/* Second Place */}
        {sortedLeaderboard[1] && (
          <div className="podium-position podium-second">
            <img src={medal2} className="medal-image" alt="2nd place" />
            <div>
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
           
          </div>
        )}

        {/* Third Place */}
        {sortedLeaderboard[2] && (
          <div className="podium-position podium-third">
            <img src={medal3} className="medal-image" alt="3rd place" />
             <div>
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
           
          </div>
        )}
      </div>
      <div className="leaderboard-header">
        <span className="header-text">User</span>
        <span className="header-text">Points</span>
      </div>
      <div className="leaderboard-content">
 
            <div className="w-full">
              {/* Top 3 Podium */}
            

              {/* Table Header */}
             

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
       
      </div>
     
    </>
    
  );
}

export default LbComponent;
