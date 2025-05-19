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
    const { userId, level, attempt, isSuccess } = req.body;
    if (!userId || !level || !attempt || typeof isSuccess !== 'boolean') {
      return res.status(400).json({ error: "userId, level, attempt, and isSuccess are required" });
    }
    await updateUserPointsForQuiz(userId, level, attempt, isSuccess);
    res.json({ message: "User points updated for quiz" });
  } catch (error) {
    console.error("Error updating user points for quiz:", error);
    res.status(500).json({ error: "Failed to update user points" });
  }
});

export default router;
