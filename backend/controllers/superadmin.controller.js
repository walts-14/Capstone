import bcrypt from "bcrypt";
import User from "../models/user.js";

/**
 * Create an Admin or Student Account.
 * Only a Super Admin (subject coordinator) is allowed to create accounts
 * with roles "admin" or "user".
 */
export const createAccount = async (req, res) => {
  try {
    const { name, username, email, password, role, yearLevel } = req.body;

    // Allow only "admin" or "user" roles.
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified. Allowed roles are 'admin' and 'user'." });
    }

    // Check if a user with the same email and role exists.
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = new User({ name, username, email, password, role, yearLevel });
    const validationError = user.validateSync();
    if (validationError) {
      return res.status(400).json({ message: "Validation error", error: validationError });
    }

    await user.save();
    res.status(201).json({
      message: `${role === "admin" ? "Admin" : "Student"} account created successfully.`,
      data: user,
    });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ message: "Error creating account", error: err.message });
  }
};

/**
 * Get all Student Accounts (role: "user") - Super Admin view.
 */
export const getAllStudentsSuper = async (req, res) => {
  try {
    const students = await User.find({ role: "user" });
    res.status(200).json({
      message: "Students retrieved successfully.",
      data: students,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving students", error: err.message });
  }
};

/**
 * Get all Admin Accounts (role: "admin") - Super Admin view.
 */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({
      message: "Admins retrieved successfully.",
      data: admins,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving admins", error: err.message });
  }
};

/**
 * Get a specific Admin Account by email.
 */
export const getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin retrieved successfully.",
      data: admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving admin", error: err.message });
  }
};

/**
 * Update an Admin Account by email.
 */
export const updateAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, username, newEmail, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (name) admin.name = name;
    if (username) admin.username = username;
    if (newEmail) admin.email = newEmail;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }
    await admin.save();
    res.json({
      message: "Admin account updated successfully.",
      data: admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating admin account", error: err.message });
  }
};

/**
 * Update a Student Account by email (Super Admin version).
 */
export const updateStudentByEmailSuper = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, username, newEmail, password, yearLevel } = req.body;
    const student = await User.findOne({ email, role: "user" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (name) student.name = name;
    if (username) student.username = username;
    if (newEmail) student.email = newEmail;
    if (yearLevel) student.yearLevel = yearLevel;
    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }
    await student.save();
    res.json({
      message: "Student account updated successfully.",
      data: student,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating student account", error: err.message });
  }
};

/**
 * Delete an account (Admin or Student) by email.
 * Accepts the role as a URL parameter (plural forms allowed).
 */
export const deleteAccountByEmail = async (req, res) => {
  try {
    let { role, email } = req.params;
    // Normalize role from plural to singular if necessary.
    if (role === "admins") role = "admin";
    if (role === "users") role = "user";
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    const user = await User.findOneAndDelete({ email, role });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User account deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user account", error: err.message });
  }
};

/**
 * Create a Super Admin Account.
 * Only one Super Admin account is allowed.
 */
export const createSuperAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const role = "super_admin";
    const existingSuperAdmin = await User.findOne({ role: "super_admin" });
    if (existingSuperAdmin) {
      return res.status(403).json({ message: "Super Admin account already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });
    await superAdmin.save();
    res.status(201).json({
      message: "Super Admin created successfully.",
      data: superAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating Super Admin", error: err.message });
  }
};

// Get Students by Year Level (Super Admin)
export const getStudentsByYearLevel = async (req, res) => {
  try {
    const { yearLevel } = req.params;

    const students = await User.find({ role: "user", yearLevel });
    if (!students.length) {
      return res.status(404).json({ message: "No students found for the specified year level." });
    }

    res.status(200).json({
      message: `Students from ${yearLevel} retrieved successfully.`,
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving students by year level",
      error: err.message,
    });
  }
};
