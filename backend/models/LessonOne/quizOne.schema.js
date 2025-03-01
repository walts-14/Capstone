import mongoose from "mongoose";

const LessonOneQuizOne = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
});

const quizOne =  mongoose.model("Lesson_1_Quiz_Part_1", LessonOneQuizOne);
export default quizOne;
