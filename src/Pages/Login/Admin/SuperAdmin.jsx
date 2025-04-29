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
import LbComponent from "../../Leaderboard/LbComponent";

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
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

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("All fields are required!");
      return;
    }

    const role = formType === "Teacher" ? "admin" : "user";
    const createEndpoint =
      "http://localhost:5000/api/superadmin/create-account";

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
          `${
            role === "admin" ? "Teacher" : "Student"
          } account deleted successfully!`
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
      setShowForm(true); // Open the form modal
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

  const handleShowProgress = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowProgressModal(true); // Show the progress modal
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setSelectedUser(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dataToDisplay =
    activeTab === "Users" ? users : activeTab === "Teachers" ? teachers : [];

  return (
    <div className="superadmin-body">
      {/*ito papalitan*/}
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
            className={`sidebar-item ${!showLeaderboard ? "active" : ""}`}
            onClick={() => setShowLeaderboard(false)} // Show the dashboard
          >
            <img src={DashboardIcon} alt="Dashboard" className="sidebar-icon" />
            <span>Dashboard</span>
          </div>

          {/* Leaderboard Button */}
          <div
            className={`sidebar-item ${showLeaderboard ? "active" : ""}`}
            onClick={() => setShowLeaderboard(true)} // Show the leaderboard
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
      {showLeaderboard ? (
        <div className="wrapper-lb">
          <LbComponent />
        </div>
      ) : (
        <>
          {/* Dashboard Content */}
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

          <div className="content">
            <table className="data-table me-5">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Year Level</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay.map((entry) => (
                  <tr key={entry.email}>
                    <td>{entry.name}</td>
                    <td>{entry.username}</td>
                    <td>{entry.email}</td>
                    <td>{entry.password}</td>
                    <td>{entry.yearLevel || "N/A"}</td>
                    <td>
                      {/* Progress, Edit, and Delete Buttons */}
                      <button
                        className="btn btn-progress text-white fs-5 px-3 py-2 rounded-4"
                        style={{
                          backgroundColor: "#2E86C1",
                          color: "#FFFFFF",
                          borderRadius: "20px",
                        }}
                        onClick={() => handleShowProgress(entry)} // Pass the selected user
                      >
                        Progress
                      </button>
                      <img
                        src={EditIcon}
                        alt="Edit"
                        className="img-action"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleEditUser(entry.email, entry.role || "user")
                        } // Fallback to "user"
                      />
                      <img
                        src={RemoveIcon}
                        alt="Remove"
                        className="img-action"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleDeleteUser(entry.email, entry.role || "user")
                        } // Fallback to "user"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Account Button */}
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

          {/* Tabs */}
          <div className="divtabs">
            <div className="tabs">
              <button
                className={`tabss ${activeTab === "Users" ? "active" : ""}`}
                onClick={() => setActiveTab("Users")} // Set active tab to "Users"
              >
                Users
              </button>
              <button
                className={`tabss ${activeTab === "Teachers" ? "active" : ""}`} // Match "Teachers"
                onClick={() => setActiveTab("Teachers")} // Set active tab to "Teachers"
              >
                Teacher
              </button>
            </div>
          </div>
        </>
      )}

      {/* Progress Modal */}
      {showProgressModal && selectedUser && (
        <div className="progress-modal">
          <button
            className="btn btn-close"
            onClick={handleCloseProgressModal}
          ></button>
          <div className="progress-modal-content">
            <h3>{selectedUser.name}'s Progress</h3>
            {/* Add progress details here */}
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="popup-form"
          style={{
            position: "fixed",
            top: "40%",
            left: "53%",
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
            {formMode === "edit" ? `Edit ${formType} ` : `Add ${formType} `}
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
            <button
              type="submit"
              className="btn"
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#4A2574",
                color: "#FFFFFF",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1.4rem",
                padding: "10px",
                height: "56px",
                width: "97%",
                marginBottom: "10px",
              }}
            >
              Create
            </button>

            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#D7443E",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  padding: "15px",
                  height: "56px",
                  width: "97%",
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

      {!showLeaderboard && (
        <div className="logout-container">
          <button
            onClick={() => {
              localStorage.removeItem("token"); // Clear the token
              navigate("/login"); // Redirect to the login page
            }}
            className="btn"
            style={{
              color: "#FFFFFF",
              borderRadius: "50px",
              padding: "10px 20px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              marginRight: "30px",
              height: "60px",
              fontSize: "1.5rem",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
