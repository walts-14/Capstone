// models/quiz.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },

  level: {
    type: String,
    enum: ["basic", "intermediate", "advanced"],
    required: true
  },

  lessonNumber: {
    type: Number,
    required: true
  },

  quizPart: {
    type: Number,
    enum: [1, 2],
    required: true
  },

  choices: {
    type: [
      {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: "VideoLesson", required: true },
        label: {
          type: String,
          enum: ["A", "B", "C", "D"],
          required: true
        }
      }
    ],
    validate: {
      validator: (val) => val.length === 4,
      message: "Exactly 4 choices are required."
    }
  },

  correctAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VideoLesson",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
