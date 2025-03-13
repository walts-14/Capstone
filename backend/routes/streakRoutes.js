import express from "express";
import { updateStreak } from "../controllers/streakController.js";

const router = express.Router();

router.post("/update-streak", updateStreak); // ✅ Correct path
export default router;

