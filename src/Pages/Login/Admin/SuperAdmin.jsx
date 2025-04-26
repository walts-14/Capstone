import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import "../../../css/SuperAdmin.css";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressTracker from "../../Dashboard/ProgressTracker";

const SuperAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [showForm, setShowForm] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formType, setFormType] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("grade7");
  const [students, setStudents] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Set token on axios default headers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token payload:", decoded);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Fetch student and teacher accounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/superadmin/users"
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/superadmin/admins"
        );
        setTeachers(response.data.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchUsers();
    fetchTeachers();
  }, []);

  const fetchStudentsByGrade = async (grade) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/superadmin/students`,
        {
          params: { grade },
        }
      );
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students by grade:", error);
    }
  };

  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
    fetchStudentsByGrade(grade);
  };

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

    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    const role = formType === "Teacher" ? "admin" : "user";
    const createEndpoint = "http://localhost:5000/api/superadmin/create-account";

    const newUser = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role,
    };

    try {
      if (formMode === "edit") {
        const updateUrl =
          role === "admin"
            ? `http://localhost:5000/api/superadmin/admins/${formData.email}`
            : `http://localhost:5000/api/superadmin/users/${formData.email}`;
        const { email, ...updateData } = newUser;
        await axios.put(updateUrl, updateData);
        toast.success("User updated successfully!");
      } else {
        await axios.post(createEndpoint, newUser);
        toast.success(`${formType} account created successfully!`);
      }

      // Refresh lists
      const userResponse = await axios.get(
        "http://localhost:5000/api/superadmin/users"
      );
      setUsers(userResponse.data.data);
      const teacherResponse = await axios.get(
        "http://localhost:5000/api/superadmin/admins"
      );
      setTeachers(teacherResponse.data.data);
    } catch (error) {
      console.error("Error details:", error.response?.data);
      toast.error(
        "Error: " + (error.response?.data?.message || "An error occurred")
      );
    }

    // Reset form and close modal
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(false);
  };

  const handleDeleteUser = async (email, role) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (confirmDelete) {
      try {
        const deleteUrl =
          role === "admin"
            ? `http://localhost:5000/api/superadmin/admins/${email}`
            : `http://localhost:5000/api/superadmin/users/${email}`;
        await axios.delete(deleteUrl);
        toast.success(
          `${role === "admin" ? "Teacher" : "Student"} account deleted successfully!`
        );

        // Refresh lists
        const userResponse = await axios.get(
          "http://localhost:5000/api/superadmin/users"
        );
        setUsers(userResponse.data.data);
        const teacherResponse = await axios.get(
          "http://localhost:5000/api/superadmin/admins"
        );
        setTeachers(teacherResponse.data.data);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(
          "Error deleting user: " +
            (error.response?.data?.message || "An error occurred")
        );
      }
    }
  };

  const handleEditUser = (email, role) => {
    const dataToEdit =
      role === "admin"
        ? teachers.find((user) => user.email === email)
        : users.find((user) => user.email === email);
    if (dataToEdit) {
      setFormData({
        name: dataToEdit.name,
        username: dataToEdit.username,
        email: dataToEdit.email,
        password: dataToEdit.password,
        confirmPassword: dataToEdit.password,
      });
      setFormType(role === "admin" ? "Teacher" : "Student");
      setFormMode("edit");
      setShowForm(true);
    }
  };

  const handleCreateUser = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormMode("create");
    setFormType("");
    setShowSelectionModal(true);
  };

  const handleShowProgress = (student) => {
    setSelectedUser(student);
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

  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="superadmin-body">
      {/* Dashboard Title */}
      <div className="Dashboard">
        <div className="AdminDashboard">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Dashboard</h2>
          </div>
        </div>
      </div>

      {/* Sidebar with Dashboard and Leaderboard */}
      <div className="left-sidebar">
        <div className="sidebar-box">
          {/* Dashboard Button */}
          <div
            className={`sidebar-item ${
              location.pathname === "/superadmin" ? "active" : ""
            }`}
            onClick={() => navigate("/superadmin")}
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
      {location.pathname === "/superadmin" && (
        <>
          {/* Grade Levels */}
          <div className="levels">
            <div
              className={`level-item grade7 ${
                selectedGrade === "grade7" ? "active" : ""
              }`}
              onClick={() => handleGradeSelection("grade7")}
            >
              GRADE 7
            </div>
            <div
              className={`level-item grade8 ${
                selectedGrade === "grade8" ? "active" : ""
              }`}
              onClick={() => handleGradeSelection("grade8")}
            >
              GRADE 8
            </div>
            <div
              className={`level-item grade9 ${
                selectedGrade === "grade9" ? "active" : ""
              }`}
              onClick={() => handleGradeSelection("grade9")}
            >
              GRADE 9
            </div>
            <div
              className={`level-item grade10 ${
                selectedGrade === "grade10" ? "active" : ""
              }`}
              onClick={() => handleGradeSelection("grade10")}
            >
              GRADE 10
            </div>
          </div>
        </>
      )}

      {/* Progress Modal */}
      {showProgressModal && selectedUser && (
        <div className="progress-modal">
          <button className="btn btn-close" onClick={handleCloseProgressModal}>
            Close
          </button>
          <div className="progress-modal-content">
            <h3>{selectedUser.name}'s Progress</h3>
            {/* Add progress details here */}
          </div>
        </div>
      )}

      <div className="CreateAccount">
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
          onClick={handleCreateUser}
        >
          <FaUserPlus /> Create
        </button>
      </div>

      <div className="divtabs">
        <div className="tabs">
          <button
            className={`tabss ${activeTab === "Users" ? "active" : ""}`}
            onClick={() => setActiveTab("Users")}
          >
            Users
          </button>
          <button
            className={`tabss ${activeTab === "Teacher" ? "active" : ""}`}
            onClick={() => setActiveTab("Teacher")}
          >
            Teacher
          </button>
        </div>
      </div>

      <div className="content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Year Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((entry) => (
              <tr key={entry.email}>
                <td>{entry.email}</td>
                <td>{entry.name}</td>
                <td>{entry.username}</td>
                <td>{entry.password}</td>
                <td>{entry.yearLevel || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-progress"
                    style={{
                      backgroundColor: "#2E86C1",
                      color: "#FFFFFF",
                      borderRadius: "5px",
                      marginRight: "1px",
                    }}
                    onClick={() => handleShowProgress(entry)}
                  >
                    View Progress
                  </button>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="img-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditUser(entry.email, entry.role)}
                  />
                  <img
                    src={RemoveIcon}
                    alt="Remove"
                    className="img-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(entry.email, entry.role)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="popup-form"
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#271D3E",
            padding: "30px",
            borderRadius: "10px",
            zIndex: 1000,
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
          }}
        >
          <h3
            className="text-light mb-3"
            style={{
              textAlign: "center",
              fontSize: "2.3rem",
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            {formMode === "edit"
              ? `Edit ${formType} Account`
              : `Add ${formType} Account`}
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
                style={{
                  width: "95%",
                  backgroundColor: "#3F3653",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  padding: "10px",
                  border: "1px solidrgb(255, 255, 255)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="form-control"
                style={{
                  width: "95%",
                  backgroundColor: "#3F3653",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  padding: "10px",
                  border: "1px solidrgb(255, 255, 255)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
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
                style={{
                  width: "95%",
                  backgroundColor: "#3F3653",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  padding: "10px",
                  border: "1px solidrgb(255, 255, 255)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
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
                style={{
                  width: "95%",
                  backgroundColor: "#3F3653",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  padding: "10px",
                  border: "1px solidrgb(255, 255, 255)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
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
                style={{
                  width: "95%",
                  backgroundColor: "#3F3653",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  padding: "10px",
                  border: "1px solidrgb(255, 255, 255)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#4A2574",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  padding: "15px",
                  width: "90%",
                  marginBottom: "10px",
                }}
              >
                Submit
              </button>
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  backgroundColor: "#D7443E",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  padding: "15px",
                  width: "90%",
                }}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

        {showSelectionModal && (
          <div
            className="popup-modal"
            style={{
              position: "fixed",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#271D3E",
              padding: "30px",
              borderRadius: "10px",
              zIndex: 1000,
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h3
              className="text-light mb-3"
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              Create Account
            </h3>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                className="btn btn-student"
                style={{
                  backgroundColor: "#4A2574",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                }}
                onClick={() => {
                  setFormType("Student"); // This will create a student (role: "user")
                  setShowSelectionModal(false);
                  setShowForm(true);
                }}
              >
                Student
              </button>
              <button
                className="btn btn-teacher"
                style={{
                  backgroundColor: "#4A2574",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                }}
                onClick={() => {
                  setFormType("Teacher"); // This will create a teacher (role: "admin")
                  setShowSelectionModal(false);
                  setShowForm(true);
                }}
              >
                Teacher
              </button>
            </div>
          </div>
        )}

<div
  className="logout-container"
>
  <button
    onClick={() => {
      localStorage.removeItem("token"); // Clear the token
      navigate("/login"); // Redirect to the login page
    }}
    className="btn btn-danger"
    style={{
      color: "#FFFFFF",
      borderRadius: "20px",
      padding: "10px 20px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      marginRight: "50px",
      height: "50px",
      fontSize: "1.4rem",
    }}
  >
    Logout
  </button>
</div>
    </div>
  );
};

export default SuperAdmin;
