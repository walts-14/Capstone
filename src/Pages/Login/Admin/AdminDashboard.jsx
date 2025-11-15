// Placeholder function to prevent ReferenceError
const fetchNotifications = async () => {
  // TODO: Implement actual notification fetch logic
  // Example: const res = await axios.get('/api/notifications');
  // For now, do nothing
};
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus, FaBell } from "react-icons/fa";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/Admin.css";
import "../../../css/ProgressModal.css";
import axios from "../../api.js";
import toast from "react-hot-toast";
import LbComponent from "../../Leaderboard/LbComponent";
import ProgressTracker from "../../Dashboard/ProgressTracker";
import SidenavAdmins from "../../../Components/SidenavAdmins.jsx";
import QRModal from "../../../Components/QRCode/QRModal.jsx";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // ─── state ─────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(null); // store user object or null
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUserRank, setSelectedUserRank] = useState(null);

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [magicUrl, setMagicUrl] = useState(null);
  const [qrStudentEmail, setQrStudentEmail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [messages, setMessages] = useState([]); // fetched from /api/messages/for-admin
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch messages for admin

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchAdminMessages = async (grade = "") => {
    try {
      setLoadingMessages(true);
      // axios instance has baseURL and Authorization defaults
      const res = await axios.get("/api/messages/for-admin", {
        params: grade ? { grade } : {},
      });
      // your backend returns an array (controller returns res.json(data))
      // so res.data should be array
      setMessages(Array.isArray(res.data) ? res.data : res.data || []);
    } catch (err) {
      console.error(
        "Error fetching admin messages:",
        err?.response?.data || err
      );
      toast.error("Failed to load notifications.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`);
      // mark locally so UI updates immediately
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      console.error("Failed to mark as read", err?.response?.data || err);
      toast.error("Failed to mark message as read.");
    }
  };

  // Helper to sanitize progress data if it has a 'default' key
  const sanitizeProgress = (progress) => {
    if (progress && typeof progress === "object" && progress.default) {
      return progress.default;
    }
    return progress;
  };

  const handleClick = (user) => {
    // If user has a progress property, sanitize it
    const sanitizedUser = {
      ...user,
      progress: sanitizeProgress(user.progress),
    };
    setShowProgressTracker(sanitizedUser);
  };
  const handleClose = () => {
    setShowProgressTracker(null);
    setSelectedUserRank(null);
  };
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    yearLevel: "",
  });
  const [selectedGrade, setSelectedGrade] = useState(""); // "" = all, otherwise e.g. "Grade 7"
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // ─── Fetch helper ──────────────────────────────────────────────
  // GET /students or /students/year/:yearLevel depending on grade
  const fetchStudents = async (yearLevel = "") => {
    try {
      const url = yearLevel
        ? `/api/admin/students/year/${encodeURIComponent(yearLevel)}`
        : `/api/admin/students`;
      const res = await axios.get(url, {
        baseURL: "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err);
      toast.error("Failed to load students.");
    }
  };

  // ─── Load all students on mount ────────────────────────────────
  useEffect(() => {
    fetchStudents();
    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/leaderboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // ─── form handlers ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.yearLevel
    ) {
      return toast.error("All fields are required!");
    }

    setIsSubmitting(true);

    try {
      let response;

      if (formData.id) {
        // Prepare update payload for editing
        const updatePayload = {
          username: formData.username,
          name: formData.name,
          yearLevel: formData.yearLevel,
        };
        // Only include password if set
        if (formData.password) updatePayload.password = formData.password;
        // Only include newEmail if email was changed
        if (formData.email !== formData.id)
          updatePayload.newEmail = formData.email;

        // Use global axios config (baseURL + auth set in src/api.js)
        response = await axios.put(
          `/api/admin/students/${encodeURIComponent(formData.id)}`,
          updatePayload
        );
      } else {
        // Create new student
        response = await axios.post(`/api/admin/students`, formData);

        // If backend returns qrDataUrl & magicUrl show modal for printing
        const returned = response?.data?.data;
        if (returned?.qrDataUrl) {
          setQrDataUrl(returned.qrDataUrl);
          setMagicUrl(returned.magicUrl || "");
          setQrStudentEmail(formData.email);
          setQrModalVisible(true);
        }

        // Clear sensitive fields
        setFormData((p) => ({ ...p, password: "", confirmPassword: "" }));
      }

      toast.success(response?.data?.message || "Operation successful");
      await fetchStudents(selectedGrade);
      setShowDeleteModal(false);
      setUserToDelete(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting form:", err?.response?.data || err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message;
      toast.error(serverMsg || "Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      id: user.email,
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
      yearLevel: user.yearLevel || "",
    });
    setShowForm(true);
  };

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteUser = async (email) => {
    try {
      await axios.delete(`/api/admin/students/${encodeURIComponent(email)}`, {
        baseURL: "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted!");
      fetchStudents(selectedGrade);
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err);
      toast.error("Failed to delete user.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ─── Grade filter handler ──────────────────────────────────────
  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
    fetchStudents(grade);
  };
  // ─── JSX ───────────────────────────────────────────────────────
  return (
    <div className="holy-grail-layout">
      {/* Sidebar */}
      <aside className="holy-grail-sidebar">
        <SidenavAdmins
          setSelectedGrade={setSelectedGrade}
          fetchStudents={fetchStudents}
          setShowLeaderboard={setShowLeaderboard}
          showLeaderboard={showLeaderboard}
        />
      </aside>

      {/* Main Content Wrapper */}
      <div className="holy-grail-content-wrapper">
        {/* Header */}
        <header className="holy-grail-header ">
          <h1>Admin Dashboard</h1>
        </header>

        {/* Main Content */}
        <main className="holy-grail-main">
          {showLeaderboard ? (
            <div className="wrapper-lb">
              <LbComponent />
            </div>
          ) : (
            <div className="dashboard-main-content">
              {/* Action Buttons */}
              <div className="Create">
                {/* Notification Button */}
                <button
                  className="btn text-light px-1 py-1"
                  style={{
                    backgroundColor: "#6C7294",
                    color: "#FFF",
                    borderRadius: 10,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    padding: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={async () => {
                    await fetchAdminMessages();
                    setShowNotificationModal(true);
                  }}
                >
                  <FaBell />
                </button>
                {/* Create Button */}
                <button
                  className="btn text-light px-1 py-1"
                  style={{
                    backgroundColor: "#6C7294",
                    color: "#FFF",
                    borderRadius: 10,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    padding: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setFormData({
                      id: "",
                      name: "",
                      username: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      yearLevel: "",
                    });
                    setShowForm(true);
                  }}
                >
                  <FaUserPlus /> Create
                </button>
              </div>
              <div className="table-container" style={{ marginTop: "-3rem" }}>
                {/* Updated table with wrapper for scrolling */}
                <div className="contentdiv  ">
                  <div className="table-wrapper" style={{ marginTop: "4rem" }}>
                    <table className="dashboard-table text-light">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Year Level</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.email}>
                            <td>{u.name || "N/A"}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.yearLevel || "N/A"}</td>
                            <td>
                              <div className="flex gap-3 justify-content-end align-items-center">
                                {/* Progress button */}

                                <div>
                                  {" "}
                                  <button
                                    onClick={() => handleClick(u)}
                                    className="btn text-white fs-5 px-3 py-2 rounded-4"
                                    style={{
                                      backgroundColor: "#2e86c1",
                                      border: "none",
                                      marginLeft: "2rem",
                                    }}
                                  >
                                    Progress
                                  </button>
                                </div>
                                <div>
                                  {" "}
                                  <img
                                    src={EditIcon}
                                    alt="Edit"
                                    className="img-action img-edit"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleEditUser(u)}
                                  />
                                </div>
                                <div>
                                  {" "}
                                  <img
                                    src={RemoveIcon}
                                    alt="Remove"
                                    className="img-action"
                                    style={{
                                      marginRight: "50px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setUserToDelete(u.email);
                                      setShowDeleteModal(true);
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Delete Confirmation Modal - always fixed and centered in viewport */}
              {showDeleteModal && (
                <div
                  className="modal-overlay"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 4000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    className="modal-content"
                    style={{
                      width: "440px",
                      maxWidth: "95vw",
                      padding: "1.5rem 1.5rem",
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      background: "#fff",
                      color: "#222",
                      textAlign: "center",
                      position: "relative",
                      marginRight: "10%",
                    }}
                  >
                    <h3>Confirm Deletion</h3>
                    <p>Are you sure you want to delete this user?</p>
                    <div
                      className="modal-actions"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        marginTop: "1.5rem",
                      }}
                    >
                      <button
                        className="btn btn-danger"
                        onClick={async () => {
                          await handleDeleteUser(userToDelete);
                          setShowDeleteModal(false);
                          setUserToDelete(null);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowDeleteModal(false);
                          setUserToDelete(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Modal */}
              {qrModalVisible && (
                <QRModal
                  visible={qrModalVisible}
                  onClose={() => setQrModalVisible(false)}
                  dataUrl={qrDataUrl}
                  magicUrl={magicUrl}
                  studentEmail={qrStudentEmail}
                />
              )}

              {/* <div className="logout-container">
                <button className="btn-logout" onClick={logout}>
                  Logout
                </button>
              </div> */}

              {showForm && (
                <div className="popup-form">
                  <div className="popup-content">
                    <h3>{formData.id ? "Edit Student" : "Add Student"}</h3>
                    <form onSubmit={handleFormSubmit}>
                      <div className="form-group">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Username"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <select
                          name="yearLevel"
                          value={formData.yearLevel}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        >
                          <option value="">-- Select Year Level --</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 8">Grade 8</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Password"
                          required={!formData.id}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Confirm Password"
                          required={!formData.id}
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn-create"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? formData.id
                              ? "Saving..."
                              : "Creating..."
                            : formData.id
                            ? "Save Changes"
                            : "Create"}
                        </button>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {showProgressTracker && (
                <div
                  className="progress-modal-container "
                  style={{
                    top: "50%",
                    transform: "translate(-40%, -50%)",
                    width: "65vh",
                    height: "95vh",
                    borderRadius: "30px",
                    zIndex: 1000,
                    backgroundColor: "#1a1230",
                    border: "3px solid #7338a0",
                    position: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    justifyContent: "center",
                    right: "20%",
                  }}
                >
                  {/* Close button */}
                  <div
                    style={{
                      position: "fixed",
                      top: "15px",
                      right: "92%",
                      zIndex: 2,
                    }}
                  >
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleClose}
                      aria-label="Close"
                      style={{
                        backgroundColor: "red",
                        borderRadius: "20%",
                        padding: "4px",
                      }}
                    ></button>
                  </div>

                  <ProgressTracker student={showProgressTracker} />
                </div>
              )}

              {/* Notification Modal */}
              {showNotificationModal && (
                <div
                  style={{
                    position: "fixed",
                    top: "12%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "70vw", // wider modal like second image
                    minWidth: "700px",
                    maxWidth: "1100px",
                    zIndex: 5000,
                    background: "#fff",
                    borderRadius: "18px",
                    border: "2px solid #7338a0",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    color: "#222",
                    padding: "2.5rem 2.5rem 2rem 2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    maxHeight: "80vh",
                    overflowY: "auto",
                  }}
                >
                  {/* Close button in top right */}
                  <button
                    style={{
                      position: "absolute",
                      top: "18px",
                      right: "28px",
                      background: "#e53935",
                      color: "#fff",
                      border: "none",
                      borderRadius: "15%",
                      width: "38px",
                      height: "38px",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                    onClick={() => setShowNotificationModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>

                  <h1
                    style={{
                      fontWeight: "bold",
                      fontSize: "2.5rem",
                      marginBottom: "2rem",
                      color: "#222",
                    }}
                  >
                    Notification
                  </h1>

                  <div style={{ width: "100%" }}>
                    {loadingMessages ? (
                      <div style={{ color: "#222", textAlign: "center" }}>
                        Loading...
                      </div>
                    ) : messages.length === 0 ? (
                      <div style={{ color: "#222", textAlign: "center" }}>
                        No notifications.
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          style={{
                            background: "#6C7294",
                            border: "1px solid #e0e0e0",
                            borderRadius: "10px",
                            marginBottom: "1rem",
                            padding: "1rem",
                            color: "#fff",
                            opacity: msg.isRead ? 0.7 : 1,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "1rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                marginBottom: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  background: "#fff",
                                  color: "#6C7294",
                                  borderRadius: "8px",
                                  padding: "0.2rem 0.8rem",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                {msg.grade || "All Grades"}
                              </span>

                              <span
                                style={{
                                  background: "#e0e0e0",
                                  color: "#6C7294",
                                  borderRadius: "8px",
                                  padding: "0.2rem 0.8rem",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                {msg.teacherName ||
                                  msg.senderId?.name ||
                                  "Teacher"}
                              </span>

                              {msg.studentName && (
                                <span
                                  style={{
                                    background: "#bdbdbd",
                                    color: "#6C7294",
                                    borderRadius: "8px",
                                    padding: "0.2rem 0.8rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {msg.studentName}
                                </span>
                              )}
                            </div>

                            <div style={{ color: "#fff", fontSize: "1rem" }}>
                              {msg.body}
                            </div>

                            <div
                              style={{
                                marginTop: "0.5rem",
                                color: "#e0e0e0",
                                fontSize: "0.85rem",
                              }}
                            >
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleString()
                                : ""}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                              marginLeft: "1rem",
                            }}
                          >
                            {!msg.isRead && (
                              <button
                                onClick={() => markMessageAsRead(msg._id)}
                                style={{
                                  background: "#4f46e5",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "0.4rem 0.8rem",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                }}
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="holy-grail-footer ">
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DashboardAdmin;
