import express from "express";
import {
  getProgressByEmail,
  updateProgressByEmail,
} from "../controllers/progress.controller.js";

const router = express.Router();

// GET  /api/progress/email/:email  — fetch a user’s progress by email
router.get("/email/:email", getProgressByEmail);

// PUT  /api/progress/email/:email  — update a user’s progress by email
router.put("/email/:email", updateProgressByEmail);

export default router;
