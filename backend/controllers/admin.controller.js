import User from "../models/user.js"; // adjust path if needed
import { hashedPassword } from "../middlewares/auth.js";
import { createMagicToken } from "../src/services/magicToken.js";
import { toPngBuffer } from "../src/services/qr.js";
import { sendEmail } from "../src/services/mailer.js";

export const createStudent = async (req, res) => {
  try {
    const { name, username, email, password: rawPassword, yearLevel } = req.body;
    const role = "user"; // force student role

    // Check by email (don't allow duplicate emails)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Generate raw password if not provided
    const rawPwd = rawPassword || Math.random().toString(36).slice(-8);
    // hash password
    const password = await hashedPassword(rawPwd);

    const student = new User({ name, username, email, password, role, yearLevel });
    await student.save();

    // create magic token (short-lived + single-use)
    const magicToken = await createMagicToken(student._id);

    // form the magic URL that the QR will point to (backend endpoint)
    const backend = process.env.BACKEND_URL || `http://localhost:5000`;
    const magicUrl = `${backend}/api/magic-login?token=${encodeURIComponent(magicToken)}`;

    // generate QR PNG buffer
    const pngBuffer = await toPngBuffer(magicUrl);

    // compose email content (embed QR via cid, and attach png)
    const html = `
      <h2>Welcome to WeSign, ${name}</h2>
      <p>Your account has been created by your teacher/admin.</p>
      <p><strong>Login Info (keep secure):</strong></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Password: ${rawPwd}</li>
      </ul>
      <p>Scan the QR code or click the link below to login (link expires in ${process.env.MAGIC_TOKEN_MIN || 15} minutes):</p>
      <img src="cid:onboardingqr" alt="Onboarding QR" style="width:180px; height:auto;" />
      <p><a href="${magicUrl}">Open magic login link</a></p>
    `;

    await sendEmail({
      to: email,
      subject: "Your WeSign account",
      html,
      attachments: [
        { filename: "onboarding-qr.png", content: pngBuffer, cid: "onboardingqr" }
      ]
    });

    // return created student data (avoid returning password)
    const safeStudent = student.toObject();
    delete safeStudent.password;

    // return also a dataUrl for immediate admin UI display/printing
    const dataUrl = "data:image/png;base64," + pngBuffer.toString("base64");

    res.status(201).json({
      message: "Student account created successfully.",
      data: { student: safeStudent, qrDataUrl: dataUrl, magicUrl }
    });
  } catch (err) {
    console.error("createStudent error:", err);
    res.status(500).json({
      message: "Error creating student account",
      error: err.message,
    });
  }
};

/**
 * Get all Student Accounts (role: "user").
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "user" });
    res.status(200).json({
      message: "Students retrieved successfully.",
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving students",
      error: err.message,
    });
  }
};

/**
 * Get a specific Student Account by email.
 */
export const getStudentByEmail = async (req, res) => {
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
    res.status(500).json({
      message: "Error retrieving student",
      error: err.message,
    });
  }
};

/**
 * Update a Student Account by email.
 */
export const updateStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { username, newEmail, password, name, yearLevel } = req.body;

    const student = await User.findOne({ email, role: "user" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (username) student.username = username;
    if (newEmail) student.email = newEmail;
    if (name) student.name = name;
    if (yearLevel) student.yearLevel = yearLevel;
   if (password) {
  // hash explicitly so we don't depend on pre-save behavior
  student.password = await hashedPassword(password);
}
 // pre-save hook hashes if modified

    await student.save();
    res.json({
      message: "Student account updated successfully.",
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating student account",
      error: err.message,
    });
  }
};

/**
 * Delete a Student Account by email.
 */
export const deleteStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await User.findOneAndDelete({ email, role: "user" });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student account deleted successfully.",
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting student account",
      error: err.message,
    });
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
    res.status(500).json({
      message: "Error retrieving students by year level",
      error: err.message,
    });
  }
};

/**
 * Get leaderboard (Top 10 by points).
 */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "user" }).sort({ points: -1 }).limit(10);
    res.status(200).json({
      message: "Leaderboard retrieved successfully.",
      data: leaderboard,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving leaderboard",
      error: err.message,
    });
  }
};

/**
 * Get a student's progress by user ID.
 */
export const getUserProgress = async (req, res) => {
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
    res.status(500).json({
      message: "Error retrieving user progress",
      error: err.message,
    });
  }
};
