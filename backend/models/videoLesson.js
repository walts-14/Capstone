import mongoose from "mongoose";

const videoLessonSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
    // The URL or path to the video file representing the sign/word
  },
  word: {
    type: String,
    required: true,
    // The actual sign or word (e.g., "Hello", "Thank you")
  },
  description: {
    type: String,
    required: true,
    // A brief description of the word/sign, its meaning, or usage
  },
  level: {
    type: String,
    enum: ["basic", "intermediate", "advanced"],
    required: true,
  },
  lessonNumber: {
    type: Number,
    required: true,
    // Lesson index in the level (usually 1 to 4)
  },
  termNumber: {
    type: Number,
    required: true,
    // Term number within the lesson (1 to 30)
  },
}, { timestamps: true });

export default mongoose.model('VideoLesson', videoLessonSchema);
