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
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // State
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const handleClick = () => {
    setShowProgressTracker(true);
  };

  const handleClose = () => {
    setShowProgressTracker(false);
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
            <div className="Create">
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
                }}
                onClick={() => openForm("create")}
              >
                <FaUserPlus /> Create
              </button>
            </div>

            <div className="contentdiv">
              <div className="table-wrapper">
                <table className="dashboard-table text-light">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      {activeTab === "Users" && <th>Password</th>}
                      <th>Year Level</th>
                      <th className="actions-column"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataToDisplay.map((u) => (
                      <tr key={u.email}>
                        <td>{u.name || "N/A"}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        {activeTab === "Users" && <td>{u.password}</td>}
                        <td>{u.yearLevel || "N/A"}</td>
                        <td>
                          <div className="action-admin">
                            <button
                              onClick={handleClick}
                              className="btn text-white fs-5 px-3 py-2 rounded-4"
                              style={{
                                backgroundColor: "#2e86c1",
                                border: "none",
                                marginLeft: "2rem",
                              }}
                            >
                              Progress
                            </button>
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

              <ProgressTracker />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuperAdmin;
