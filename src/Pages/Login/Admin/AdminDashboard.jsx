import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation to get the current route
import { FaUserPlus } from "react-icons/fa";
import DashboardIcon from "../../../assets/dashboardlogo.png"; // Replace with your actual path
import LeaderboardIcon from "../../../assets/leaderboardicon.png"; // Replace with your actual path
import EditIcon from "../../../assets/Edit.png"; // Replace with your actual path
import RemoveIcon from "../../../assets/Remove.png"; // Replace with your actual path
import "../../../css/Admin.css";
import axios from "axios";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const [users, setUsers] = useState([]);
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
          <div
            className={`sidebar-item ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("/admin")}
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
            <img src={LeaderboardIcon} alt="Leaderboard" className="sidebar-icon" />
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
