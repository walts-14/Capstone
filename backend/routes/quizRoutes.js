// routes/quizRoutes.js
import express from "express";
import { getRandomQuiz, createQuiz } from "../controllers/quiz.controller.js";

const router = express.Router();

// GET /api/quizzes/random - Get 10 random quiz questions (by level, lessonNumber, quizPart).
router.get("/random", getRandomQuiz);
router.post("/uploadquiz", createQuiz )

export default router;
