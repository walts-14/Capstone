// SuperAdmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import EditIconImport from "../../../assets/Edit.png";
import RemoveIconImport from "../../../assets/Remove.png";
import DashboardIconImport from "../../../assets/dashboardlogo.png";
import LeaderboardIconImport from "../../../assets/leaderboardicon.png";
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
  if (Object.prototype.hasOwnProperty.call(val, "default"))
    return unwrapDefault(val.default);
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
      if (v && typeof v === "object" && v.default)
        sanitized[k] = sanitizeProgress(v.default);
      else if (v && typeof v === "object") {
        // shallow sanitize lesson parts
        const sub = Array.isArray(v) ? [] : {};
        for (const sk in v)
          sub[sk] =
            v[sk] && typeof v[sk] === "object" && v[sk].default
              ? sanitizeProgress(v[sk].default)
              : v[sk];
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

const mapMessage = (msg) => ({
  id: msg._id,
  sender:
    msg.senderId?.name || msg.senderId?.email || msg.senderRole || "SuperAdmin",
  grade: msg.grade || "",
  recipient:
    msg.studentName ||
    msg.teacherName ||
    (msg.recipientIds && msg.recipientIds.length ? "Admin" : ""),
  content: msg.body,
  createdAt: msg.createdAt,
});

const SuperAdmin = () => {
  // State for showing message form
  const [showMessageForm, setShowMessageForm] = useState(false);
  // State for new message form
  const [newMessage, setNewMessage] = useState({
    teacher: "",
    grade: "",
    student: "",
    content: "",
  });

  // State for sending to all admins
  const [sendToAllAdmins, setSendToAllAdmins] = useState(false);

  // Handler for plus button
  const handlePlusClick = () => {
    fetchUsers();
    fetchTeachers();
    // Do NOT fetch students until a grade is selected
    setShowMessageForm(true);
  };
  const handleMessageFormClose = () => {
    setShowMessageForm(false);
    setNewMessage({ teacher: "", grade: "", student: "", content: "" });
  };
  // Handler for form input
  const handleMessageInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));

    if (name === "grade") {
      // fetch students for that grade (these students are for monitoring / selection only)
      fetchStudentsForMessage(value);
      // optionally keep the modal's teacher list in sync:
      // fetchTeachers(value);
    }
  };
  // ...removed duplicate handleSendMessage...
  // Message popup state
  const [showMessagesPopup, setShowMessagesPopup] = useState(false);
  // Actual messages from backend
  const [messages, setMessages] = useState([]);

  const [messageStudents, setMessageStudents] = useState([]);

  const fetchStudentsForMessage = async (grade = "") => {
    if (!grade) return; // Do not call API if grade is not selected
    try {
      const url = `/api/messages/users/year/${encodeURIComponent(grade)}`;
      const res = await axios.get(url, {
        baseURL:
          import.meta.env.VITE_API_BASE ||
          "https://wesign-backend-cef3encxhphtg0ds.eastasia-01.azurewebsites.net",
      });
      const raw = res.data.data || [];
      setMessageStudents(raw.map((u) => sanitizeObjectRecursive(u)));
    } catch (err) {
      console.error("fetchStudentsForMessage error", err);
      toast.error("Failed to load students for selected grade.");
    }
  };

  // Fetch all messages sent by superadmin
  const fetchMessages = async () => {
    try {
      // Use the 'sent' endpoint which returns messages created by the logged-in sender
      // (the previous endpoint was for admin recipients and rejects non-admin roles)
      const res = await axios.get("/api/messages/sent", {
        baseURL: "",
      });
      const raw = Array.isArray(res.data) ? res.data : res.data || [];
      // Map server message objects into the UI-friendly shape
      const mapped = raw.map((m) => mapMessage(m));
      setMessages(mapped);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    if (showMessagesPopup) fetchMessages();
  }, [showMessagesPopup]);

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      !newMessage.content ||
      (!sendToAllAdmins && !newMessage.teacher && !newMessage.student)
    ) {
      toast.error(
        "Please select teacher/student or choose 'Send to All Admins' and enter message."
      );
      return;
    }
    setIsSubmitting(true);

    try {
      // If sending to all admins, collect all teacher IDs
      let recipientIds = [];
      let teacherName = "";
      let teacherId = null;
      if (sendToAllAdmins) {
        recipientIds = teachers.map((t) => t._id);
        teacherName = "All Admins";
      } else {
        teacherId = newMessage.teacher || null;
        const teacherObj = teachers.find(
          (t) => String(t._id) === String(teacherId)
        );
        teacherName = teacherObj
          ? teacherObj.name || teacherObj.username || teacherObj.email
          : "";
        if (teacherId) recipientIds = [teacherId];
      }

      // studentId from the users select (we set value to u._id)
      // existing studentId retrieval
      const studentId = newMessage.student || null;
      // find it in messageStudents (these are the grade-filtered students)
      const studentObj = messageStudents.find(
        (u) => String(u._id) === String(studentId)
      );
      const studentName = studentObj
        ? studentObj.name || studentObj.username || studentObj.email
        : "";

      const payload = {
        title: `${teacherName || "Teacher"} → ${studentName || "Student"}`,
        body: newMessage.content,
        grade: newMessage.grade,
        recipientIds,
        isBroadcast: sendToAllAdmins,
        teacherId: teacherId || null,
        teacherName,
        studentId: studentId || null,
        studentName,
      };

      const res = await axios.post("/api/messages", payload);
      toast.success(
        sendToAllAdmins ? "Message sent to all admins" : "Message sent"
      );
      setShowMessageForm(false);
      setNewMessage({ teacher: "", grade: "", student: "", content: "" });
      setSendToAllAdmins(false);
      await fetchMessages(); // refresh superadmin's sent list
    } catch (err) {
      console.error("Failed to send message:", err?.response?.data || err);
      const msg = err?.response?.data?.message || "Failed to send message";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for message button
  const handleMessageButtonClick = () => {
    setShowMessagesPopup(true);
  };
  const handleCloseMessagesPopup = () => {
    setShowMessagesPopup(false);
    setShowMessageForm(false);
    setNewMessage({ teacher: "", grade: "", student: "", content: "" });
  };
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

  // Add state for editing message
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editMsgForm, setEditMsgForm] = useState({
    teacher: "",
    grade: "",
    student: "",
    content: "",
  });

  // Prepare a sanitized student object suitable for ProgressTracker
  const sanitizeUserForTracker = (user) => {
    if (!user || typeof user !== "object") return null;
    // Unwrap primitives we care about
    const name = unwrapDefault(user.name);
    const username = unwrapDefault(user.username);
    const email = unwrapDefault(user.email);
    const yearLevel = unwrapDefault(user.yearLevel);
    // Only sanitize progress shape — ProgressTracker expects progress grouped by level/lesson
    const progress = sanitizeProgress(
      user.progress || user.progress === null ? user.progress : null
    );

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
    const sanitizedUser =
      sanitizeUserForTracker(user) || sanitizeObjectRecursive(user);
    console.log(
      "SuperAdmin: opening ProgressTracker for",
      sanitizedUser?.email || sanitizedUser?.username || sanitizedUser
    );
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
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUsers();
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async (grade = "") => {
    try {
      const url = grade
        ? `/api/superadmin/users/year/${encodeURIComponent(grade)}`
        : `/api/superadmin/users`;
      const res = await axios.get(url, {
        baseURL:
          import.meta.env.VITE_API_BASE ||
          "https://wesign-backend-cef3encxhphtg0ds.eastasia-01.azurewebsites.net",
      });
      const raw = res.data.data || [];
      // Keep raw list but sanitize each user shallowly so UI renders safely
      setUsers(raw.map((u) => sanitizeObjectRecursive(u)));
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
      const res = await axios.get(url, {
        baseURL:
          import.meta.env.VITE_API_BASE ||
          "https://wesign-backend-cef3encxhphtg0ds.eastasia-01.azurewebsites.net",
      });
      const raw = res.data.data || [];
      setTeachers(raw.map((t) => sanitizeObjectRecursive(t)));
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

      const urlBase =
        formMode === "edit"
          ? activeTab === "Users"
            ? `/api/superadmin/users/${encodeURIComponent(formData.email)}`
            : `/api/superadmin/admins/${encodeURIComponent(formData.email)}`
          : "/api/superadmin/create-account";

      const method = formMode === "edit" ? axios.put : axios.post;
      const res = await method(urlBase, payload);
      const returned = res?.data?.data;

      // Show QR modal for both admin and user after creation (backend now sends QR for both)
      if (formMode !== "edit" && (returned?.qrDataUrl || returned?.magicUrl)) {
        setQrDataUrl(returned.qrDataUrl || null);
        setMagicUrl(returned.magicUrl || null);
        setQrStudentEmail(returned.user?.email || payload.email);
        setQrModalVisible(true);
      } else {
        if (formMode !== "edit")
          console.log("No qrDataUrl or magicUrl in response:", returned);
      }

      toast.success(
        `${formMode === "edit" ? "Updated" : "Created"} ${activeTab}`
      );
      await fetchUsers(formData.yearLevel);
      setSelectedGrade(formData.yearLevel);
      setShowForm(false);
    } catch (error) {
      console.error("handleFormSubmit error:", error?.response?.data || error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message;
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
      await axios.delete(url, { baseURL: "" });
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

  // Handler for clicking a message to edit
  // Handler for clicking a message to edit — uses real data
  const handleEditMsg = (msg) => {
    // msg is the mapped object with msg.raw === original server message
    const raw = msg.raw || {};

    // Prefer canonical ids when available (teacherId/studentId), otherwise fallback to names
    const teacherId = raw.teacherId || raw.teacher || "";
    const teacherName =
      raw.teacherName ||
      (raw.senderId && (raw.senderId.name || raw.senderId.email)) ||
      msg.sender ||
      "";
    const studentId = raw.studentId || raw.student || "";
    const studentName = raw.studentName || msg.recipient || "";
    const grade = raw.grade || msg.grade || "";

    setEditingMsgId(msg.id);

    setEditMsgForm({
      teacher: teacherId || teacherName, // value may be an id or name depending on available data
      grade,
      student: studentId || studentName,
      content: msg.content || raw.body || raw.text || "",
    });

    // Preload students for this grade so edit dropdown is populated
    if (grade) fetchStudentsForMessage(grade);
  };

  // Handler for edit form changes
  const handleEditMsgFormChange = (e) => {
    const { name, value } = e.target;
    setEditMsgForm((prev) => ({ ...prev, [name]: value }));

    // if grade changed in edit modal, fetch students for that grade
    if (name === "grade") {
      // normalize grade value to the same format used elsewhere, if necessary
      fetchStudentsForMessage(value);
    }
  };

  // Handler for apply changes

  // Apply edited message to backend and update UI (robust + debug)
  const handleApplyMsgEdit = async (e) => {
    e.preventDefault();
    if (!editingMsgId) return toast.error("No message selected to edit.");
    if (!editMsgForm.content || !editMsgForm.content.trim())
      return toast.error("Message content cannot be empty.");

    setIsSubmitting(true);

    try {
      // --- Debug: show token and editing id ---
      const token = localStorage.getItem("token");
      console.log("handleApplyMsgEdit: token:", token);
      if (!token) {
        toast.error("Not authenticated. Please login.");
        setIsSubmitting(false);
        return;
      }

      const url = `/api/messages/edit/${encodeURIComponent(editingMsgId)}`;

      // Resolve teacher/student objects where possible
      const teacherObj = teachers.find(
        (t) => String(t._id) === String(editMsgForm.teacher)
      );
      const studentObj =
        messageStudents.find(
          (s) => String(s._id) === String(editMsgForm.student)
        ) ||
        messageStudents.find((s) => s.email && s.email === editMsgForm.student);

      const payload = {
        body: editMsgForm.content.trim(),
        grade: editMsgForm.grade,
        teacherId: teacherObj ? teacherObj._id : undefined,
        teacherName: teacherObj
          ? teacherObj.name || teacherObj.email || teacherObj.username
          : editMsgForm.teacher,
        studentId: studentObj ? studentObj._id : undefined,
        studentName: studentObj
          ? studentObj.name || studentObj.email || studentObj.username
          : editMsgForm.student,
      };

      // Build headers explicitly
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log(
        "handleApplyMsgEdit: PUT",
        url,
        "payload:",
        payload,
        "headers:",
        headers
      );

      const res = await axios.put(url, payload, {
        baseURL:
          import.meta.env.VITE_API_BASE ||
          "https://wesign-backend-cef3encxhphtg0ds.eastasia-01.azurewebsites.net",
        headers,
      });

      const updated = res?.data?.updatedMessage || res?.data || null;
      console.log("handleApplyMsgEdit: response:", res?.status, res?.data);

      if (updated && (updated._id || updated.id)) {
        const mapped = mapMessage(updated);
        const newItem = { ...mapped, raw: updated };
        setMessages((prev) =>
          prev.map((m) => (m.id === mapped.id ? newItem : m))
        );
        toast.success("Message updated");
      } else {
        // fallback local update
        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingMsgId
              ? {
                  ...m,
                  sender: teacherObj
                    ? teacherObj.name || teacherObj.email
                    : m.sender,
                  grade: editMsgForm.grade,
                  recipient: studentObj
                    ? studentObj.name || studentObj.email
                    : m.recipient,
                  content: editMsgForm.content,
                }
              : m
          )
        );
        toast.success("Message updated (local)");
      }

      setEditingMsgId(null);
    } catch (err) {
      console.error("handleApplyMsgEdit error:", err?.response?.data || err);

      // If axios error and backend returned 401
      if (
        err?.response?.status === 401 ||
        (err?.response?.data && err.response.data.message === "Unauthorized")
      ) {
        toast.error("Session expired or unauthorized. Please login again.");
        // optional: redirect to login
        // navigate('/login');
        setEditingMsgId(null);
        setIsSubmitting(false);
        return;
      }

      const msg = err?.response?.data?.message || "Failed to update message";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for delete message
  // Delete message both in DB and UI
  // Delete message both in DB and UI (robust + debug)
  const handleDeleteMsg = async () => {
    if (!editingMsgId) {
      toast.error("No message selected to delete.");
      return;
    }
    if (!window.confirm("Delete this message? This cannot be undone.")) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      console.log("handleDeleteMsg: token:", token);
      if (!token) {
        toast.error("Not authenticated. Please login.");
        setIsSubmitting(false);
        return;
      }

      const url = `/api/messages/${encodeURIComponent(editingMsgId)}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("handleDeleteMsg: DELETE", url, "headers:", headers);

      const res = await axios.delete(url, {
        baseURL:
          import.meta.env.VITE_API_BASE ||
          "https://wesign-backend-cef3encxhphtg0ds.eastasia-01.azurewebsites.net",
        headers,
      });

      console.log("handleDeleteMsg: response:", res?.status, res?.data);

      // remove from UI
      setMessages((prev) => prev.filter((m) => m.id !== editingMsgId));
      setEditingMsgId(null);
      toast.success("Message deleted");
    } catch (err) {
      console.error("handleDeleteMsg error:", err?.response?.data || err);
      if (err?.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        // navigate('/login'); // optional redirect
        setIsSubmitting(false);
        return;
      }
      const msg = err?.response?.data?.message || "Failed to delete message";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataToDisplay = activeTab === "Users" ? users : teachers;

  return (
    <div className="holy-grail-layout">
      {/* Sidebar */}
      <aside className="holy-grail-sidebar">
        <SidenavAdmins
          setSelectedGrade={setSelectedGrade}
          fetchStudents={activeTab === "Users" ? fetchUsers : fetchTeachers}
          setShowLeaderboard={setShowLeaderboard}
          showLeaderboard={showLeaderboard}
          role="superadmin"
        />
      </aside>

      {/* Main Content Wrapper */}
      <div className="holy-grail-content-wrapper">
        {/* Header */}
        <header className="holy-grail-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "1rem",
            }}
          >
            <h1 className="supertitle" style={{ margin: 0, fontSize: "2rem" }}>
              Super Admin Dashboard
            </h1>
            {!showLeaderboard && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={`tabss ${activeTab === "Users" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("Users");
                    fetchUsers(selectedGrade);
                  }}
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "1.2rem",
                    border:
                      activeTab === "Users"
                        ? "3px solid #fff"
                        : "3px solid transparent",
                    backgroundColor:
                      activeTab === "Users" ? "#fff" : "rgba(255,255,255,0.2)",
                    color: activeTab === "Users" ? "#3a86d1" : "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                >
                  Student
                </button>
                <button
                  className={`tabss ${
                    activeTab === "Teachers" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("Teachers");
                    fetchTeachers(selectedGrade);
                  }}
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "1.2rem",
                    border:
                      activeTab === "Teachers"
                        ? "3px solid #fff"
                        : "3px solid transparent",
                    backgroundColor:
                      activeTab === "Teachers"
                        ? "#fff"
                        : "rgba(255,255,255,0.2)",
                    color: activeTab === "Teachers" ? "#3a86d1" : "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                >
                  Teacher
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="holy-grail-main">
          {showLeaderboard ? (
            <div className="wrapper-lb">
              <LbComponent />
            </div>
          ) : (
            <div className="dashboard-main-content">
              {/* Levels moved to `SidenavAdmins.jsx` - removed duplicate grade buttons here */}

              <div className="">
                <div
                  className="Create"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ marginRight: "0rem" }}>
                    <button
                      className="btn text-light px-1 py-1"
                      style={{
                        backgroundColor: "#6C7294",
                        color: "#FFF",
                        borderRadius: 10,
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        padding: "30px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onClick={handleMessageButtonClick}
                    >
                      {/* Envelope icon SVG */}
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="24" rx="6" fill="#6C7294" />
                        <path
                          d="M4 8V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8Z"
                          stroke="#fff"
                          strokeWidth="2"
                        />
                        <path
                          d="M4 8L12 13L20 8"
                          stroke="#fff"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Messages Popup Modal */}
                  {showMessagesPopup && (
                    <div>
                      <div
                        className="message-popup-modal"
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "#fff",
                          borderRadius: "30px",
                          border: "2px solid #e0e0e0",
                          zIndex: 2000,
                          width: "600px",
                          height: "550px",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                          padding: "2rem 2.5rem 2rem 2.5rem",
                          display: "flex",
                          flexDirection: "column",
                          overflowY: "auto",
                        }}
                      >
                        {/* Close button - square, centered X */}
                        <button
                          type="button"
                          onClick={handleCloseMessagesPopup}
                          aria-label="Close"
                          className="message-close-btn"
                          style={{
                            position: "absolute",
                            top: "32px",
                            right: "14px",
                            backgroundColor: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            width: "48px",
                            height: "48px",
                            fontWeight: "bold",
                            fontSize: "2.2rem",
                            cursor: "pointer",
                            zIndex: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            ×
                          </span>
                        </button>
                        {/* Plus icon */}
                        <button
                          type="button"
                          aria-label="Add Message"
                          className="message-add-btn"
                          style={{
                            position: "absolute",
                            top: "32px",
                            right: "75px",
                            backgroundColor: "#7338a0",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2.2rem",
                            cursor: "pointer",
                          }}
                          onClick={handlePlusClick}
                        >
                          <span
                            style={{ fontSize: "2.7rem", fontWeight: "bold" }}
                          >
                            +
                          </span>
                        </button>
                        <h2
                          className="message-title"
                          style={{
                            color: "#222",
                            fontWeight: "bold",
                            fontSize: "2.2rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          Message
                        </h2>
                        {/* Message Form Popup */}
                        {showMessageForm && (
                          <div
                            className="message-form-modal"
                            style={{
                              position: "fixed",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              background: "#fff",
                              borderRadius: "20px",
                              border: "2px solid #e0e0e0",
                              zIndex: 3000,
                              width: "400px",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                              padding: "2rem 2rem 1.5rem 2rem",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-start",
                            }}
                          >
                            <button
                              type="button"
                              onClick={handleMessageFormClose}
                              aria-label="Close"
                              className="message-form-close-btn"
                              style={{
                                position: "absolute",
                                top: "18px",
                                right: "18px",
                                backgroundColor: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                zIndex: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                  height: "100%",
                                }}
                              >
                                ×
                              </span>
                            </button>
                            <h2
                              className="message-form-title"
                              style={{
                                color: "#222",
                                fontWeight: "bold",
                                fontSize: "2rem",
                                marginBottom: "1.5rem",
                                textAlign: "center",
                              }}
                            >
                              Message
                            </h2>
                            <form onSubmit={handleSendMessage}>
                              <div style={{ marginBottom: "1rem" }}>
                                <div style={{ marginBottom: "0.7rem" }}>
                                  <label
                                    style={{
                                      color: "#222222",
                                      fontWeight: "bold",
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={sendToAllAdmins}
                                      onChange={(e) =>
                                        setSendToAllAdmins(e.target.checked)
                                      }
                                      style={{ marginRight: "0.5rem" }}
                                    />
                                    Send to All Admins
                                  </label>
                                </div>
                                <select
                                  name="teacher"
                                  value={newMessage.teacher}
                                  onChange={handleMessageInputChange}
                                  style={{
                                    width: "100%",
                                    padding: "0.8rem",
                                    borderRadius: "10px",
                                    background: "#e9e9ee",
                                    color: "#222",
                                    border: "1px solid #bdbdbd",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.7rem",
                                  }}
                                  disabled={sendToAllAdmins}
                                >
                                  <option value="">Select Teacher</option>
                                  {teachers.map((t) => (
                                    <option key={t._id} value={t._id}>
                                      {t.name || t.username || t.email}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  name="grade"
                                  value={newMessage.grade}
                                  onChange={handleMessageInputChange}
                                  style={{
                                    width: "100%",
                                    padding: "0.8rem",
                                    borderRadius: "10px",
                                    background: "#e9e9ee",
                                    color: "#222",
                                    border: "1px solid #bdbdbd",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.7rem",
                                  }}
                                >
                                  <option value="">Grade</option>
                                  <option value="GRADE 7">GRADE 7</option>
                                  <option value="GRADE 8">GRADE 8</option>
                                  <option value="GRADE 9">GRADE 9</option>
                                  <option value="GRADE 10">GRADE 10</option>
                                  <option value="GRADE 11">GRADE 11</option>
                                  <option value="GRADE 12">GRADE 12</option>
                                </select>
                                <select
                                  name="student"
                                  value={newMessage.student}
                                  onChange={handleMessageInputChange}
                                  style={{
                                    width: "100%",
                                    padding: "0.8rem",
                                    borderRadius: "10px",
                                    background: "#e9e9ee",
                                    color: "#222",
                                    border: "1px solid #bdbdbd",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.7rem",
                                  }}
                                >
                                  <option value="">Select Student</option>
                                  {messageStudents.map((u) => (
                                    <option
                                      key={u._id || u.email}
                                      value={u._id || u.email}
                                    >
                                      {u.name || u.username || u.email}
                                    </option>
                                  ))}
                                </select>
                                <textarea
                                  name="content"
                                  value={newMessage.content}
                                  onChange={handleMessageInputChange}
                                  placeholder="Message"
                                  style={{
                                    width: "100%",
                                    minHeight: "120px",
                                    borderRadius: "10px",
                                    background: "#e9e9ee",
                                    color: "#222",
                                    border: "1px solid #bdbdbd",
                                    fontSize: "1.1rem",
                                    padding: "0.8rem",
                                  }}
                                />
                              </div>
                              <button
                                type="submit"
                                style={{
                                  width: "100%",
                                  background: "#1976d2",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "10px",
                                  fontWeight: "bold",
                                  fontSize: "1.5rem",
                                  padding: "0.7rem 0",
                                  marginTop: "0.5rem",
                                  cursor: "pointer",
                                }}
                              >
                                Send
                              </button>
                            </form>
                          </div>
                        )}
                        <div
                          style={{
                            width: "100%",
                            marginTop: "1rem",
                            flex: 1,
                            overflowY: "auto",
                          }}
                        >
                          {editingMsgId === null ? (
                            messages.length === 0 ? (
                              <div
                                style={{ color: "#222", textAlign: "center" }}
                              >
                                No messages found.
                              </div>
                            ) : (
                              messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className="message-card"
                                  style={{
                                    background: "#2d2342",
                                    borderRadius: "15px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    color: "#fff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEditMsg(msg)}
                                >
                                  <div
                                    className="message-tags"
                                    style={{ marginBottom: "0.5rem" }}
                                  >
                                    <span
                                      className="message-tag"
                                      style={{
                                        background: "#f7c948",
                                        color: "#222",
                                        borderRadius: "7px",
                                        padding: "0.2rem 0.7rem",
                                        fontWeight: "bold",
                                        marginRight: "0.5rem",
                                      }}
                                    >
                                      {msg.sender}
                                    </span>
                                    <span
                                      className="message-tag"
                                      style={{
                                        background: "#7c6ae3",
                                        color: "#fff",
                                        borderRadius: "7px",
                                        padding: "0.2rem 0.7rem",
                                        fontWeight: "bold",
                                        marginRight: "0.5rem",
                                      }}
                                    >
                                      {msg.grade}
                                    </span>
                                    <span
                                      className="message-tag"
                                      style={{
                                        background: "#bdbdbd",
                                        color: "#222",
                                        borderRadius: "7px",
                                        padding: "0.2rem 0.7rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {msg.recipient}
                                    </span>
                                  </div>
                                  <div
                                    className="message-content"
                                    style={{ color: "#fff", fontSize: "1rem" }}
                                  >
                                    {msg.content}
                                  </div>
                                </div>
                              ))
                            )
                          ) : (
                            // Edit Message Form
                            <div
                              style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "#2d2342",
                                borderRadius: "20px",
                                border: "2px solid #7338a0",
                                zIndex: 3000,
                                width: "400px",
                                boxShadow: "0 0 20px #000",
                                padding: "2rem 2rem 1.5rem 2rem",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setEditingMsgId(null)}
                                aria-label="Close"
                                style={{
                                  position: "absolute",
                                  top: "18px",
                                  right: "18px",
                                  backgroundColor: "#e74c3c",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "8px",
                                  width: "32px",
                                  height: "32px",
                                  fontWeight: "bold",
                                  fontSize: "1.5rem",
                                  cursor: "pointer",
                                  zIndex: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  ×
                                </span>
                              </button>
                              <h2
                                style={{
                                  color: "#fff",
                                  fontWeight: "bold",
                                  fontSize: "2rem",
                                  marginBottom: "1.5rem",
                                  textAlign: "center",
                                }}
                              >
                                Message
                              </h2>
                              <form onSubmit={handleApplyMsgEdit}>
                                <div style={{ marginBottom: "1rem" }}>
                                  <select
                                    name="teacher"
                                    value={editMsgForm.teacher}
                                    onChange={handleEditMsgFormChange}
                                    style={{
                                      width: "100%",
                                      padding: "0.8rem",
                                      borderRadius: "10px",
                                      background: "#3c2e5e",
                                      color: "#fff",
                                      border: "none",
                                      fontSize: "1.1rem",
                                      marginBottom: "0.7rem",
                                    }}
                                    required
                                  >
                                    <option value="">Select Teacher</option>
                                    {teachers.map((t) => (
                                      <option key={t._id} value={t._id}>
                                        {t.name || t.username || t.email}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    name="grade"
                                    value={editMsgForm.grade}
                                    onChange={handleEditMsgFormChange}
                                    style={{
                                      width: "100%",
                                      padding: "0.8rem",
                                      borderRadius: "10px",
                                      background: "#3c2e5e",
                                      color: "#fff",
                                      border: "none",
                                      fontSize: "1.1rem",
                                      marginBottom: "0.7rem",
                                    }}
                                    required
                                  >
                                    <option value="">Grade</option>
                                    <option value="GRADE 7">GRADE 7</option>
                                    <option value="GRADE 8">GRADE 8</option>
                                    <option value="GRADE 9">GRADE 9</option>
                                    <option value="GRADE 10">GRADE 10</option>
                                    <option value="GRADE 11">GRADE 11</option>
                                    <option value="GRADE 12">GRADE 12</option>
                                  </select>
                                  <select
                                    name="student"
                                    value={editMsgForm.student}
                                    onChange={handleEditMsgFormChange}
                                    style={{
                                      width: "100%",
                                      padding: "0.8rem",
                                      borderRadius: "10px",
                                      background: "#3c2e5e",
                                      color: "#fff",
                                      border: "none",
                                      fontSize: "1.1rem",
                                      marginBottom: "0.7rem",
                                    }}
                                    required
                                  >
                                    <option value="">Select Student</option>
                                    {messageStudents.map((u) => (
                                      <option
                                        key={u._id || u.email}
                                        value={u._id || u.email}
                                      >
                                        {u.name || u.username || u.email}
                                      </option>
                                    ))}
                                  </select>
                                  <textarea
                                    name="content"
                                    value={editMsgForm.content}
                                    onChange={handleEditMsgFormChange}
                                    placeholder="Message"
                                    style={{
                                      width: "100%",
                                      minHeight: "120px",
                                      borderRadius: "10px",
                                      background: "#3c2e5e",
                                      color: "#fff",
                                      border: "2px solid #bdbdbd",
                                      fontSize: "1.1rem",
                                      padding: "0.8rem",
                                    }}
                                    required
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "1rem",
                                  }}
                                >
                                  <button
                                    type="submit"
                                    style={{
                                      background: "#7338a0",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "10px",
                                      fontWeight: "bold",
                                      fontSize: "1.5rem",
                                      padding: "0.7rem 2rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Apply
                                  </button>
                                  <button
                                    type="button"
                                    style={{
                                      background: "#e74c3c",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "10px",
                                      fontWeight: "bold",
                                      fontSize: "1.5rem",
                                      padding: "0.7rem 2rem",
                                      cursor: "pointer",
                                    }}
                                    onClick={handleDeleteMsg}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      className="btn text-light px-1 py-1"
                      style={{
                        backgroundColor: "#6C7294",
                        color: "#FFF",
                        borderRadius: 10,
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        padding: "30px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onClick={() => openForm("create")}
                    >
                      <FaUserPlus /> Create
                    </button>
                  </div>
                </div>

                <div className="contentsuper">
                  <div className="table-wrapper" style={{ marginTop: "1rem" }}>
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
                          <tr
                            key={
                              unwrapDefault(u.email) ||
                              unwrapDefault(u.username) ||
                              idx
                            }
                          >
                            <td>{unwrapDefault(u.name) || "N/A"}</td>
                            <td>{unwrapDefault(u.username) || "N/A"}</td>
                            <td>{unwrapDefault(u.email) || "N/A"}</td>
                            {activeTab === "Users" && (
                              <td>{unwrapDefault(u.yearLevel) || "N/A"}</td>
                            )}
                            <td>
                              <div className="d-flex gap-1 justify-contents-center align-items-center">
                                {activeTab === "Users" && (
                                  <button
                                    onClick={() => handleClick(u)}
                                    className="btn text-white fs-5 px-3 py-2 rounded-4"
                                    style={{
                                      backgroundColor: "#2E86C1",
                                      border: "none",
                                    }}
                                  >
                                    Progress
                                  </button>
                                )}
                                <img
                                  src={
                                    typeof EditIconImport === "object" &&
                                    EditIconImport !== null &&
                                    EditIconImport.default
                                      ? EditIconImport.default
                                      : EditIconImport
                                  }
                                  alt="Edit"
                                  className="img-action img-edit"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openForm("edit", u)}
                                />
                                <img
                                  src={
                                    typeof RemoveIconImport === "object" &&
                                    RemoveIconImport !== null &&
                                    RemoveIconImport.default
                                      ? RemoveIconImport.default
                                      : RemoveIconImport
                                  }
                                  alt="Remove"
                                  className="img-action"
                                  style={{
                                    marginRight: "50px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleDelete(unwrapDefault(u.email))
                                  }
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
              {(() => {
                console.log("SuperAdmin QR modal state:", {
                  qrModalVisible,
                  qrDataUrl,
                  magicUrl,
                  qrStudentEmail,
                });
                return qrModalVisible ? (
                  <QRModal
                    visible={qrModalVisible}
                    onClose={() => setQrModalVisible(false)}
                    dataUrl={qrDataUrl}
                    magicUrl={magicUrl}
                    studentEmail={qrStudentEmail}
                  />
                ) : null;
              })()}

              {showForm && (
                <>
                  {/* Modal overlay to darken background and block interaction */}
                  <div
                    className="edit-modal-overlay"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(20, 10, 40, 0.75)",
                      zIndex: 2999,
                      pointerEvents: "auto",
                    }}
                  />
                  <div
                    className="popup-form"
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#fff",
                      borderRadius: "20px",
                      border: "2px solid #e0e0e0",
                      zIndex: 3000,
                      width: "400px",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                      padding: "2rem 2rem 1.5rem 2rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div className="popup-content">
                      <h3
                        style={{
                          color: "#2d254c",
                          fontWeight: "bold",
                          fontSize: "2rem",
                          marginBottom: "1.5rem",
                          textAlign: "center",
                        }}
                      >
                        {formMode === "edit" ? "Edit" : "Add"}{" "}
                        {activeTab.slice(0, -1)}
                      </h3>
                      <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Name"
                            required
                            style={{
                              width: "100%",
                              marginBottom: "16px",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              background: "#6C7294",
                              color: "#fff",
                              fontSize: "1rem",
                              "::placeholder": { color: "#bfc3d1", opacity: 1 },
                            }}
                            placeholderTextColor="#bfc3d1"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-control text-yellow-400"
                            placeholder="Username"
                            required
                            style={{
                              width: "100%",
                              marginBottom: "16px",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              background: "#6C7294",
                              color: "#fff",
                              fontSize: "1rem",
                              "::placeholder": { color: "#bfc3d1", opacity: 1 },
                            }}
                            placeholderTextColor="#bfc3d1"
                          />
                        </div>
                        <div className="form-group">
                          <select
                            name="yearLevel"
                            value={formData.yearLevel}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            style={{
                              width: "100%",
                              marginBottom: "16px",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              background: "#6C7294",
                              color: "#fff",
                              fontSize: "1rem",
                            }}
                          >
                            <option value="" style={{ color: "#bfc3d1" }}>
                              -- Select Year Level --
                            </option>
                            <option value="Grade 7">Grade 7</option>
                            <option value="Grade 8">Grade 8</option>
                            <option value="Grade 9">Grade 9</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 11">Grade 11</option>
                            <option value="Grade 12">Grade 12</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Email"
                            required
                            style={{
                              width: "100%",
                              marginBottom: "16px",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              background: "#6C7294",
                              color: "#fff",
                              fontSize: "1rem",
                              "::placeholder": { color: "#bfc3d1", opacity: 1 },
                            }}
                            placeholderTextColor="#bfc3d1"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Your password"
                            required={formMode !== "edit"}
                            style={{
                              width: "100%",
                              marginBottom: "16px",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              background: "#6C7294",
                              color: "#fff",
                              fontSize: "1rem",
                              "::placeholder": { color: "#bfc3d1", opacity: 1 },
                            }}
                            placeholderTextColor="#bfc3d1"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Repeat password"
                            required={formMode !== "edit"}
                            style={{
                              width: "100%",
                              marginBottom: "16px",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              background: "#6C7294",
                              color: "#fff",
                              fontSize: "1rem",
                              "::placeholder": { color: "#bfc3d1", opacity: 1 },
                            }}
                            placeholderTextColor="#bfc3d1"
                          />
                        </div>
                        <div
                          className="form-actions"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            type="submit"
                            className="btn-create"
                            disabled={isSubmitting}
                            style={{
                              width: "100%",
                              padding: "12px 0",
                              borderRadius: "8px",
                              border: "none",
                              fontSize: "1rem",
                              fontWeight: "bold",
                              cursor: "pointer",
                              background: "#2563eb",
                              color: "#fff",
                            }}
                          >
                            {isSubmitting
                              ? formMode === "edit"
                                ? "Saving..."
                                : "Creating..."
                              : formMode === "edit"
                              ? "Save Changes"
                              : "Create"}
                          </button>
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setShowForm(false)}
                            style={{
                              width: "100%",
                              padding: "12px 0",
                              borderRadius: "8px",
                              border: "none",
                              fontSize: "1rem",
                              fontWeight: "bold",
                              cursor: "pointer",
                              background: "#ef4444",
                              color: "#fff",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}

              {/* Progress modal (SuperAdmin uses this) */}
              {showProgressTracker && (
                <>
                  {/* Overlay to darken background and block clicks */}
                  <div
                    className="progress-modal-overlay"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(20, 10, 40, 0.75)",
                      zIndex: 999,
                      pointerEvents: "auto",
                    }}
                  />
                  <div
                    className="progress-modal-container"
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-48%, -50%)", // shift content a bit to the left
                      width: "73vh",
                      height: "100vh",
                      borderRadius: "30px",
                      zIndex: 1001,
                      backgroundColor: "#1a1230",
                      border: "3px solid #7338a0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                      paddingLeft: "0", // remove left padding
                      paddingRight: "24px", // add a little right padding if needed
                    }}
                  >
                    {/* Close button in upper right, always on top */}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleClose}
                      aria-label="Close"
                      style={{
                        position: "absolute",
                        top: "18px",
                        right: "33rem",
                        backgroundColor: "#e9170f",
                        borderRadius: "20%",
                        padding: "4px",
                        width: "40px",
                        height: "40px",
                        fontSize: "2rem",
                        color: "#fff",
                        border: "none",
                        zIndex: 2000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      {/* Only white X, no black shadow or border */}
                     
                    </button>
                    <div
                      className="superadmin-progress-wrapper"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start", // align content to the left
                        paddingLeft: "12px", // add a bit of left padding for balance
                      }}
                    >
                      <ProgressTracker
                        key={
                          unwrapDefault(showProgressTracker.email) ||
                          unwrapDefault(showProgressTracker.username) ||
                          Date.now()
                        }
                        student={showProgressTracker}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="holy-grail-footer">
          <button
            className="btn-logout"
            onClick={logout}
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              fontFamily: "Baloo, sans-serif",
              fontSize: "1.5rem",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              padding: "0.75rem 2.5rem",
              transition: "all 0.3s ease",
            }}
          >
            Logout
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SuperAdmin;
