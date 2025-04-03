import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png"; 
import RemoveIcon from "../../../assets/Remove.png"; 
import "../../../css/Admin.css";

const DashboardAdmin = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Curry", username: "curry123", email: "Curry@gmail.com", password: "********" },
    { id: 2, name: "EDNIS", username: "ednis456", email: "SINDI@gmail.com", password: "********" },
    { id: 3, name: "EDNIS", username: "ednis789", email: "SINDI@gmail.com", password: "********" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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

    const updatedUser = {
      id: formData.id || users.length + 1, // Use existing ID if editing
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    if (formData.id) {
      // Editing an existing user
      const updatedUsers = users.map((user) =>
        user.id === formData.id ? updatedUser : user
      );
      setUsers(updatedUsers);
    } else {
      // Adding a new user
      setUsers([...users, updatedUser]);
    }

    // Reset form data
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(false);
  };

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (confirmDelete) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setFormData({
        id: userToEdit.id, // Include the ID to indicate edit mode
        name: userToEdit.name,
        username: userToEdit.username,
        email: userToEdit.email || "",
        password: userToEdit.password,
        confirmPassword: userToEdit.password, // Pre-fill confirm password
      });
      setShowForm(true); // Show the form for editing
    }
  };

  return (
    <div className="admin-body"> 
    <div className="DashboardAdmin">
          <h2>
            Dashboard
          </h2>
      </div>
      <div className="Create ">
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
            // Reset formData for creating a new user
            setFormData({
              id: null, // Ensure no ID is set for new users
              name: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            setShowForm(true); // Show the form
          }}
        >
          <FaUserPlus /> Create
        </button>
      </div>

      {showForm && (
        <div
          className="popup-form"
          style={{
            position: "fixed",
            top: "35%",
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
            {formData.id ? "Edit Account" : "Add Account"} {/* Dynamic title */}
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
                placeholder="New Password"
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
                placeholder="Confirm New Password"
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
            <button
              type="submit"
              className="btn-create"
              style={{
                backgroundColor: "#4A2574",
                color: "#FFFFFF",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1.2rem",
                padding: "10px 20px",
                marginRight: "10px",
              }}
            >
              {formData.id ? "Save Changes" : "Create"} {/* Dynamic button text */}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
              style={{
                backgroundColor: "#D7443E",
                color: "#FFFFFF",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1.2rem",
                padding: "10px 20px",
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    <div className="contentdiv">
      <table
        className="dashboard-table text-light mt-4"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#3F3653" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#3F3653" : "#271D3E",
                color: "#FFFFFF",
              }}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <img
                  src={EditIcon}
                  alt="Edit"
                  className="img-action"
                  style={{
                    marginRight: "30px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const userToEdit = users.find((user) => user.id === user.id); // Find the user by ID
                    if (userToEdit) {
                      setFormData({
                        id: userToEdit.id, // Set the ID to indicate edit mode
                        name: userToEdit.name,
                        username: userToEdit.username,
                        email: userToEdit.email || "",
                        password: userToEdit.password,
                        confirmPassword: userToEdit.password, // Pre-fill confirm password
                      });
                      setShowForm(true); // Show the form for editing
                    }
                  }}
                />
                <img
                  src={RemoveIcon}
                  alt="Remove"
                  className="img-action"
                  onClick={() => handleDeleteUser(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div
        className="Logout mt-3"
        style={{
          display: "flex",
          justifyContent: "center", // Center the button horizontally
          marginTop: "20px", // Add spacing from the table
        }}
      >
        <div className="admin-logout">
        <button
          className="btn-logout px-4 py-3"
          style={{
            backgroundColor: "#D7443E",
            color: "#FFFFFF",
            borderRadius: "40px",
            fontWeight: "bold",
            fontSize: "1.5rem",
            padding: "10px 30px", // Adjust padding for better appearance
          }}
        >
          Log out
        </button>
      </div>
    </div>
    </div>
  );
};

export default DashboardAdmin;
