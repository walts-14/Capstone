import express from "express";
import {
  createSuperAdmin,
  createAccount,
  getAllStudentsSuper,
  getStudentByEmailSuper,
  updateStudentByEmailSuper,
  getStudentsByYearLevel,
  getLeaderboardSuper,
  getUserProgressSuper,
  getAllAdmins,
  getAdminByEmail,
  updateAdminByEmail,
  deleteAccountByEmail,
} from "../controllers/superadmin.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.js";

const superAdminRoutes = express.Router();

// Super Admin-only endpoints

// 1. Create the first (and only) Super Admin
superAdminRoutes.post(
  "/create-superadmin",
  verifyToken,
  checkRole(["super_admin"]),
  createSuperAdmin
);

// 2. Create Admin or Student
superAdminRoutes.post(
  "/create-account",
  verifyToken,
  checkRole(["super_admin"]),
  createAccount
);

// 3. Admin management
superAdminRoutes.get(
  "/admins",
  verifyToken,
  checkRole(["super_admin"]),
  getAllAdmins
);
superAdminRoutes.get(
  "/admins/:email",
  verifyToken,
  checkRole(["super_admin"]),
  getAdminByEmail
);
superAdminRoutes.put(
  "/admins/:email",
  verifyToken,
  checkRole(["super_admin"]),
  updateAdminByEmail
);

// 4. Student management
superAdminRoutes.get(
  "/users",
  verifyToken,
  checkRole(["super_admin"]),
  getAllStudentsSuper
);
superAdminRoutes.get(
  "/users/:email",
  verifyToken,
  checkRole(["super_admin"]),
  getStudentByEmailSuper
);
superAdminRoutes.put(
  "/users/:email",
  verifyToken,
  checkRole(["super_admin"]),
  updateStudentByEmailSuper
);

// 5. Specialized student lookups
superAdminRoutes.get(
  "/users/year/:yearLevel",
  verifyToken,
  checkRole(["super_admin"]),
  getStudentsByYearLevel
);

// 6. Leaderboard and progress endpoints
superAdminRoutes.get(
  "/leaderboard",
  verifyToken,
  checkRole(["super_admin"]),
  getLeaderboardSuper
);
superAdminRoutes.get(
  "/progress/:userId",
  verifyToken,
  checkRole(["super_admin"]),
  getUserProgressSuper
);

// 7. Delete any Admin or Student
//    e.g. DELETE /super-admin/users/:email or /super-admin/admins/:email
superAdminRoutes.delete(
  "/:role/:email",
  verifyToken,
  checkRole(["super_admin"]),
  deleteAccountByEmail
);

export default superAdminRoutes;
