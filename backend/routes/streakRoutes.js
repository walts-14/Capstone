import express from "express";
import { getStreak, updateStreak, getStreakByEmail, updateStreakByEmail } from "../controllers/streak.controller.js";

const router = express.Router();


// match /api/streak/email/:email
router.get("/email/:email", getStreakByEmail);
router.put("/email/:email", updateStreakByEmail);

// fallback ID-based routes
router.get("/:userId", getStreak);


router.put("/:userId", updateStreak);

export default router;
