// routes/progressRoutes.js
import express from "express";
import { getProgress, updateProgress } from "../controllers/progress.controller.js";

const router = express.Router();

// GET /api/progress/:userId - Get user progress.
router.get("/:userId", getProgress);

// PUT /api/progress/:userId - Update user progress.
router.put("/:userId", updateProgress);

export default router;
