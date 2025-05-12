// routes/quizRoutes.js
import express from "express";
import { getRandomQuiz, createQuiz, getStoredQuizQuestions } from "../controllers/quiz.controller.js";

const router = express.Router();

// GET /api/quizzes/random - Get 10 random quiz questions (by level, lessonNumber, quizPart).
router.get("/random", getRandomQuiz);

// GET /api/quizzes/stored - Get stored quiz questions (by level, lessonNumber, quizPart).
router.get("/stored", getStoredQuizQuestions);

router.post("/uploadquiz", createQuiz )

export default router;
