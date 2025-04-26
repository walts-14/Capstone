import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    // Optional text question (e.g., "Which video represents the sign 'Hello'?")
  },
  choices: {
    type: [
      {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'VideoLesson' },
        label: { type: String, enum: ['A', 'B', 'C', 'D'] }
      }
    ],
    validate: [val => val.length === 4, 'Exactly 4 choices are required.']
  },
  correctAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoLesson'
  }
});

export default mongoose.model('Quiz', quizSchema);  
