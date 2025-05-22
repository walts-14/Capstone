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
    // Only require password fields if creating, or if editing and password is being changed
    if (formMode !== "edit" || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match!");
      }
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
        yearLevel: formData.yearLevel,
        role: activeTab === "Teachers" ? "admin" : "user",
      };
      if (formMode !== "edit") {
        payload.email = formData.email;
        payload.password = formData.password;
      } else {
        // Only include password if user entered a new one
        if (formData.password) {
          payload.password = formData.password;
        }
      }
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

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDelete = async (email) => {
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
                        <td>{u.yearLevel || "N/A"}</td>
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
                              onClick={() => {
                                setUserToDelete(u.email);
                                setShowDeleteModal(true);
                              }}
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
 {/* Delete Confirmation Modal - always fixed and centered in viewport */}
          {showDeleteModal && (
            <div
              className="modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 4000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.3)',
              }}
            >
              <div
                className="modal-content"
                style={{
                  width: '440px',
                  maxWidth: '85vw',
                  padding: '1.5rem 1.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  background: '#fff',
                  color: '#222',
                  textAlign: 'center',
                  position: 'relative',
                  marginRight: '10%',
                }}
              >
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this account?</p>
                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    className="btn btn-danger"
                    onClick={async () => {
                      await handleDelete(userToDelete);
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
