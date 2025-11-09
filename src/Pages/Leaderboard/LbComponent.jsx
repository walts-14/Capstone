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

  // helper to pick profilePic or fallback
  const picFor = (idx, fallback) =>
    sortedLeaderboard[idx]?.profilePic || fallback;

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        {/* Second Place */}
        <div className="flex items-center gap-2">
          <img src={medal2} className="max-w-full h-auto" alt="medal img" />
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <img
                src={picFor(1, profile2)}
                className="w-20 h-20 user-avatar"
                alt="profile img"
              />
              <p className="text-gray-500 text-4xl">
                {sortedLeaderboard[1]?.name || "TBD"}
              </p>
            </div>
            <div className="flex items-center text-gray-500">
              <img
                src={diamond}
                className="max-w-full h-auto mr-2"
                alt="diamond img"
              />
              <p className="text-2xl mt-2 ml-2">
                {sortedLeaderboard[1]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* First Place */}
        <div
          className="flex items-center gap-2 ml-5"
          style={{ marginBottom: "5rem" }}
        >
          <img src={medal1} className="max-w-full h-auto" alt="medal img" />
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <img
                src={picFor(0, profile1)}
                className="w-20 h-20 user-avatar"
                alt="profile img"
              />
              <p className="text-gray-500 text-4xl">
                {sortedLeaderboard[0]?.name || "TBD"}
              </p>
            </div>
            <div className="flex items-center text-gray-500">
              <img
                src={diamond}
                className="max-w-full h-auto mr-2"
                alt="diamond img"
              />
              <p className="text-2xl mt-2 ml-2">
                {sortedLeaderboard[0]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Third Place */}
        <div className="flex items-center gap-2">
          <img src={medal3} className="max-w-full h-auto" alt="medal img" />
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <img
                src={picFor(2, profile3)}
                className="w-20 h-20 user-avatar"
                alt="profile img"
              />
              <p className="text-gray-500 text-4xl">
                {sortedLeaderboard[2]?.name || "TBD"}
              </p>
            </div>
            <div className="flex items-center text-gray-500">
              <img
                src={diamond}
                className="max-w-full h-auto mr-2"
                alt="diamond img"
              />
              <p className="text-2xl mt-2 ml-2">
                {sortedLeaderboard[2]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="user-points rounded-3xl flex text-center justify-between items-center pt-2 ml-8  sm:w-[90%] pl-3 text-sm  md:w-[80%] lg:w-[70%] xl:w-[60%]">
        <span className="text-gray-500 text-2xl mr-auto ml-5">Users</span>
        <span className="text-gray-500 text-2xl">Grade Level</span>
        <span className="text-gray-500 text-2xl ml-auto mr-5">Points</span>
      </div>

      {/* User List */}
      <div className="lb-users">
        {sortedLeaderboard.length > 0 ? (
          <ul className="list-none mt-3 text-white font-bold">
            {sortedLeaderboard.map((user, index) => (
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
                  <img
                    src={user.profilePic || profile3}
                    alt="profile"
                    className="user-avatar h-20 w-20"
                  />
                  <span className="user-name text-white text-2xl">
                    {user.name || "No Name"}
                  </span>
                </div>

                {/* Column 2: Grade Level */}
                <div className="gradelevels text-center text-white text-2xl">
                  {user.yearLevel || "N/A"}
                </div>

                {/* Column 3: Points */}
                <div className="points-wrapper flex items-center justify-end">
                  <img src={diamond} alt="diamonds" className="mr-4" />
                  <span className="text-2xl mr-5">
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
