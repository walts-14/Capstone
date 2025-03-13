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
  return (
    <>
      <Sidenav />
      <div className="lb-top d-flex justify-content-center align-items-end gap-5">
        {/* Second Place */}
        <div className="second-place d-flex align-items-center gap-2">
          <img src={medal2} className="img-fluid" alt="medal img" />
          <div className="d-flex flex-column align-items-start">
            <div className="profile-second d-flex align-items-center gap-2">
              <img src={profile2} className="img-fluid" alt="profile img" />
              <p className="text-white fs-1">Anna Belle</p>
            </div>
            <div className="dia-total-second d-flex align-items-center text-white">
              <img src={diamond} className="img-fluid me-2" alt="diamond img" />
              <p className="fs-3 mt-2 ms-2">20</p>
            </div>
          </div>
        </div>

        {/* First Place - Adjusted Higher */}
        <div
          className="first-place d-flex align-items-center gap-2"
          style={{ marginBottom: "5rem" }}
        >
          <img src={medal1} className="img-fluid ms-5" alt="medal img" />
          <div className="d-flex flex-column align-items-start">
            <div className="profile-first d-flex align-items-center gap-2">
              <img src={profile1} className="img-fluid" alt="profile img" />
              <p className="text-white fs-1">Albert Einstein</p>
            </div>
            <div className="dia-total-first d-flex align-items-center text-white">
              <img src={diamond} className="img-fluid me-2" alt="diamond img" />
              <p className="fs-3 mt-2 ms-2">100</p>
            </div>
          </div>
        </div>

        {/* Third Place */}
        <div className="third-place d-flex align-items-center gap-2">
          <img src={medal3} className="img-fluid" alt="medal img" />
          <div className="d-flex flex-column align-items-start">
            <div className="profile-third d-flex align-items-center gap-2">
              <img src={profile3} className="img-fluid" alt="profile img" />
              <p className="text-white fs-1">Steph Curry</p>
            </div>
            <div className="dia-total-third d-flex align-items-center text-white">
              <img src={diamond} className="img-fluid me-2" alt="diamond img" />
              <p className="fs-3 mt-2 ms-2">10</p>
            </div>
          </div>
        </div>
      </div>
      <div className="user-points rounded-5 d-flex text-center justify-content-center pt-3">
        <span className="text-white fs-3 me-auto ms-5"> Users</span>
        <span className="text-white fs-3 me-5"> Points</span>
      </div>
      <div className="lb-users"></div>
    </>
  );
}
export default Leaderboard;
