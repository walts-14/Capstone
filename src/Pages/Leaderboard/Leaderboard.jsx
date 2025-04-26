import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../../Components/Sidenav";
import "../../css/Leaderboard.css";
import medal1 from "../../assets/medal1.png";
import medal2 from "../../assets/medal2.png";
import medal3 from "../../assets/medal3.png";
import profile1 from "../../assets/profile1.png";
import profile2 from "../../assets/profile2.png";
import profile3 from "../../assets/profile3.png";
import diamond from "../../assets/diamond.png";

function Leaderboard() {
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
        console.log("✅ Leaderboard Data:", response.data);
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

  console.log("Leaderboard state:", leaderboard);

  return (
    <>
      <div className="leaderboard-container d-flex flex-column align-items-center justify-content-center my-4">
        <Sidenav />

        <div className="leaderboard-header d-flex flex-row align-items-center justify-content-center">
          {/* Second Place */}
          <div className="second-place d-flex align-items-center gap-2">
            <img src={medal2} className="img-fluid" alt="medal img" />
            <div className="d-flex flex-column align-items-start">
              <div className="profile-second d-flex align-items-center gap-2">
                <img src={profile2} className="img-fluid" alt="profile img" />
                <p className="text-white fs-1">
                  {sortedLeaderboard[1]?.name || "TBD"}
                </p>
              </div>
              <div className="dia-total-second d-flex align-items-center text-white">
                <img
                  src={diamond}
                  className="img-fluid me-2"
                  alt="diamond img"
                />
                <p className="fs-3 mt-2 ms-2">
                  {sortedLeaderboard[1]?.points || 0}
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
                <img src={profile1} className="img-fluid" alt="profile img" />
                <p className="text-white fs-1">
                  {sortedLeaderboard[0]?.name || "TBD"}
                </p>
              </div>
              <div className="dia-total-first d-flex align-items-center text-white">
                <img
                  src={diamond}
                  className="img-fluid me-2"
                  alt="diamond img"
                />
                <p className="fs-3 mt-2 ms-2">
                  {sortedLeaderboard[0]?.points || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Third Place */}
          <div className="third-place d-flex align-items-center gap-2">
            <img src={medal3} className="img-fluid" alt="medal img" />
            <div className="d-flex flex-column align-items-start">
              <div className="profile-third d-flex align-items-center gap-2">
                <img src={profile3} className="img-fluid" alt="profile img" />
                <p className="text-white fs-1">
                  {sortedLeaderboard[2]?.name || "TBD"}
                </p>
              </div>
              <div className="dia-total-third d-flex align-items-center text-white">
                <img
                  src={diamond}
                  className="img-fluid me-2"
                  alt="diamond img"
                />
                <p className="fs-3 mt-2 ms-2">
                  {sortedLeaderboard[2]?.points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="user-points rounded-5 d-flex text-center justify-content-center pt-3">
          <span className="text-white fs-2 me-auto ms-5">Users</span>
          <span className="text-white fs-2 me-5">Points</span>
        </div>

        <div className="lb-users">
          {leaderboard && leaderboard.length > 0 ? (
            <ul className="list-unstyled mt-3 text-white fw-bold">
              {sortedLeaderboard.map((user, index) => (
                <div
                  className="user-rank fs-1 rounded-4 d-flex align-items-center justify-content-between"
                  key={user._id || index}
                >
                  <div className="d-flex align-items-center gap-5">
                    <span className="number-label text-white">
                      {index + 1}.
                    </span>
                    <img
                      src={user.profilePic || profile3}
                      alt="profile"
                      className="user-avatar"
                    />
                    <span className="user-name">{user.name || "No Name"}</span>
                  </div>

                  <div className="points-wrapper">
                    <div className="points-display d-flex align-items-center justify-content-end">
                      <img src={diamond} alt="diamonds" className="me-3" />
                      <span>{user.points > 0 ? user.points : 0}</span>
                    </div>
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
    </>
  );
}

export default Leaderboard;
