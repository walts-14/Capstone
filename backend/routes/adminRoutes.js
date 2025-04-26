// routes/adminRoutes.js
import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.js";
import {
  createStudent,
  getAllStudents,
  getStudentByEmail,
  updateStudentByEmail,
  deleteStudentByEmail,
  getStudentsByYearLevel
} from "../controllers/admin.controller.js";

const adminRoutes = express.Router();

// Create a Student Account (only for admin)
adminRoutes.post(
  "/students",
  verifyToken,
  checkRole(["admin"]),
  createStudent
);

// Get All Student Accounts
adminRoutes.get(
  "/students",
  verifyToken,
  checkRole(["admin"]),
  getAllStudents
);

// ─── Make year‐filter route more specific & place it BEFORE the “:email” param ───
adminRoutes.get(
  "/students/year/:yearLevel",
  verifyToken,
  checkRole(["admin"]),
  getStudentsByYearLevel
);

// Get a Specific Student Account by Email
adminRoutes.get(
  "/students/:email",
  verifyToken,
  checkRole(["admin"]),
  getStudentByEmail
);

// Update a Student Account by Email
adminRoutes.put(
  "/students/:email",
  verifyToken,
  checkRole(["admin"]),
  updateStudentByEmail
);

// Delete a Student Account by Email
adminRoutes.delete(
  "/students/:email",
  verifyToken,
  checkRole(["admin"]),
  deleteStudentByEmail
);

// (Optional) Redirect to Admin Dashboard
adminRoutes.get(
  "/dashboard",
  verifyToken,
  checkRole(["admin"]),
  (req, res) => {
    res.redirect("/admin");
  }
);

export default adminRoutes;
