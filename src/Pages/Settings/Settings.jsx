import React, { useEffect, useState, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidenav from "../../Components/Sidenav";
import "../../css/Settings.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MaintenanceModal from "../../Components/Maintenance/MaintenanceModal.jsx";
import { ProgressContext } from "../Dashboard/ProgressContext.jsx";

function Settings() {
  const navigate = useNavigate();
  const { setCurrentUserEmail, setCurrentUserName, setCurrentUserUsername } =
    useContext(ProgressContext);

  const DEFAULT_PROFILE_PIC =
    "https://res.cloudinary.com/deohrrkw9/image/upload/v1745911019/changepic_qrpmur.png";

  // — state for the three fields matching LoginForm's keys
  const [userName, setUserName] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // — state for profile pic as before
  const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);

  // — loading states for profile picture operations
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [isDeletingPic, setIsDeletingPic] = useState(false);

  // pull everything straight from localStorage once
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
      const { data } = await axios.get(
        `http://localhost:5000/api/user?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const d = data.data;
      setUserName(d.name);
      setUserUsername(d.username);
      setUserEmail(d.email);

      localStorage.setItem("userName", d.name);
      localStorage.setItem("userUsername", d.username);
      localStorage.setItem("userEmail", d.email);

      const pic = d.profilePic || DEFAULT_PROFILE_PIC;
      setProfilePic(pic);
      localStorage.setItem("profilePic", pic);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setProfilePic(DEFAULT_PROFILE_PIC);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // change pic preview + localStorage
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingPic(true);

    // Show preview immediately for better UX
    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);

    // build form-data
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);

      // res.data.profilePic = { url, public_id }
      const url = res.data.profilePic.url;
      setProfilePic(url + "?t=" + new Date().getTime()); // Add timestamp to prevent caching
      localStorage.setItem("profilePic", url);

      // Reset file input
      event.target.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      // Revert to previous image on error
      const previousPic =
        localStorage.getItem("profilePic") || DEFAULT_PROFILE_PIC;
      setProfilePic(previousPic);
      URL.revokeObjectURL(previewUrl);
    } finally {
      setIsUploadingPic(false);
    }
  };

  // delete pic → reset to default (and localStorage)
  const handleDeleteProfilePicture = async () => {
    setIsDeletingPic(true);

    try {
      const token = localStorage.getItem("token");
      // 2) correct endpoint
      await axios.delete("http://localhost:5000/api/delete-profile-pic", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 3) re-fetch to pick up default from server
      await fetchUserData();
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    } finally {
      setIsDeletingPic(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userEmail");
    setCurrentUserName("");
    setCurrentUserUsername("");
    setCurrentUserEmail("");
    navigate("/login", { replace: true });
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="settings-main-wrapper">
      <Sidenav />
      <div className="settings-container">
        <button className="maintenance-btn" onClick={() => setShowModal(true)}>
          Maintenance
        </button>
        <MaintenanceModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
        <div className="settings-grid">
          {/* --- PROFILE COLUMN --- */}
          <div className="settings-profile">
            <div className="profile-picture-wrapper">
              <img src={profilePic} alt="profile" className="profile-img" />
              {isUploadingPic && (
                <div className="camera-overlay">
                  <div className="loading-text">
                    <span className="loader"></span>
                    <span>Uploading...</span>
                  </div>
                </div>
              )}
              {isDeletingPic && (
                <div className="camera-overlay">
                  <div className="loading-text">
                    <span className="loader"></span>
                    <span>Deleting...</span>
                  </div>
                </div>
              )}
              <div className="camera-overlay camera-icon-overlay">
                <i className="fas fa-camera"></i>
              </div>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploadingPic || isDeletingPic}
                className="file-input"
                key={isUploadingPic ? "uploading" : "ready"}
              />
            </div>
            <div className="profile-actions">
              <label
                htmlFor="file-upload"
                className="change-pic"
                style={{
                  cursor:
                    isUploadingPic || isDeletingPic ? "not-allowed" : "pointer",
                  opacity: isUploadingPic || isDeletingPic ? 0.6 : 1,
                  pointerEvents:
                    isUploadingPic || isDeletingPic ? "none" : "auto",
                }}
              >
                Change Profile
              </label>
              <button
                className={`deletee ${
                  isUploadingPic || isDeletingPic ? "disabled" : ""
                }`}
                onClick={handleDeleteProfilePicture}
                disabled={isUploadingPic || isDeletingPic}
                style={{
                  opacity: isUploadingPic || isDeletingPic ? 0.6 : 1,
                }}
              >
                {isDeletingPic ? "Deleting..." : "Delete Profile"}
              </button>
            </div>
          </div>
          {/* --- INFO COLUMN --- */}
          <div className="settings-info">
            <div className="students-information">
              <span className="name-stud">Name</span>
              <div className="student-details">
                <p className="text-left">{userName}</p>
              </div>
              <span className="username-stud">Username</span>
              <div className="username-stud-view">
                <p className="text-left">{userUsername}</p>
              </div>
              <span className="email-stud">Email</span>
              <div className="email-stud-view">
                <p className="text-left">{userEmail}</p>
              </div>
            </div>
            <div className="btns">
              <button type="button" className="btn-logout" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
