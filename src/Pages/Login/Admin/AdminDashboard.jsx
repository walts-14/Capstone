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

  useEffect(() => {
    fetchStudents();
  }, []);

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
      fetchStudents();
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
      fetchStudents();
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      toast.error("Failed to delete user.");
    }
  };

  const handleShowProgress = (user) => {
    setSelectedUser(user);
    setShowProgressModal(true);
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setSelectedUser(null);
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
          {/* Existing Dashboard Content */}
          {/* Grade Levels */}
          <div className="levels">
            <div className="level-item grade7" onClick={() => navigate("/grade7")}>
              GRADE 7
            </div>
            <div className="level-item grade8" onClick={() => navigate("/grade8")}>
              GRADE 8
            </div>
            <div className="level-item grade9" onClick={() => navigate("/grade9")}>
              GRADE 9
            </div>
            <div className="level-item grade10" onClick={() => navigate("/grade10")}>
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
                    <th>Password</th>
                    <th>Year Level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.email}>
                      <td>{user.name || "N/A"}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.yearLevel || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-progress"
                          style={{
                            backgroundColor: "#2E86C1",
                            color: "#FFFFFF",
                            borderRadius: "5px",

                            marginLeft: "-15px",
                          }}
                          onClick={() => handleShowProgress(user)}
                        >
                          Progress
                        </button>
                        <img
                          src={EditIcon}
                          alt="Edit"
                          className="img-action"
                          onClick={() => handleEditUser(user)}
                        />
                        <img
                          src={RemoveIcon}
                          alt="Delete"
                          className="img-action"
                          onClick={() => handleDeleteUser(user.email)}
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
      {location.pathname === "/leaderboard" && <Leaderboard />}

      {/* Progress Modal */}
      {showProgressModal && selectedUser && (
        <div className="progress-modal">
          <div className="progress-modal-content">
            <button className="btn btn-close" onClick={handleCloseProgressModal}>
            </button>
            <h3>{selectedUser.name}'s Progress</h3>
            {selectedUser.progress ? (
              <>
                <div className="progress-section">
                  <h4>Basic</h4>
                  {selectedUser.progress.basic.map((lesson, index) => (
                    <div key={index} className="progress-item">
                      <span>{lesson.name}</span>
                      <span>{lesson.percentage}%</span>
                    </div>
                  ))}
                </div>
                <div className="progress-section">
                  <h4>Intermediate</h4>
                  {selectedUser.progress.intermediate.map((lesson, index) => (
                    <div key={index} className="progress-item">
                      <span>{lesson.name}</span>
                      <span>{lesson.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No progress data available for this student.</p>
            )}
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
