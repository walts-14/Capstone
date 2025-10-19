// routes/quizRoutes.js
import express from "express";
import { getRandomQuiz, createQuiz, getStoredQuizQuestions, updateUserPointsForQuiz } from "../controllers/quiz.controller.js";

const router = express.Router();

// GET /api/quizzes/random - Get 10 random quiz questions (by level, lessonNumber, quizPart).
router.get("/random", getRandomQuiz);

// GET /api/quizzes/stored - Get stored quiz questions (by level, lessonNumber, quizPart).
router.get("/stored", getStoredQuizQuestions);

router.post("/uploadquiz", createQuiz );

// New route to update user points for quiz attempts
router.post("/update-points", async (req, res) => {
  try {
    const { email, level, lessonNumber, quizPart, attempt, correctCount } = req.body;
    if (!email || !level || !lessonNumber || !quizPart || !attempt || typeof correctCount === 'undefined') {
      return res.status(400).json({ error: "email, level, lessonNumber, quizPart, attempt, and correctCount are required" });
    }

    const result = await updateUserPointsForQuiz(email, level, lessonNumber, quizPart, attempt, correctCount);
    res.json({ message: "User points updated for quiz", ...result });
  } catch (error) {
    console.error("Error updating user points for quiz:", error);
    res.status(500).json({ error: "Failed to update user points" });
  }
});

export default router;
