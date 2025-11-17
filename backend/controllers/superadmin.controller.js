import User from "../models/user.js";
import bcrypt from "bcrypt"; // Added bcrypt import
import { hashedPassword } from "../middlewares/auth.js";
import { createMagicToken } from "../src/services/magicToken.js";
import { toPngBuffer } from "../src/services/qr.js";
import { sendEmail } from "../src/services/mailer.js";

/**
 * Create a Super Admin Account.
 * Only one Super Admin account is allowed.
 */
export const createSuperAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const role = "super_admin";

    const existingSuperAdmin = await User.findOne({ role });
    if (existingSuperAdmin) {
      return res.status(403).json({ message: "Super Admin account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new User({ name, username, email, password: hashedPassword, role });
    await superAdmin.save();

    res.status(201).json({
      message: "Super Admin created successfully.",
      data: superAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating Super Admin", error: err.message });
  }
};

/**
 * Create an Admin or Student Account.
 * Only a Super Admin is allowed to create accounts with roles "admin" or "user".
 */
export const createAccount = async (req, res) => {
  try {
    const { name, username, email, password: rawPassword, role, yearLevel } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified. Allowed roles are 'admin' and 'user'."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Generate raw password if not provided
    const rawPwd = rawPassword || Math.random().toString(36).slice(-8);
    // hash password
    const password = await hashedPassword(rawPwd);

    const user = new User({ name, username, email, password, role, yearLevel });
    const validationError = user.validateSync();
    if (validationError) {
      return res.status(400).json({ message: "Validation error", error: validationError });
    }

    await user.save();

    // For user (student) create magic token + qr/email. For admin you may still email credentials.
    let qrDataUrl = null;
    let magicUrl = null;
    // Always generate QR and magic link for both admin and user
    const magicToken = await createMagicToken(user._id);
    // Prefer explicit BACKEND_URL env var (set this to your deployed backend domain)
    // Fallback to request origin or host so links generated from deployed frontend/backend use the correct domain
    const reqOrigin = req.get && (req.get('origin') || (req.protocol && req.get('host') ? `${req.protocol}://${req.get('host')}` : null));
    // Default to the deployed frontend domain. If you need a different backend host,
    // set BACKEND_URL in your environment (e.g. https://api.wesign.games).
    const backend = process.env.BACKEND_URL || reqOrigin || `https://www.wesign.games`;
    magicUrl = `${backend.replace(/\/$/, '')}/api/magic-login?token=${encodeURIComponent(magicToken)}`;
    const pngBuffer = await toPngBuffer(magicUrl);

    let html;
    if (role === "user") {
      html = `
        <h2>Welcome to WeSign, ${name}</h2>
        <p>Your account has been created by your coordinator/admin.</p>
        <p><strong>Login Info:</strong></p>
        <ul>
          <li>Email: ${email}</li>
          <li>Password: ${rawPwd}</li>
        </ul>
        <p>Scan the QR or click the link to login (link expires in ${process.env.MAGIC_TOKEN_MIN || 15} minutes):</p>
        <img src="cid:onboardingqr" alt="Onboarding QR" style="width:180px; height:auto;" />
        <p><a href="${magicUrl}">Open magic login link</a></p>
      `;
    } else {
      html = `
        <h2>Welcome, ${name}</h2>
        <p>An admin account has been created for you.</p>
        <ul><li>Email: ${email}</li><li>Password: ${rawPwd}</li></ul>
        <p>Scan the QR or click the link to login (link expires in ${process.env.MAGIC_TOKEN_MIN || 15} minutes):</p>
        <img src="cid:onboardingqr" alt="Onboarding QR" style="width:180px; height:auto;" />
        <p><a href="${magicUrl}">Open magic login link</a></p>
      `;
    }

    await sendEmail({
      to: email,
      subject: `Your WeSign ${role === "admin" ? "admin" : "account"}`,
      html,
      attachments: [{ filename: "onboarding-qr.png", content: pngBuffer, cid: "onboardingqr" }]
    });

    qrDataUrl = "data:image/png;base64," + pngBuffer.toString("base64");

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
      message: `${role === "admin" ? "Admin" : "Student"} account created successfully.`,
      data: { user: safeUser, qrDataUrl, magicUrl },
    });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ message: "Error creating account", error: err.message });
  }
};

/**
 * Get All Student Accounts (role: "user") - Super Admin view.
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
 * Get a specific Student Account by email (Super Admin).
 */
export const getStudentByEmailSuper = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await User.findOne({ email, role: "user" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving student", error: err.message });
  }
};

/**
 * Update a Student Account by email (Super Admin).
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
 * Delete an account (Admin or Student) by email.
 * Accepts the role as a URL parameter (plural forms allowed).
 */
export const deleteAccountByEmail = async (req, res) => {
  try {
    let { role, email } = req.params;
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
 * Get students by year level.
 */
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
    res.status(500).json({ message: "Error retrieving students by year level", error: err.message });
  }
};

/**
 * Get leaderboard (Top 10 by points) - Super Admin.
 */
export const getLeaderboardSuper = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "user" })
      .sort({ points: -1 })
      .limit(10);

    res.status(200).json({
      message: "Leaderboard retrieved successfully.",
      data: leaderboard,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving leaderboard", error: err.message });
  }
};

/**
 * Get a student's progress by user ID - Super Admin.
 */
export const getUserProgressSuper = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("progress");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User progress retrieved successfully.",
      data: user.progress,
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user progress", error: err.message });
  }
};
