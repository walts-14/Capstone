// src/Pages/Admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/Admin.css";
import axios from "axios";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ─── NEW STATE ───────────────────────────────────
  // track which year filter is active; "" = all users
  const [yearFilter, setYearFilter] = useState("");

  const [users, setUsers]     = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  // ─── On mount, load all students ────────────────────────────────
  useEffect(() => {
    fetchStudents();
  }, []);

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
      fetchStudents(yearFilter);   // reload with current filter
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
      fetchStudents(yearFilter);
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      toast.error("Failed to delete user.");
    }
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

      {/* ─── Grade‐level Filters (NO DESIGN CHANGE) ─────────────────── */}
      <div className="levels">
        <div
          className={`level-item grade7 ${
            yearFilter === "Grade 7" ? "active" : ""
          }`}
          onClick={() => onGradeClick("Grade 7")}
        >
          GRADE 7
        </div>
        <div
          className={`level-item grade8 ${
            yearFilter === "Grade 8" ? "active" : ""
          }`}
          onClick={() => onGradeClick("Grade 8")}
        >
          GRADE 8
        </div>
        <div
          className={`level-item grade9 ${
            yearFilter === "Grade 9" ? "active" : ""
          }`}
          onClick={() => onGradeClick("Grade 9")}
        >
          GRADE 9
        </div>
        <div
          className={`level-item grade10 ${
            yearFilter === "Grade 10" ? "active" : ""
          }`}
          onClick={() => onGradeClick("Grade 10")}
        >
          GRADE 10
        </div>
      </div>

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
              {users.map((user) => (
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
