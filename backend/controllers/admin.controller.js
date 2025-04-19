import User from "../models/user.js";

/**
 * Create a new Student Account.
 * This function forces the role to "user" so that Admins (Teachers) can only create student accounts.
 */
export const createStudent = async (req, res) => {
  try {
    const { name, username, email, password, yearLevel } = req.body;
    const role = "user"; // forced role

    // Check if a user with the same email exists
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create the student account
    const student = new User({ name, username, email, password, role, yearLevel });
    await student.save();

    res.status(201).json({
      message: "Student account created successfully.",
      data: student,
    });
  } catch (err) {
    console.error("Error in creating student:", err);
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
 * You may update fields such as username, email, or password.
 */
export const updateStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    // Expecting new data in the body; you can update username, newEmail, or password.
    const { username, newEmail, password } = req.body;

    const student = await User.findOne({ email, role: "user" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (username) student.username = username;
    if (newEmail) student.email = newEmail;
    if (password) student.password = password; // Pre-save hook will hash password if modified

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
 * Get Leaderboard (Top 10 students by points).
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
 * View a user's progress by user ID.
 */
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("progress");
    if (!user) return res.status(404).json({ message: "User not found" });
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