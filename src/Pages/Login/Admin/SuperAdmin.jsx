import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/SuperAdmin.css";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressTracker from "../../Dashboard/ProgressTracker";

const SuperAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [users, setUsers] = useState([]); // Students (role: "user")
  const [teachers, setTeachers] = useState([]); // Teachers (role: "admin")
  const [activeTab, setActiveTab] = useState("Users");
  const [showForm, setShowForm] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formType, setFormType] = useState(""); // "Student" or "Teacher"
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const handleClick = () => {
    setShowProgressTracker(true);
  };
  const handleClose = () => {
    setShowProgressTracker(false);
  };

  // Set token on axios default headers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token from localStorage:", token);
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

    // Map formType to role: "Teacher" becomes "admin", "Student" becomes "user"
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
        // Remove email from the request body since it's in the URL
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
      setShowForm(true);
    }
  };

  const handleCreateUser = () => {
    setShowSelectionModal(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loggedIn");
    window.location.reload();
  };

  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="superadmin-body">
      <div className="Dashboard">
        <div className="AdminDashboard">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Dashboard</h2>
          </div>
        </div>

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
                  <td>
                    <div className="action-superadmin">
                      {!showProgressTracker ? (
                        <button
                          onClick={handleClick}
                          className="btn text-white fs-5 px-3 py-2 rounded-4"
                          style={{
                            backgroundColor: "#2e86c1",
                            border: "none",
                          }}
                        >
                          Progress
                        </button>
                      ) : (
                        <div
                          className="d-flex flex-column align-items-end p-3"
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "65%",
                            transform: "translateX(-50%)",
                            borderRadius: "10px",
                            maxWidth: "90%",
                            width: "fit-content", // smaller width
                          }}
                        >
                          <button
                            type="button"
                            className="btn-close mb-2"
                            aria-label="Close"
                            onClick={handleClose}
                          ></button>

                          <div className="d-flex align-items-center gap-3 px-3 pb-3">
                            <ProgressTracker />
                          </div>
                        </div>
                      )}

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
                        style={{ marginRight: "30px", cursor: "pointer" }}
                        onClick={() =>
                          handleDeleteUser(entry.email, entry.role)
                        }
                      />
                    </div>
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
                    border: "1px solid #6F687E",
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
                    border: "1px solid #6F687E",
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
                    border: "1px solid #6F687E",
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
                    border: "1px solid #6F687E",
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
                    border: "1px solid #6F687E",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                  required
                />
              </div>
              <div className="d-flex justify-content-center align-items-center">
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
                    width: "100%",
                  }}
                >
                  Submit
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
          style={{ textAlign: "right", marginBottom: "10px" }}
        >
          <button
            onClick={logout}
            className="btn btn-danger"
            style={{
              backgroundColor: "#D9534F",
              color: "#FFFFFF",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
