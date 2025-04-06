import express from 'express';
import { hashedPassword } from '../middlewares/auth.js';
import User from '../models/user.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';

const admin = express.Router();

// --- Create a Student Account ---
admin.post('/students', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    // Destructure all required fields (including "name") from the request body
    const { name, username, email, password } = req.body;
    const role = 'user'; // Force role to 'user' for students

    // Check if a student with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new student instance.
    // The User model's pre-save hook will hash the password.
    const student = new User({
      name,
      username,
      email,
      password,
      role,
    });

    await student.save();
    res.status(201).json({ message: 'Student account created successfully.', data: student });
  } catch (err) {
    console.error("Error in creating student:", err);
    res.status(500).json({ message: 'Error creating student account', error: err.message });
  }
});


// --- Get All Students ---
admin.get('/students', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const students = await User.find({ role: 'user' });
    res.status(200).json({ message: 'Students retrieved successfully.', data: students });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving students', error: err.message });
  }
});

// --- Get a Specific Student Account by Email ---
admin.get('/students/:email', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { email } = req.params;
    const student = await User.findOne({ email, role: 'user' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student retrieved successfully.', data: student });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving student', error: err.message });
  }
});

// --- Update a Student Account by Email ---
admin.put('/students/:email', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { email } = req.params;
    const { username, newEmail, password } = req.body;

    const student = await User.findOne({ email, role: 'user' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (username) student.username = username;
    if (newEmail) student.email = newEmail;
    // Instead of manually hashing, assign the plaintext password.
    if (password) {
      student.password = password;
    }

    await student.save(); // pre-save hook will hash the password if modified
    res.json({ message: 'Student account updated successfully.', data: student });
  } catch (err) {
    res.status(500).json({ message: 'Error updating student account', error: err.message });
  }
});

// --- Delete a Student Account by Email ---
admin.delete('/students/:email', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { email } = req.params;
    const student = await User.findOneAndDelete({ email, role: 'user' });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student account deleted successfully.', data: student });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student account', error: err.message });
  }
});

// Redirect to Admin Dashboard
admin.get('/dashboard', verifyToken, checkRole(['admin']), (req, res) => {
  res.redirect('/admin');
});

export default admin;