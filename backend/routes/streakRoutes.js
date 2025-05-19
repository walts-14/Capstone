import express from "express";
import {
  getStreakByEmail,
  updateStreakByEmail,
  getStreak,
  updateStreak
} from "../controllers/streak.controller.js";

const router = express.Router();

// match /api/streak/email/:email
router.get("/email/:email",    getStreakByEmail);
router.put("/email/:email",   updateStreakByEmail);

// fall‑back ID‑based routes (if you ever want to look up by Mongo _id)
router.get("/:userId",         getStreak);
router.put("/:userId",        updateStreak);

export default router;
