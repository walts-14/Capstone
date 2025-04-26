// routes/superAdminRoutes.js
import express from "express";
import {
  createAccount,
  getAllStudentsSuper,
  getAllAdmins,
  getAdminByEmail,
  updateAdminByEmail,
  updateStudentByEmailSuper,
  deleteAccountByEmail,
  createSuperAdmin,
  getStudentsByYearLevel,
} from "../controllers/superadmin.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.js";

const superAdminRoutes = express.Router();

// Create an Account (Admin/Student) by Super Admin
superAdminRoutes.post("/create-account", verifyToken, checkRole(["super_admin"]), createAccount);

// Get All Student Accounts (role: "user")
superAdminRoutes.get("/users", verifyToken, checkRole(["super_admin"]), getAllStudentsSuper);

// Get All Admin Accounts (role: "admin")
superAdminRoutes.get("/admins", verifyToken, checkRole(["super_admin"]), getAllAdmins);

// Get a Specific Admin Account by Email
superAdminRoutes.get("/admins/:email", verifyToken, checkRole(["super_admin"]), getAdminByEmail);

// Update an Admin Account by Email
superAdminRoutes.put("/admins/:email", verifyToken, checkRole(["super_admin"]), updateAdminByEmail);

// --- Update a Student Account by Email ---
superAdminRoutes.put('/users/:email', verifyToken, checkRole(['super_admin']), async (req, res) => {
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
superAdminRoutes.delete('/:role/:email', verifyToken, checkRole(['super_admin']), async (req, res) => {
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
superAdminRoutes.post('/create-superadmin', verifyToken, checkRole(['super_admin']), async (req, res) => {
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

export default superAdminRoutes;
