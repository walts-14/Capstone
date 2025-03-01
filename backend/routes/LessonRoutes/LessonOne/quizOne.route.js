import express from 'express';
import router from "../../user.route.js";
import { getRandomQuizOne } from "../../../controllers/QuizController/LessonOne/quizOne.controller.js";
import { getRandomQuizTwo } from "../../../controllers/QuizController/LessonOne/quiz.Two.controller.js";

const LessonOneQuiz = express.Router()

// Quiz route (fetches random quiz)
router.get('/quiz', getRandomQuizOne);
router.get('/quizPartTwo', getRandomQuizTwo);

export default LessonOneQuiz;