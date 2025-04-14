import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidenav from "../../Components/Sidenav";
import "../../css/Settings.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import changepic from "../../assets/changepic.png";

function Settings() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [profilePic, setProfilePic] = React.useState(changepic);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const savedPic = localStorage.getItem("profilePic");
    if (userName) setUserName(userName);
    if (savedPic) setProfilePic(savedPic);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setProfilePic(base64);
        localStorage.setItem("profilePic", base64); // Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Sidenav />
      <div className="settings-container rounded-4 position-absolute">
        <div className="profile-picture-wrapper position-relative m-5">
          <img src={profilePic} className="img-fluid" alt="profile picture" />
          <label
            htmlFor="file-upload"
            className="change-pic text-white fw-bold fs-1 rounded-4 p-2 text-center m-5 text-nowrap position-absolute"
            style={{ cursor: "pointer" }}
          >
            Change Profile
          </label>
          <div className="camera-overlay d-flex justify-content-center align-items-center">
            <i className="fas fa-camera fa-2x text-white"></i>
          </div>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="students-information">
          <span className="name-stud text-white fw-bold position-absolute">
            Name
          </span>
          <div className="student-details rounded-4 position-relative p-1 pt-3 ps-4 text-left">
            <p className="text-white text-left">Albert Einstein</p>
          </div>
          <span className="username-stud text-white fw-bold position-absolute">
            Username
          </span>
          <div className="username-stud-view rounded-4 position-relative p-1 pt-3 ps-4 text-left">
            <p className="text-white text-left">Albert</p>
          </div>
          <span className="email-stud text-white fw-bold position-absolute">
            Email
          </span>
          <div className="email-stud-view rounded-4 position-relative p-1 pt-3 ps-4 text-left">
            <p className="text-white text-left">albert@example.com</p>
          </div>
        </div>

        <div className="btns">
          <button
            type="button"
            className="btn btn-secondary btn-lg fw-bold fs-3 rounded-5 position-absolute"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default Settings;
