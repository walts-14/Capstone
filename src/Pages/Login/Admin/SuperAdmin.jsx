import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import axios from "axios";
import toast from "react-hot-toast";
import SidenavAdmins from "../../../Components/SidenavAdmins.jsx";
import ProgressTracker from "../../Dashboard/ProgressTracker";
import LbComponent from "../../Leaderboard/LbComponent";

import "../../../css/SuperAdmin.css";
import "../../../css/ProgressModal.css";

const SuperAdmin = () => {
  // State for showing message form
  const [showMessageForm, setShowMessageForm] = useState(false);
  // State for new message form
  const [newMessage, setNewMessage] = useState({
    teacher: "",
    grade: "",
    student: "",
    content: "",
  });

  // Handler for plus button
  const handlePlusClick = () => {
    setShowMessageForm(true);
  };
  const handleMessageFormClose = () => {
    setShowMessageForm(false);
    setNewMessage({ teacher: "", grade: "", student: "", content: "" });
  };
  // Handler for form input
  const handleMessageInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));
  };
  // Handler for sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.teacher || !newMessage.grade || !newMessage.student || !newMessage.content) {
      toast.error("Please fill out all fields.");
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: newMessage.teacher,
        grade: newMessage.grade,
        recipient: newMessage.student,
        content: newMessage.content,
      },
    ]);
    handleMessageFormClose();
    toast.success("Message sent!");
  };
  // Message popup state
  const [showMessagesPopup, setShowMessagesPopup] = useState(false);
  // Example messages data (replace with API call if needed)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Ma'am Charm",
      grade: "GRADE 7",
      recipient: "Stepehn curry",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in",
    },
  ]);

  // Handler for message button
  const handleMessageButtonClick = () => {
    setShowMessagesPopup(true);
  };
  const handleCloseMessagesPopup = () => {
    setShowMessagesPopup(false);
    setShowMessageForm(false);
    setNewMessage({ teacher: "", grade: "", student: "", content: "" });
  };
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // State
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const handleClick = (user) => {
    setShowProgressTracker(user);
  };

  const handleClose = () => {
    setShowProgressTracker(null);
  };

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    yearLevel: "",
  });

  // Fetch on mount
  useEffect(() => {
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUsers();
    fetchTeachers();
  }, []);

  // Fetch helpers
  const fetchUsers = async (grade = "") => {
    try {
      const url = grade
        ? `/api/superadmin/users/year/${encodeURIComponent(grade)}`
        : `/api/superadmin/users`;
      const res = await axios.get(url, { baseURL: "http://localhost:5000" });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users.");
    }
  };

  const fetchTeachers = async (grade = "") => {
    try {
      const url = grade
        ? `/api/superadmin/admins/year/${encodeURIComponent(grade)}`
        : `/api/superadmin/admins`;
      const res = await axios.get(url, { baseURL: "http://localhost:5000" });
      setTeachers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teachers.");
    }
  };

  // Handlers
  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
    if (activeTab === "Users") fetchUsers(grade);
    else fetchTeachers(grade);
  };

  const openForm = (mode = "create", user = null) => {
    setFormMode(mode);
    if (mode === "edit" && user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        password: "",
        confirmPassword: "",
        yearLevel: user.yearLevel || "",
      });
    } else {
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        yearLevel: selectedGrade || "",
      });
    }
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (!formData.name || !formData.username || !formData.email) {
      return toast.error("All fields are required!");
    }
    try {
      const urlBase =
        formMode === "edit"
          ? activeTab === "Users"
            ? `/api/superadmin/users/${encodeURIComponent(formData.email)}`
            : `/api/superadmin/admins/${encodeURIComponent(formData.email)}`
          : "/api/superadmin/create-account";
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        yearLevel: formData.yearLevel,
        role: activeTab === "Teachers" ? "admin" : "user",
      };
      if (formMode === "edit") delete payload.email;
      const method = formMode === "edit" ? axios.put : axios.post;
      await method(urlBase, payload, { baseURL: "http://localhost:5000" });
      toast.success(
        `${formMode === "edit" ? "Updated" : "Created"} ${activeTab}`
      );
      fetchUsers(selectedGrade);
      fetchTeachers(selectedGrade);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit form.");
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      const url =
        activeTab === "Users"
          ? `/api/superadmin/users/${encodeURIComponent(email)}`
          : `/api/superadmin/admins/${encodeURIComponent(email)}`;
      await axios.delete(url, { baseURL: "http://localhost:5000" });
      toast.success("Deleted successfully");
      fetchUsers(selectedGrade);
      fetchTeachers(selectedGrade);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Data
  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="admin-body">
      <div className="sidebarr">
        <SidenavAdmins
          setSelectedGrade={setSelectedGrade}
          fetchStudents={activeTab === "Users" ? fetchUsers : fetchTeachers}
          setShowLeaderboard={setShowLeaderboard}
          showLeaderboard={showLeaderboard}
        />
      </div>

      {showLeaderboard ? (
        <div
          className="wrapper-lb"
          style={{ maxHeight: "100vh", overflowY: "auto" }}
        >
          <LbComponent />
        </div>
      ) : (
        <>
          <div className="levels">
            {["Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((grade) => {
              const gradeClass = grade.replace(" ", "").toLowerCase();
              return (
                <div
                  key={grade}
                  className={`level-item ${gradeClass} ${
                    selectedGrade === grade ? "active" : ""
                  }`}
                  onClick={() => handleGradeSelection(grade)}
                >
                  {grade.toUpperCase()}
                </div>
              );
            })}
          </div>

          <div
            className="divtabs d-flex justify-content-center"
            style={{ zIndex: showProgressTracker ? 1 : 10 }}
          >
            <div className="tabs position-absolute">
              <button
                className={`tabss ${activeTab === "Users" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Users");
                  fetchUsers(selectedGrade);
                }}
              >
                Users
              </button>
              <button
                className={`tabss ${activeTab === "Teachers" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Teachers");
                  fetchTeachers(selectedGrade);
                }}
              >
                Teacher
              </button>
            </div>
          </div>

          <div className="table-container">
            <div className="Create" style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "1.5rem" }}>
                <button
                  className="btn text-light px-1 py-1"
                  style={{
                    backgroundColor: "#4A2574",
                    color: "#FFF",
                    borderRadius: 10,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    padding: "30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onClick={handleMessageButtonClick}
                >
                  {/* Envelope icon SVG */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="6" fill="#4A2574" />
                    <path d="M4 8V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8Z" stroke="#fff" strokeWidth="2" />
                    <path d="M4 8L12 13L20 8" stroke="#fff" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            {/* Messages Popup Modal */}
            {showMessagesPopup && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "#1a1230",
                  borderRadius: "30px",
                  border: "3px solid #7338a0",
                  zIndex: 2000,
                  width: "600px",
                  height: "550px",
                  boxShadow: "0 0 20px #000",
                  padding: "2rem 2.5rem 2rem 2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                }}
              >
                {/* Close button - square, centered X */}
                <button
                  type="button"
                  onClick={handleCloseMessagesPopup}
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    top: "32px",
                    right: "14px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    width: "48px",
                    height: "48px",
                    fontWeight: "bold",
                    fontSize: "2.2rem",
                    cursor: "pointer",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>×</span>
                </button>
                {/* Plus icon */}
                <button
                  type="button"
                  aria-label="Add Message"
                  style={{
                    position: "absolute",
                    top: "32px",
                    right: "75px",
                    backgroundColor: "#7338a0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.2rem",
                    cursor: "pointer",
                  }}
                  onClick={handlePlusClick}
                >
                  <span style={{ fontSize: "2.7rem", fontWeight: "bold" }}>+</span>
                </button>
                <h2 style={{ color: "#fff", fontWeight: "bold", fontSize: "2.2rem", marginBottom: "1.5rem" }}>Message</h2>
                {/* Message Form Popup */}
                {showMessageForm && (
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#2d2342",
                      borderRadius: "20px",
                      border: "2px solid #7338a0",
                      zIndex: 3000,
                      width: "400px",
                      boxShadow: "0 0 20px #000",
                      padding: "2rem 2rem 1.5rem 2rem",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleMessageFormClose}
                      aria-label="Close"
                      style={{
                        position: "absolute",
                        top: "18px",
                        right: "18px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        width: "32px",
                        height: "32px",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>×</span>
                    </button>
                    <h2 style={{ color: "#fff", fontWeight: "bold", fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>Message</h2>
                    <form onSubmit={handleSendMessage}>
                      <div style={{ marginBottom: "1rem" }}>
                        <select
                          name="teacher"
                          value={newMessage.teacher}
                          onChange={handleMessageInputChange}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            borderRadius: "10px",
                            background: "#3c2e5e",
                            color: "#fff",
                            border: "none",
                            fontSize: "1.1rem",
                            marginBottom: "0.7rem",
                          }}
                        >
                          <option value="">Teacher</option>
                          <option value="Ma'am Charm">Ma'am Charm</option>
                          <option value="Sir John">Sir John</option>
                        </select>
                        <select
                          name="grade"
                          value={newMessage.grade}
                          onChange={handleMessageInputChange}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            borderRadius: "10px",
                            background: "#3c2e5e",
                            color: "#fff",
                            border: "none",
                            fontSize: "1.1rem",
                            marginBottom: "0.7rem",
                          }}
                        >
                          <option value="">Grade</option>
                          <option value="GRADE 7">GRADE 7</option>
                          <option value="GRADE 8">GRADE 8</option>
                          <option value="GRADE 9">GRADE 9</option>
                          <option value="GRADE 10">GRADE 10</option>
                        </select>
                        <select
                          name="student"
                          value={newMessage.student}
                          onChange={handleMessageInputChange}
                          style={{
                            width: "100%",
                            padding: "0.8rem",
                            borderRadius: "10px",
                            background: "#3c2e5e",
                            color: "#fff",
                            border: "none",
                            fontSize: "1.1rem",
                            marginBottom: "0.7rem",
                          }}
                        >
                          <option value="">Student Name</option>
                          <option value="Stepehn curry">Stepehn curry</option>
                          <option value="Jane Doe">Jane Doe</option>
                        </select>
                        <textarea
                          name="content"
                          value={newMessage.content}
                          onChange={handleMessageInputChange}
                          placeholder="Message"
                          style={{
                            width: "100%",
                            minHeight: "120px",
                            borderRadius: "10px",
                            background: "#3c2e5e",
                            color: "#fff",
                            border: "2px solid #bdbdbd",
                            fontSize: "1.1rem",
                            padding: "0.8rem",
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          width: "100%",
                          background: "#7338a0",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          padding: "0.7rem 0",
                          marginTop: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}
                <div style={{ width: "100%", marginTop: "1rem", flex: 1, overflowY: "auto" }}>
                  {messages.length === 0 ? (
                    <div style={{ color: "#fff", textAlign: "center" }}>No messages found.</div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          background: "#2d2342",
                          borderRadius: "15px",
                          padding: "1rem",
                          marginBottom: "1rem",
                          color: "#fff",
                        }}
                      >
                        <div style={{ marginBottom: "0.5rem" }}>
                          <span style={{ background: "#f7c948", color: "#222", borderRadius: "7px", padding: "0.2rem 0.7rem", fontWeight: "bold", marginRight: "0.5rem" }}>{msg.sender}</span>
                          <span style={{ background: "#7c6ae3", color: "#fff", borderRadius: "7px", padding: "0.2rem 0.7rem", fontWeight: "bold", marginRight: "0.5rem" }}>{msg.grade}</span>
                          <span style={{ background: "#bdbdbd", color: "#222", borderRadius: "7px", padding: "0.2rem 0.7rem", fontWeight: "bold" }}>{msg.recipient}</span>
                        </div>
                        <div style={{ color: "#fff", fontSize: "1rem" }}>{msg.content}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
              <div>
                <button
                  className="btn text-light px-1 py-1"
                  style={{
                    backgroundColor: "#4A2574",
                    color: "#FFF",
                    borderRadius: 10,
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    padding: "30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onClick={() => openForm("create")}
                >
                  <FaUserPlus /> Create
                </button>
              </div>
            </div>

            <div className="contentdiv">
              <div className="table-wrapper">
                <table className="dashboard-table text-light">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      {activeTab === "Users" && <th>Year Level</th>}
                      <th className="actions-column"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataToDisplay.map((u) => (
                      <tr key={u.email}>
                        <td>{u.name || "N/A"}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        {activeTab === "Users" && (
                          <td>{u.yearLevel || "N/A"}</td>
                        )}
                        <td>
                          <div className="action-admin">
                            {activeTab === "Users" && (
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
                            )}
                            <img
                              src={EditIcon}
                              alt="Edit"
                              className="img-action"
                              style={{ cursor: "pointer" }}
                              onClick={() => openForm("edit", u)}
                            />
                            <img
                              src={RemoveIcon}
                              alt="Remove"
                              className="img-action"
                              style={{ marginRight: "50px", cursor: "pointer" }}
                              onClick={() => handleDelete(u.email)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="logout-container">
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>

          {showForm && (
            <div className="popup-form">
              <div className="popup-content">
                <h3>
                  {formMode === "edit" ? "Edit" : "Add"}{" "}
                  {activeTab.slice(0, -1)}
                </h3>
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
                      required={formMode !== "edit"}
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
                      required={formMode !== "edit"}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-create">
                      {formMode === "edit" ? "Save Changes" : "Create"}
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
              className="progress-modal-container"
              style={{
                top: "50%",
                transform: "translate(-40%, -50%)",
                width: "65vh",
                height: "90vh",
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
        </>
      )}
    </div>
  );
};

export default SuperAdmin;
