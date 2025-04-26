// routes/streakRoutes.js
import express from "express";
import { getStreak, updateStreak } from "../controllers/streak.controller.js";

const router = express.Router();

// GET /api/streak/:userId - Get user streak.
router.get("/:userId", getStreak);

// PUT /api/streak/:userId - Update user streak.
router.put("/:userId", updateStreak);

export default router;
