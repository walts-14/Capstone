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

// Update a Student Account by Email
superAdminRoutes.put("/users/:email", verifyToken, checkRole(["super_admin"]), updateStudentByEmailSuper);

// Delete an Account by Email (role is passed as a parameter: 'admins' or 'users')
superAdminRoutes.delete("/:role/:email", verifyToken, checkRole(["super_admin"]), deleteAccountByEmail);

// Create Super Admin Account
superAdminRoutes.post("/create-superadmin", verifyToken, checkRole(["super_admin"]), createSuperAdmin);

// Test route (for debugging)
superAdminRoutes.get("/test", (req, res) => {
  res.send("Superadmin route is working!");
});

// Get Students by Year Level (Super Admin)
superAdminRoutes.get("/students/year/:yearLevel",verifyToken, checkRole(["super_admin"]), getStudentsByYearLevel);

export default superAdminRoutes;
