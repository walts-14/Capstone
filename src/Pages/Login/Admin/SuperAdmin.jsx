import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import "../../../css/SuperAdmin.css";

const SuperAdmin = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Curry", username: "curry123", email: "Curry@gmail.com", password: "********" },
    { id: 2, name: "EDNIS", username: "ednis456", email: "SINDI@gmail.com", password: "********" },
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: "Smith", username: "smith123", email: "Smith@gmail.com", password: "********" },
    { id: 2, name: "Taylor", username: "taylor456", email: "Taylor@gmail.com", password: "********" },
  ]);

  const [activeTab, setActiveTab] = useState("Users");
  const [showForm, setShowForm] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false); // For the selection modal
  const [formMode, setFormMode] = useState("create"); // Tracks whether it's "create" or "edit"
  const [formType, setFormType] = useState(""); // Tracks whether it's "Student" or "Teacher"
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updatedEntry = {
      id: formData.id || (formType === "Student" ? users.length + 1 : teachers.length + 1),
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    if (formMode === "edit") {
      // Editing an existing entry
      if (formType === "Student") {
        const updatedUsers = users.map((user) =>
          user.id === formData.id ? updatedEntry : user
        );
        setUsers(updatedUsers);
      } else {
        const updatedTeachers = teachers.map((teacher) =>
          teacher.id === formData.id ? updatedEntry : teacher
        );
        setTeachers(updatedTeachers);
      }
    } else {
      // Adding a new entry
      if (formType === "Student") {
        setUsers([...users, updatedEntry]); // Add to Users
        setActiveTab("Users"); // Switch to Users tab
      } else {
        setTeachers([...teachers, updatedEntry]); // Add to Teachers
        setActiveTab("Teacher"); // Switch to Teacher tab
      }
    }

    // Reset form data
    setFormData({
      id: null,
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(false); // Close the form
  };

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (confirmDelete) {
      if (activeTab === "Users") {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setTeachers(teachers.filter((teacher) => teacher.id !== id));
      }
    }
  };

  const handleEditUser = (id) => {
    const dataToEdit = activeTab === "Users"
      ? users.find((user) => user.id === id)
      : teachers.find((teacher) => teacher.id === id);

    if (dataToEdit) {
      setFormData({
        id: dataToEdit.id,
        name: dataToEdit.name,
        username: dataToEdit.username,
        email: dataToEdit.email || "",
        password: dataToEdit.password,
        confirmPassword: dataToEdit.password,
      });
      setFormMode("edit"); // Set form mode to "edit"
      setShowForm(true);
    }
  };

  const handleCreateUser = () => {
    setShowSelectionModal(true); // Open the selection modal
  };

  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="Dashboard">
      <div className="AdminDashboard">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Dashboard</h2>
        </div>
      </div>

      {/* Create Button */}
      <div className="CreateAccount">
        <button
          className="btn text-light px-6 py-4"
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

      {/* Table */}
      <div className="content">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.name}</td>
                <td>{entry.username}</td>
                <td>{entry.email}</td>
                <td>{entry.password}</td>
                <td>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="img-action"
                    style={{
                      marginRight: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleEditUser(entry.id)}
                  />
                  <img
                    src={RemoveIcon}
                    alt="Remove"
                    className="img-action"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteUser(entry.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
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
                type="text"
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
                placeholder="Your password"
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
                placeholder="Repeat password"
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
            <button type="submit" className="btn-create">
              {formMode === "edit" ? "Save Changes" : "Create"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Selection Modal */}
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
                setFormType("Student"); // Set form type to Student
                setShowSelectionModal(false); // Close the modal
                setShowForm(true); // Open the form
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
                setFormType("Teacher"); // Set form type to Teacher
                setShowSelectionModal(false); // Close the modal
                setShowForm(true); // Open the form
              }}
            >
              Teacher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
<div className="Logout">
<button
  className="btn-logout px-5 py-3"
  style={{
    backgroundColor: "#D7443E",
    color: "#FFFFFF",
    borderRadius: "30px",
    fontWeight: "bold",
    fontSize: "1.5rem",
    padding: "10px 30px", // Adjust padding for better appearance
  }}
>
  Log out
</button>
</div>
export default SuperAdmin;

