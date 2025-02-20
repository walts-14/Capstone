import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
});

export default mongoose.model("Quiz", QuizSchema);
