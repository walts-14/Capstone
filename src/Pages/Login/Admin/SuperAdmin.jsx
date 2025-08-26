// SuperAdmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import EditIcon from "../../../assets/Edit.png";
import RemoveIcon from "../../../assets/Remove.png";
import DashboardIcon from "../../../assets/dashboardlogo.png";
import LeaderboardIcon from "../../../assets/leaderboardicon.png";
import axios from "../../api.js";
import toast from "react-hot-toast";
import SidenavAdmins from "../../../Components/SidenavAdmins.jsx";
import ProgressTracker from "../../Dashboard/ProgressTracker";
import LbComponent from "../../Leaderboard/LbComponent";
import QRModal from "../../../Components/QRCode/QRModal.jsx";
import "../../../css/SuperAdmin.css";
import "../../../css/ProgressModal.css";

// Lightweight unwrap that prefers primitives and safely resolves { default: ... }
const unwrapDefault = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val !== "object") return val;
  if (Object.prototype.hasOwnProperty.call(val, "default")) return unwrapDefault(val.default);
  for (const v of Object.values(val)) {
    if (typeof v !== "object") return v;
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
};

// Sanitize only progress objects (guards against a `{ default: ... }` wrapper)
const sanitizeProgress = (progress) => {
  if (!progress || typeof progress !== "object") return progress || null;
  if (progress.default) return sanitizeProgress(progress.default);
  const sanitized = Array.isArray(progress) ? [] : {};
  for (const k in progress) {
    if (Object.prototype.hasOwnProperty.call(progress, k)) {
      const v = progress[k];
      if (v && typeof v === "object" && v.default) sanitized[k] = sanitizeProgress(v.default);
      else if (v && typeof v === "object") {
        // shallow sanitize lesson parts
        const sub = Array.isArray(v) ? [] : {};
        for (const sk in v) sub[sk] = (v[sk] && typeof v[sk] === "object" && v[sk].default) ? sanitizeProgress(v[sk].default) : v[sk];
        sanitized[k] = sub;
      } else sanitized[k] = v;
    }
  }
  return sanitized;
};

// Full-object fallback sanitizer for API responses (keeps primitives and unwraps `.default`)
const sanitizeObjectRecursive = (data) => {
  if (typeof data === "object" && data !== null) {
    if (data.default) return sanitizeObjectRecursive(data.default);
    const sanitized = Array.isArray(data) ? [] : {};
    for (const key in data) {
      sanitized[key] = sanitizeObjectRecursive(data[key]);
    }
    return sanitized;
  }
  return data;
};

const SuperAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // State
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const [isSubmitting, setIsSubmitting] = useState(false);

const [qrModalVisible, setQrModalVisible] = useState(false);
const [qrDataUrl, setQrDataUrl] = useState(null);
const [magicUrl, setMagicUrl] = useState(null);
const [qrStudentEmail, setQrStudentEmail] = useState(null);


  // Prepare a sanitized student object suitable for ProgressTracker
  const sanitizeUserForTracker = (user) => {
    if (!user || typeof user !== "object") return null;
    // Unwrap primitives we care about
    const name = unwrapDefault(user.name);
    const username = unwrapDefault(user.username);
    const email = unwrapDefault(user.email);
    const yearLevel = unwrapDefault(user.yearLevel);
    // Only sanitize progress shape — ProgressTracker expects progress grouped by level/lesson
    const progress = sanitizeProgress(user.progress || user.progress === null ? user.progress : null);

    return {
      ...user,
      name,
      username,
      email,
      yearLevel,
      progress,
    };
  };

  const handleClick = (user) => {
    // Sanitize minimal fields and progress, then open tracker
    const sanitizedUser = sanitizeUserForTracker(user) || sanitizeObjectRecursive(user);
    console.log("SuperAdmin: opening ProgressTracker for", sanitizedUser?.email || sanitizedUser?.username || sanitizedUser);
    setShowProgressTracker(sanitizedUser);
  };

  const handleClose = () => {
    setShowProgressTracker(null);
  };

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    yearLevel: "",
  });

  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUsers();
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async (grade = "") => {
    try {
      const url = grade
        ? `/api/superadmin/users/year/${encodeURIComponent(grade)}`
        : `/api/superadmin/users`;
      const res = await axios.get(url, { baseURL: "http://localhost:5000" });
      const raw = res.data.data || [];
      // Keep raw list but sanitize each user shallowly so UI renders safely
      setUsers(raw.map(u => sanitizeObjectRecursive(u)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users.");
    }
  };

  const fetchTeachers = async (grade = "") => {
    try {
      const url = grade
        ? `/api/superadmin/admins/year/${encodeURIComponent(grade)}`
        : `/api/superadmin/admins`;
      const res = await axios.get(url, { baseURL: "http://localhost:5000" });
      const raw = res.data.data || [];
      setTeachers(raw.map(t => sanitizeObjectRecursive(t)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teachers.");
    }
  };

  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
    if (activeTab === "Users") fetchUsers(grade);
    else fetchTeachers(grade);
  };

  const openForm = (mode = "create", user = null) => {
    setFormMode(mode);
    if (mode === "edit" && user) {
      setFormData({
        name: unwrapDefault(user.name),
        username: unwrapDefault(user.username),
        email: unwrapDefault(user.email),
        password: "",
        confirmPassword: "",
        yearLevel: unwrapDefault(user.yearLevel) || "",
      });
    } else {
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        yearLevel: selectedGrade || "",
      });
    }
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();

  // basic client validation
  if (formData.password !== formData.confirmPassword) {
    return toast.error("Passwords do not match!");
  }
  if (!formData.name || !formData.username || !formData.email) {
    return toast.error("All fields are required!");
  }

  setIsSubmitting(true);

  try {
    const payload = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password || undefined,
      yearLevel: formData.yearLevel || undefined,
      role: activeTab === "Teachers" ? "admin" : "user",
    };

    // Build URL depending on create/edit
    const urlBase = formMode === "edit"
      ? (activeTab === "Users"
          ? `/api/superadmin/users/${encodeURIComponent(formData.email)}`
          : `/api/superadmin/admins/${encodeURIComponent(formData.email)}`)
      : "/api/superadmin/create-account";

    const method = formMode === "edit" ? axios.put : axios.post;

    // CALL backend and capture response
    const res = await method(urlBase, payload); // uses axios baseURL from src/api.js
    console.log("create-account response:", res?.data);

    // IMPORTANT FIX: show QR modal when we just CREATED (formMode !== "edit")
    // previously code used `if (!formMode && returned?.qrDataUrl)` which never ran
    const returned = res?.data?.data;
    if (formMode !== "edit" && returned?.qrDataUrl) {
      setQrDataUrl(returned.qrDataUrl);
      setMagicUrl(returned.magicUrl || "");
      setQrStudentEmail(payload.email);
      setQrModalVisible(true);
    } else {
      // helpful debug info
      if (formMode !== "edit") console.log("No qrDataUrl in response:", returned);
    }

    toast.success(`${formMode === "edit" ? "Updated" : "Created"} ${activeTab}`);
    await fetchUsers(selectedGrade);
    await fetchTeachers(selectedGrade);
    setShowForm(false);
  } catch (err) {
    console.error("handleFormSubmit error:", err?.response?.data || err);
    const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
    toast.error(serverMsg || "Failed to submit form.");
  } finally {
    setIsSubmitting(false);
  }
};



  const handleDelete = async (email) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      const url =
        activeTab === "Users"
          ? `/api/superadmin/users/${encodeURIComponent(email)}`
          : `/api/superadmin/admins/${encodeURIComponent(email)}`;
      await axios.delete(url, { baseURL: "http://localhost:5000" });
      toast.success("Deleted successfully");
      fetchUsers(selectedGrade);
      fetchTeachers(selectedGrade);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="admin-body">
      <div className="sidebarr">
        <SidenavAdmins
          setSelectedGrade={setSelectedGrade}
          fetchStudents={activeTab === "Users" ? fetchUsers : fetchTeachers}
          setShowLeaderboard={setShowLeaderboard}
          showLeaderboard={showLeaderboard}
        />
      </div>

      {showLeaderboard ? (
        <div className="wrapper-lb" style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <LbComponent />
        </div>
      ) : (
        <>
          <div className="levels">
            {["Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((grade) => {
              const gradeClass = grade.replace(" ", "").toLowerCase();
              return (
                <div
                  key={grade}
                  className={`level-item ${gradeClass} ${selectedGrade === grade ? "active" : ""}`}
                  onClick={() => handleGradeSelection(grade)}
                >
                  {grade.toUpperCase()}
                </div>
              );
            })}
          </div>

          <div className="divtabs d-flex justify-content-center" style={{ zIndex: showProgressTracker ? 1 : 10 }}>
            <div className="tabs position-absolute">
              <button
                className={`tabss ${activeTab === "Users" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Users");
                  fetchUsers(selectedGrade);
                }}
              >
                Users
              </button>
              <button
                className={`tabss ${activeTab === "Teachers" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Teachers");
                  fetchTeachers(selectedGrade);
                }}
              >
                Teacher
              </button>
            </div>
          </div>

          <div className="table-container">
            <div className="Create">
              <button
                className="btn text-light px-1 py-1"
                style={{
                  backgroundColor: "#4A2574",
                  color: "#FFF",
                  borderRadius: 10,
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  padding: "30px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => openForm("create")}
              >
                <FaUserPlus /> Create
              </button>
            </div>

            <div className="contentdiv">
              <div className="table-wrapper">
                <table className="dashboard-table text-light">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      {activeTab === "Users" && <th>Year Level</th>}
                      <th className="actions-column"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataToDisplay.map((u, idx) => (
                      <tr key={unwrapDefault(u.email) || unwrapDefault(u.username) || idx}>
                        <td>{unwrapDefault(u.name) || "N/A"}</td>
                        <td>{unwrapDefault(u.username) || "N/A"}</td>
                        <td>{unwrapDefault(u.email) || "N/A"}</td>
                        {activeTab === "Users" && <td>{unwrapDefault(u.yearLevel) || "N/A"}</td>}
                        <td>
                          <div className="action-admin">
                            {activeTab === "Users" && (
                              <button
                                onClick={() => handleClick(u)}
                                className="btn text-white fs-5 px-3 py-2 rounded-4"
                                style={{ backgroundColor: "#2e86c1", border: "none", marginLeft: "2rem" }}
                              >
                                Progress
                              </button>
                            )}
                            <img
                              src={unwrapDefault(EditIcon)}
                              alt="Edit"
                              className="img-action"
                              style={{ cursor: "pointer" }}
                              onClick={() => openForm("edit", u)}
                            />
                            <img
                              src={unwrapDefault(RemoveIcon)}
                              alt="Remove"
                              className="img-action"
                              style={{ marginRight: "50px", cursor: "pointer" }}
                              onClick={() => handleDelete(unwrapDefault(u.email))}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

                {/* QR Modal */}
                {qrModalVisible && (
                  <QRModal
                    visible={qrModalVisible}
                    onClose={() => setQrModalVisible(false)}
                    dataUrl={qrDataUrl}
                    magicUrl={magicUrl}
                    studentEmail={qrStudentEmail}
                  />
                )}

          <div className="logout-container">
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>

          {showForm && (
            <div className="popup-form">
              <div className="popup-content">
                <h3>{formMode === "edit" ? "Edit" : "Add"} {activeTab.slice(0, -1)}</h3>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <input name="name" value={formData.name} onChange={handleInputChange} className="form-control" placeholder="Name" required />
                  </div>
                  <div className="form-group">
                    <input name="username" value={formData.username} onChange={handleInputChange} className="form-control" placeholder="Username" required />
                  </div>
                  <div className="form-group">
                    <select name="yearLevel" value={formData.yearLevel} onChange={handleInputChange} className="form-control" required>
                      <option value="">-- Select Year Level --</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" placeholder="Email" required />
                  </div>
                  <div className="form-group">
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control" placeholder="Password" required={formMode !== "edit"} />
                  </div>
                  <div className="form-group">
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="form-control" placeholder="Confirm Password" required={formMode !== "edit"} />
                  </div>
                  <div className="form-actions">
                   <button type="submit" className="btn-create" disabled={isSubmitting}>
  {isSubmitting ? (formMode === "edit" ? "Saving..." : "Creating...") : (formMode === "edit" ? "Save Changes" : "Create")}
</button>
                    <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Progress modal (SuperAdmin uses this) */}
          {showProgressTracker && (
            <div
              className="progress-modal-container"
              style={{
                top: "50%",
                transform: "translate(-40%, -50%)",
                width: "65vh",
                height: "90vh",
                borderRadius: "30px",
                zIndex: 1000,
                backgroundColor: "#1a1230",
                border: "3px solid #7338a0",
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                right: "20%",
              }}
            >
              <div style={{ position: "fixed", top: "15px", right: "92%", zIndex: 2 }}>
                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close" style={{ backgroundColor: "red", borderRadius: "20%", padding: "4px" }}></button>
              </div>

              {/* key ensures remount when different student is opened */}
              <ProgressTracker key={unwrapDefault(showProgressTracker.email) || unwrapDefault(showProgressTracker.username) || Date.now()} student={showProgressTracker} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuperAdmin;
