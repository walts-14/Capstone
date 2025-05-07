import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/Admin.css";
import "../../../css/ProgressModal.css";
import axios from "axios";
import toast from "react-hot-toast";
import LbComponent from "../../Leaderboard/LbComponent";
import ProgressTracker from "../../Dashboard/ProgressTracker";
import SidenavAdmins from "../../../Components/SidenavAdmins.jsx";

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
  const handleClick = (user) => {
    setShowProgressTracker(user);
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
        const response = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

    try {
      let response;
      if (formData.id) {
        response = await axios.put(
          `/api/admin/students/${encodeURIComponent(formData.id)}`,
          formData,
          {
            baseURL: "http://localhost:5000",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(`/api/admin/students`, formData, {
          baseURL: "http://localhost:5000",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      toast.success(response.data.message);
      fetchStudents(selectedGrade);
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err);
      toast.error("Failed to submit form.");
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

  const handleDeleteUser = async (email) => {
    if (!window.confirm("Delete this user?")) return;
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
    <div className="admin-body">
      <div className="sidebarr">
        <SidenavAdmins
          setSelectedGrade={setSelectedGrade}
          fetchStudents={fetchStudents}
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

            {/* Updated table with wrapper for scrolling */}
            <div className="contentdiv">
              <div className="table-wrapper">
                <table className="dashboard-table text-light">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Year Level</th>
                      <th className="actions-column"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email}>
                        <td>{u.name || "N/A"}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.password}</td>
                        <td>{u.yearLevel || "N/A"}</td>
                        <td>
                          <div className="action-admin">
                            {/* Progress button */}
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

                            <img
                              src={EditIcon}
                              alt="Edit"
                              className="img-action"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEditUser(u)}
                            />
                            <img
                              src={RemoveIcon}
                              alt="Remove"
                              className="img-action"
                              style={{ marginRight: "50px", cursor: "pointer" }}
                              onClick={() => handleDeleteUser(u.email)}
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
                    <button type="submit" className="btn-create">
                      {formData.id ? "Save Changes" : "Create"}
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

export default DashboardAdmin;
