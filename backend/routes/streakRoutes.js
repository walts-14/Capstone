import express from "express";
import { getStreak, updateStreak } from "../controllers/streak.controller.js";

const router = express.Router();

// GET /api/streak/email/:email - Get user streak by email
router.get("/email/:email", getStreak);

// PUT /api/streak/email/:email - Update user streak by email
router.put("/email/:email", updateStreak);

export default router;

