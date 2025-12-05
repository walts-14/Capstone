import React, { useEffect, useState, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidenav from "../../Components/Sidenav";
import "../../css/Settings.css";
import { useNavigate } from "react-router-dom";
import changepic from "../../assets/changepic.png";
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
        `/api/user?email=${email}`,
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
        "/api/upload-profile-pic",
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
      await axios.delete("/api/delete-profile-pic", {
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
    <>
      {/* <button
        onClick={() => setShowModal(true)}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        Maintenance
      </button> */}

      {/* modal only renders when showModal===true */}
      <MaintenanceModal show={showModal} onClose={() => setShowModal(false)} />

      <Sidenav />
      
      <div className="settings-container rounded-4">
        {/* ——— STUDENT INFO (no design changes) ——— */}
             {/* ——— PROFILE PICTURE (with loading states) ——— */}
        <div className="profile-picture-wrapper position-relative m-4">
          <div className="profile-pic-container">
            <img
              src={profilePic}
              className="img-fluid"
              alt="profile picture"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                width: "250px",
                height: "250px",
                aspectRatio: "1/1",
                backgroundColor: "#222",
              }}
            />

            {/* Loading overlay for upload */}
            {isUploadingPic && (
              <div
                className="position-absolute top-0 start-0 d-flex justify-content-center align-items-center"
                style={{
                  width: "180px",
                  height: "180px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  zIndex: 2,
                }}
              >
                <div className="text-center text-white">
                  <div className="spinner-border text-light mb-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="fw-bold">Uploading...</div>
                </div>
              </div>
            )}

            {/* Loading overlay for delete */}
            {isDeletingPic && (
              <div
                className="position-absolute top-0 start-0 d-flex justify-content-center align-items-center"
                style={{
                  width: "180px",
                  height: "180px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  zIndex: 2,
                  left: "50rem",
                }}
              >
                <div className="text-center text-white">
                  <div className="spinner-border text-light mb-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="fw-bold">Deleting...</div>
                </div>
              </div>
            )}

            {/* Camera overlay icon */}
            <div
              className="camera-overlay d-flex justify-content-center align-items-center position-absolute top-0 start-0"
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <i className="fas fa-camera fa-2x text-white"></i>
            </div>
          </div>

          <div className="profile-btn mt-4">
              <label
                htmlFor="file-upload"
                className="change-pic text-white rounded-4 text-center text-nowrap"
                style={{
                  cursor:
                    isUploadingPic || isDeletingPic ? "not-allowed" : "pointer",
                  opacity: isUploadingPic || isDeletingPic ? 0.6 : 1,
                  pointerEvents: isUploadingPic || isDeletingPic ? "none" : "auto",
                  width: "auto",
                }}
              >
                Change Profile
              </label>

              <button
                className={`delete-btn btn-secondary rounded-4  text-nowrap text-white ${
                  isUploadingPic || isDeletingPic ? "disabled" : ""
                }`}
                onClick={handleDeleteProfilePicture}
                disabled={isUploadingPic || isDeletingPic}
                style={{
                  opacity: isUploadingPic || isDeletingPic ? 0.6 : 1,
                  width: "auto",
                
                }}
              >
                {isDeletingPic ? "Deleting..." : "Delete Picture"}
              </button>

          </div>
          
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploadingPic || isDeletingPic}
            style={{ display: "none" }}
            key={isUploadingPic ? "uploading" : "ready"}
          />
        </div>

        <div className="students-information">
          <div>
            <span className="name-stud text-white">Name</span>
            <div className="student-details rounded-4">
              <p className=" text-left">{userName}</p>
            </div>
          </div>

           <div>
            <span className="username-stud text-white">Username</span>
            <div className="username-stud-view rounded-4">
              <p className=" text-left">{userUsername}</p>
            </div>    
          </div>

           <div>
            <span className="email-stud text-white">Email</span>
            <div className="email-stud-view rounded-4">
              <p className=" text-left">{userEmail}</p>
            </div>
          </div>
          


             {/* ——— LOGOUT BUTTON ——— */}
          <div className="btn-logout-wrapper text-center mt-4">
            <button
              type="button"
              className="btn btn-secondary rounded-5"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>

   

     
      </div>
    </>
  );
}

export default Settings;
