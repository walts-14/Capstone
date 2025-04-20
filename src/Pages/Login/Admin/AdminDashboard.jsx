import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/Admin.css";
import "../../../css/ProgressModal.css"; // Add a new CSS file for the modal
import axios from "axios";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    yearLevel: "",
  });

  const [selectedGrade, setSelectedGrade] = useState("grade7"); // Default to Grade 7
  const [students, setStudents] = useState([]); // Students for the selected grade
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard data

  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err);
    }
  };

  const fetchStudentsByGrade = async (grade) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { grade }, // Pass grade as a query parameter
      });
      setStudents(res.data.data); // Update students for the selected grade
    } catch (err) {
      console.error("Error fetching students by grade:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchStudentsByGrade(selectedGrade);
  }, [selectedGrade]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(res.data.data); // Update leaderboard state
      } catch (err) {
        console.error("Error fetching leaderboard data:", err.response?.data || err);
      }
    };

    if (location.pathname === "/leaderboard") {
      fetchLeaderboard();
    }
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.yearLevel) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (formData.id) {
        // Update user
        const response = await axios.put(
          `http://localhost:5000/api/admin/students/${formData.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success(response.data.message);
      } else {
        // Create new user
        const response = await axios.post(
          "http://localhost:5000/api/admin/students",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success(response.data.message);
      }
      fetchStudentsByGrade(selectedGrade);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      toast.error("Failed to submit form.");
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      id: user.id,
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully!");
      fetchStudentsByGrade(selectedGrade);
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      toast.error("Failed to delete user.");
    }
  };

  const handleShowProgress = (user) => {
    // Ensure default progress structure if no progress data exists
    const defaultProgress = {
      basic: [
        { name: "Lesson 1", percentage: 0 },
        { name: "Lesson 2", percentage: 0 },
        { name: "Lesson 3", percentage: 0 },
        { name: "Lesson 4", percentage: 0 },
      ],
      intermediate: [
        { name: "Lesson 1", percentage: 0 },
        { name: "Lesson 2", percentage: 0 },
        { name: "Lesson 3", percentage: 0 },
        { name: "Lesson 4", percentage: 0 },
      ],
      advanced: [
        { name: "Lesson 1", percentage: 0 },
        { name: "Lesson 2", percentage: 0 },
        { name: "Lesson 3", percentage: 0 },
        { name: "Lesson 4", percentage: 0 },
      ],
    };

    // Find the rank of the user in the leaderboard
    const rank = leaderboard.findIndex((entry) => entry.email === user.email) + 1;

    setSelectedUser({
      ...user,
      rank: rank || "N/A", // Add rank to the selected user
      progress: user.progress || defaultProgress, // Use default progress if none exists
    });
    setShowProgressModal(true);
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setSelectedUser(null);
  };

  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade); // Update the selected grade
    fetchStudentsByGrade(grade); // Fetch students for the selected grade
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-body">
      {/* Dashboard Title */}
      <div className="DashboardAdmin">
        <h2>Dashboard</h2>
      </div>

      {/* Sidebar with Dashboard and Leaderboard */}
      <div className="left-sidebar">
        <div className="sidebar-box">
          {/* Dashboard Button */}
          <div
            className={`sidebar-item ${
              location.pathname === "/admin" ? "active" : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            <img src={DashboardIcon} alt="Dashboard" className="sidebar-icon" />
            <span>Dashboard</span>
          </div>

          {/* Leaderboard Button */}
          <div
            className={`sidebar-item ${
              location.pathname === "/leaderboard" ? "active" : ""
            }`}
            onClick={() => navigate("/leaderboard")}
          >
            <img
              src={LeaderboardIcon}
              alt="Leaderboard"
              className="sidebar-icon"
            />
            <span>Leaderboard</span>
          </div>
        </div>
      </div>

      {/* Conditional Rendering for Dashboard and Leaderboard */}
      {location.pathname === "/admin" && (
        <>
          {/* Grade Levels */}
          <div className="levels">
            <div
              className={`level-item grade7 ${selectedGrade === "grade7" ? "active" : ""}`}
              onClick={() => handleGradeSelection("grade7")}
            >
              GRADE 7
            </div>
            <div
              className={`level-item grade8 ${selectedGrade === "grade8" ? "active" : ""}`}
              onClick={() => handleGradeSelection("grade8")}
            >
              GRADE 8
            </div>
            <div
              className={`level-item grade9 ${selectedGrade === "grade9" ? "active" : ""}`}
              onClick={() => handleGradeSelection("grade9")}
            >
              GRADE 9
            </div>
            <div
              className={`level-item grade10 ${selectedGrade === "grade10" ? "active" : ""}`}
              onClick={() => handleGradeSelection("grade10")}
            >
              GRADE 10
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="Create">
              <button
                className="btn text-light px-1 py-1"
                style={{
                  backgroundColor: "#4A2574",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  padding: "30px",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
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

            <div className="contentdiv">
              <table className="dashboard-table text-light mt-4">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Year Level</th>
                    <th> </th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.email}>
                      <td>{student.name || "N/A"}</td>
                      <td>{student.username}</td>
                      <td>{student.email}</td>
                      <td>{student.yearLevel || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-progress"
                          style={{
                            backgroundColor: "#2E86C1",
                            color: "#FFFFFF",
                            borderRadius: "5px",
                          }}
                          onClick={() => handleShowProgress(student)}
                        >
                          View Progress
                        </button>
                      </td>
                      <td>
                        <img
                          src={EditIcon}
                          alt="Edit"
                          className="img-action"
                          onClick={() => handleEditUser(student)}
                        />
                        <img
                          src={RemoveIcon}
                          alt="Delete"
                          className="img-action"
                          onClick={() => handleDeleteUser(student.email)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Render Leaderboard Component */}
      {location.pathname === "/leaderboard" && (
        <div className="leaderboard-container">
          {leaderboard.map((entry, index) => (
            <div key={index} className="leaderboard-entry">
              <img src="/src/assets/trophy.png" alt="Trophy" className="trophy-icon" />
              <span className="leaderboard-rank">{index + 1}#</span>
              <span className="leaderboard-name">{entry.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Progress Modal */}
      {showProgressModal && selectedUser && (
        <div className="progress-modal">
          {/* Close Button */}
          <button className="btn btn-close" onClick={handleCloseProgressModal}>
          </button>

          <div className="progress-modal-content">
            {/* Leaderboard Section */}
            <div className="progress-leaderboard">
              <img src="/src/assets/trophy.png" alt="Trophy" className="trophy-icon" />
              <span className="leaderboard-rank">{selectedUser.rank || "N/A"}#</span>
              <span className="leaderboard-name">{selectedUser.name}</span>
            </div>


            {/* Basic Section */}
            <div className="progress-section-container">
              <div className="progress-section">
                <h4 className="basic-header">BASIC</h4>
                {selectedUser.progress.basic.map((lesson, index) => (
                  <div key={index} className="progress-item basic">
                    <span>{lesson.name}</span>
                    <span>{lesson.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intermediate Section */}
            <div className="progress-section-container">
              <div className="progress-section">
                <h4 className="intermediate-header">INTERMEDIATE</h4>
                {selectedUser.progress.intermediate.map((lesson, index) => (
                  <div key={index} className="progress-item intermediate">
                    <span>{lesson.name}</span>
                    <span>{lesson.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Section */}
            <div className="progress-section-container">
              <div className="progress-section">
                <h4 className="advanced-header">ADVANCED</h4>
                {selectedUser.progress.advanced.map((lesson, index) => (
                  <div key={index} className="progress-item advanced">
                    <span>{lesson.name}</span>
                    <span>{lesson.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Out Button */}
      <button className="btn-logout" onClick={logout}>
        Log out
      </button>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form">
          <div className="popup-content">
            <h3>{formData.id ? "Edit Student" : "Add Student"}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="yearLevel"
                  placeholder="Year Level"
                  value={formData.yearLevel}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-create">
                  {formData.id ? "Save Changes" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
