// src/Pages/Admin/AdminDashboard.jsx
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
  const location = useLocation(); // Get the current route

  const [users, setUsers]     = useState([]);
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

  // ─── NEW: Fetch wrapper that respects yearFilter ──────────────────
  const fetchStudents = async (year = "") => {
    try {
      // if year is truthy, call /students/year/:year, else /students
      const url = year
        ? `http://localhost:5000/api/admin/students/year/${encodeURIComponent(year)}`
        : "http://localhost:5000/api/admin/students";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err);
      toast.error("Failed to load students.");
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

  // ─── On mount, load all students ────────────────────────────────
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

  // ─── handlers ──────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (!formData.name || !formData.username || !formData.email || !formData.yearLevel) {
      return toast.error("All fields are required!");
    }

    try {
      if (formData.id) {
        // Update
        const response = await axios.put(
          `http://localhost:5000/api/admin/students/${formData.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(response.data.message);
      } else {
        // Create
        const response = await axios.post(
          "http://localhost:5000/api/admin/students",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
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
      id: user.email,        // use email as unique id
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
      await axios.delete(
        `http://localhost:5000/api/admin/students/${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User deleted successfully!");
      fetchStudents();
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

  // ─── Grade buttons click handlers ──────────────────────────────
  const onGradeClick = (grade) => {
    setYearFilter(grade);
    fetchStudents(grade);
  };

  // ─── JSX ───────────────────────────────────────────────────────
  return (
    <div className="admin-body">
      <div className="DashboardAdmin">
        <h2>Dashboard</h2>
      </div>

      <div className="left-sidebar">
        <div className="sidebar-box">
          {/* Dashboard Button */}
          <div
            className={`sidebar-item ${
              location.pathname === "/admin" ? "active" : ""
            }`}
            onClick={() => {
              setYearFilter("");
              fetchStudents();
              navigate("/admin");
            }}
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

      <button className="btn-logout" onClick={logout}>
        Log out
      </button>

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
          <select
            id="yearLevel"
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
            required={!formData.id}  /* only required on create */
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
    </div>
  );
};

export default DashboardAdmin;
