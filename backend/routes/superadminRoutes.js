import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const Router = express.Router();

import { verifyToken, checkRole } from '../middlewares/auth.js';

// --- Create an Account (Admin/Teacher or Student) ---
Router.post('/create-account', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified. Allowed roles are 'admin' and 'user'." });
    }

    const user = new User({ name, username, email, password, role });
    const validationError = user.validateSync();
    if (validationError) {
      return res.status(400).json({ message: 'Validation error', error: validationError });
    }

    await user.save();
    res.status(201).json({ message: `${role === 'admin' ? 'Admin' : 'Student'} account created successfully.`, data: user });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ message: 'Error creating account', error: err.message });
  }
});

// --- Get All Student Accounts (role: "user") ---
Router.get('/users', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const students = await User.find({ role: 'user' });
    res.status(200).json({ message: 'Students retrieved successfully.', data: students });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving students', error: err.message });
  }
});

// --- Get All Admins (Teachers, role: "admin") ---
Router.get('/admins', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).json({ message: 'Admins retrieved successfully.', data: admins });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admins', error: err.message });
  }
});

// --- Get a Specific Admin Account by Email ---
Router.get('/admins/:email', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin retrieved successfully.', data: admin });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admin', error: err.message });
  }
});

// --- Update an Admin or Student Account by Email ---
Router.put('/admins/:email', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const { email } = req.params;
    const { name, username, email: newEmail, password } = req.body;
    
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    if (name) user.name = name;
    if (username) user.username = username;
    if (newEmail) user.email = newEmail;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    res.json({ message: 'Admin account updated successfully.', data: user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating admin account', error: err.message });
  }
});

// --- Update a Student Account by Email ---
Router.put('/users/:email', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const { email } = req.params;
    const { name, username, email: newEmail, password } = req.body;
    
    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (username) user.username = username;
    if (newEmail) user.email = newEmail;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    res.json({ message: 'User account updated successfully.', data: user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user account', error: err.message });
  }
});

// --- Delete an Admin or Student Account by Email ---
Router.delete('/:role/:email', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    let { role, email } = req.params;
    
    // Handle both singular and plural forms
    if (role === 'admins') role = 'admin';
    if (role === 'users') role = 'user';
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    const user = await User.findOneAndDelete({ email, role });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User account deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user account', error: err.message });
  }
});

// --- Create Super Admin ---
Router.post('/create-superadmin', verifyToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const role = 'super_admin';
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      return res.status(403).json({ message: 'Super Admin account already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: "super_admin"
    });
    await superAdmin.save();
    res.status(201).json({ message: 'Super Admin created successfully.', data: superAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating Super Admin', error: err.message });
  }
});

Router.get('/test', (req, res) => {
  res.send('Superadmin route is working!');
});

export default Router;
