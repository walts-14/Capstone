import express from "express";
import { getStreak, updateStreak } from "../controllers/streak.controller.js";

const router = express.Router();

// match /api/streak/email/:email
router.get("/:userId", getStreak);


// fall‑back ID‑based routes (if you ever want to look up by Mongo _id)
router.put("/:userId", updateStreak);

export default router;
