import mongoose from "mongoose";

const LessonOneQuizTwo = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
});

const quizTwo =  mongoose.model("Lesson_1_Quiz_Part_2", LessonOneQuizTwo);
export default quizTwo;
