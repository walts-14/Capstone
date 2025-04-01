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
      id: formData.id || (activeTab === "Users" ? users.length + 1 : teachers.length + 1),
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    if (formData.id) {
      // Editing an existing entry
      if (activeTab === "Users") {
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
      if (activeTab === "Users") {
        setUsers([...users, updatedEntry]);
      } else {
        setTeachers([...teachers, updatedEntry]);
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
    setShowForm(false);
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
    console.log("Edit button clicked for ID:", id); // Debugging log

    const dataToEdit = activeTab === "Users" 
      ? users.find((user) => user.id === id) 
      : teachers.find((teacher) => teacher.id === id);

    if (dataToEdit) {
      setFormData({
        id: dataToEdit.id, // Include the ID to indicate edit mode
        name: dataToEdit.name,
        username: dataToEdit.username,
        email: dataToEdit.email || "",
        password: dataToEdit.password,
        confirmPassword: dataToEdit.password, // Pre-fill confirm password
      });
      setShowForm(true); // Show the form for editing
      console.log("Form data set for editing:", dataToEdit); // Debugging log
    }
  };

  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="Dashboard">
    <div
      className="container-fluid"
      style={{
        borderRadius: "10px",
        color: "#FFFFFF",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2
          className="text-light Dashboard px-5 py-2"
          style={{
            backgroundColor: "#7338A0",
            borderRadius: "10px",
            display: "inline-block",
            margin: "0",
          }}
        >
          Dashboard
        </h2>
      </div>
    </div>
      {/* Header */}
      <div className="Create ">
        <button
          className="btn text-light px-5 py-3"
          style={{
            backgroundColor: "#4A2574",
            color: "#FFFFFF",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.5rem", // Increase font size
            padding: "30px", // Increase padding
          }}
          onClick={() => {
            setShowForm(true);
            console.log("Form is now visible");
          }}
        >
          <FaUserPlus /> Create
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "Users" ? "active" : ""}`}
          onClick={() => setActiveTab("Users")}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === "Teacher" ? "active" : ""}`}
          onClick={() => setActiveTab("Teacher")}
        >
          Teacher
        </button>
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
              <th>Actions</th>
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

      {showForm && (
        <div
          className="popup-form"
          style={{
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
            {formData.id ? "Edit Account" : "Add Account"}
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
                  border: "1px solid #6F687E", // Add stroke with the specified color
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
                  border: "1px solid #6F687E", // Add stroke with the specified color
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
                  border: "1px solid #6F687E", // Add stroke with the specified color
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
                  border: "1px solid #6F687E", // Add stroke with the specified color
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
                  border: "1px solid #6F687E", // Add stroke with the specified color
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                required
              />
            </div>
            <button type="submit"
             className="btn-create">
              Create
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            ><script type="module" src=""></script>
              Cancel
            </button>
          </form>
        </div>
      )}
<div
        className="Logout mt-3"
        style={{
          display: "flex",
          justifyContent: "center", // Center the button horizontally
          marginTop: "20px", // Add spacing from the table
        }}
      >

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
      </div>
  );
};

export default SuperAdmin;