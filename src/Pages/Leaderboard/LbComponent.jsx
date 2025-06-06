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
    <div className="ml-[27rem]">
      {/* Top position element */}
      <div className="absolute left-[29rem] top-[1.7rem]">
        {/* Add any lb-top content here if needed */}
      </div>

      <div className="leaderboard-header flex flex-row items-center justify-center">
        {/* Second Place */}
        <div className="second-place flex items-center gap-2">
          <img src={medal2} className="max-w-full h-auto" alt="medal img" />
          <div className="flex flex-col items-start">
            <div className="profile-second flex items-center gap-2">
              <img
                src={picFor(1, profile2)}
                className="max-w-full h-auto user-avatar w-[60px] h-[60px] rounded-full object-cover"
                alt="profile img"
              />
              <p className="text-white text-4xl font-['Baloo']">
                {sortedLeaderboard[1]?.name || "TBD"}
              </p>
            </div>
            <div className="dia-total-second flex items-center text-white">
              <img
                src={diamond}
                className="max-w-full h-auto mr-2"
                alt="diamond img"
              />
              <p className="text-3xl mt-2 ml-2 font-['Baloo']">
                {sortedLeaderboard[1]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* First Place */}
        <div className="first-place flex items-center gap-2 mb-[5rem]">
          <img
            src={medal1}
            className="max-w-full h-auto ml-5"
            alt="medal img"
          />
          <div className="flex flex-col items-start">
            <div className="profile-first flex items-center gap-2">
              <img
                src={picFor(0, profile1)}
                className="max-w-full h-auto user-avatar w-[60px] h-[60px] rounded-full object-cover"
                alt="profile img"
              />
              <p className="text-white text-4xl font-['Baloo']">
                {sortedLeaderboard[0]?.name || "TBD"}
              </p>
            </div>
            <div className="dia-total-first flex items-center text-white">
              <img
                src={diamond}
                className="max-w-full h-auto mr-2"
                alt="diamond img"
              />
              <p className="text-3xl mt-2 ml-2 font-['Baloo']">
                {sortedLeaderboard[0]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Third Place */}
        <div className="third-place flex items-center gap-2">
          <img src={medal3} className="max-w-full h-auto" alt="medal img" />
          <div className="flex flex-col items-start">
            <div className="profile-third flex items-center gap-2">
              <img
                src={picFor(2, profile3)}
                className="max-w-full h-auto user-avatar w-[60px] rounded-full object-cover"
                alt="profile img"
              />
              <p className="text-white text-4xl font-['Baloo']">
                {sortedLeaderboard[2]?.name || "TBD"}
              </p>
            </div>
            <div className="dia-total-third flex items-center text-white">
              <img
                src={diamond}
                className="max-w-full h-auto mr-2"
                alt="diamond img"
              />
              <p className="text-3xl mt-2 ml-2 font-['Baloo']">
                {sortedLeaderboard[2]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="user-points rounded-3xl flex text-center justify-between items-center pt-2 ml-7 font-['Baloo'] border-[5px] border-purple-950 h-[8vh] w-[70vw]">
        <span className="text-white text-3xl mr-auto ml-5">Users</span>
        <span className="text-white text-3xl">Grade Level</span>
        <span className="text-white text-3xl ml-auto mr-5">Points</span>
      </div>

      {/* User List */}
      <div className="lb-users mr-6 flex justify-start items-start font-['Baloo']">
        {sortedLeaderboard.length > 0 ? (
          <ul className="list-none mt-3 text-white font-bold">
            {sortedLeaderboard.map((user, index) => (
              <div
                className="user-rank text-[3rem] rounded-[20px] flex justify-between items-center whitespace-nowrap px-4 py-2 bg-[#271d3e] mb-[10px] gap-[51rem] w-[70vw] p-2"
                key={user._id || index}
              >
                {/* Column 1: Rank, Avatar, Name */}
                <div className="flex items-center min-w-[350px] gap-[3rem]">
                  <span className="number-label text-white w-[1.875rem] text-right">
                    {index + 1}.
                  </span>
                  <img
                    src={user.profilePic || profile3}
                    alt="profile"
                    className="user-avatar w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <span className="user-name text-white text-[2.5rem] font-['Baloo']">
                    {user.name || "No Name"}
                  </span>
                </div>

                {/* Column 2: Grade Level */}
                <div className="gradelevels text-center text-white text-[2.5rem] font-['Baloo'] -ml-[40rem]">
                  {user.yearLevel || "N/A"}
                </div>

                {/* Column 3: Points */}
                <div className="points-wrapper flex items-center justify-end -ml-[28rem] min-w-[9.375rem]">
                  <img
                    src={diamond}
                    alt="diamonds"
                    className="w-[3rem] h-[3rem] mr-8"
                  />
                  <span className="text-[2.5rem] mr-5 font-['Baloo'] text-white">
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
    </div>
  );
}

export default LbComponent;
