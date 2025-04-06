import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/Admin.css";
import axios from "axios";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const navigate = useNavigate();

  // State for actual students fetched from the backend
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  // Full form data including 'name'
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  // Fetch student accounts from backend
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

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    // Determine if we're editing by checking if a student with this email exists in the current list
    const isEdit = users.some((user) => user.email === formData.email);

    try {
      if (isEdit) {
        // Update existing student: send name, username, newEmail, and password (plaintext)
        const response = await axios.put(
          `http://localhost:5000/api/admin/students/${formData.email}`,
          {
            name: formData.name,
            username: formData.username,
            newEmail: formData.email,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message);
      } else {
        // Create new student account
        const response = await axios.post(
          "http://localhost:5000/api/admin/students",
          {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message);
      }
      // Refresh student list
      await fetchStudents();
    } catch (error) {
      console.error("Error details:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process student account";
      toast.error(errorMessage);
    }

    // Reset form data and close the modal
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(false);
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Student account deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting user:", error.response?.data);
      toast.error("Error deleting user: " + (error.response?.data?.message || "An error occurred"));
    }
  };

  const handleEditUser = (user) => {
    // Pre-fill form data with current values; leave password fields empty so the user can enter a new password if desired.
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="admin-body">
      <div className="DashboardAdmin">
        <h2>Dashboard</h2>
      </div>
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
              name: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            setShowForm(true);
          }}
        >
          <FaUserPlus /> Create
        </button>
      </div>

      {showForm && (
        <div className="popup-form" style={popupStyle}>
          <h3 className="text-light mb-3" style={formHeaderStyle}>
            {users.find((u) => u.email === formData.email) ? "Edit Account" : "Add Account"}
          </h3>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-control"
                style={inputStyle}
                required
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button type="submit" className="btn btn-primary" style={submitBtnStyle}>
                {users.find((u) => u.email === formData.email) ? "Save Changes" : "Create"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowForm(false)}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="contentdiv">
        <table className="dashboard-table text-light mt-4" style={{ borderRadius: "10px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#6B3FA0" }}>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.email} style={{ backgroundColor: index % 2 === 0 ? "#3F3653" : "#271D3E" }}>
                <td>{user.name || "N/A"}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.role || "user"}</td>
                <td>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="img-action"
                    style={{ marginRight: "30px", cursor: "pointer" }}
                    onClick={() => handleEditUser(user)}
                  />
                  <img
                    src={RemoveIcon}
                    alt="Remove"
                    className="img-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(user.email)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Logout mt-3" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div className="admin-logout">
          <button
            className="btn-logout px-4 py-3"
            style={{
              backgroundColor: "#D7443E",
              color: "#FFFFFF",
              borderRadius: "40px",
              fontWeight: "bold",
              fontSize: "1.5rem",
              padding: "10px 30px",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

const popupStyle = {
  position: "fixed",
  top: "25%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#271D3E",
  padding: "30px",
  borderRadius: "10px",
  zIndex: 1000,
  width: "90%",
  maxWidth: "400px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
};

const formHeaderStyle = {
  textAlign: "center",
  fontSize: "2.3rem",
  fontWeight: "bold",
  color: "#FFFFFF",
};

const inputStyle = {
  width: "95%",
  backgroundColor: "#3F3653",
  color: "#FFFFFF",
  fontSize: "1rem",
  padding: "10px",
  border: "1px solid #6F687E",
  borderRadius: "10px",
  marginBottom: "10px",
};

const submitBtnStyle = {
  backgroundColor: "#4A2574",
  color: "#FFFFFF",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "1.2rem",
  padding: "10px 20px",
  marginRight: "10px",
};

const cancelBtnStyle = {
  backgroundColor: "#D7443E",
  color: "#FFFFFF",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "1.2rem",
  padding: "10px 20px",
};

export default DashboardAdmin;
