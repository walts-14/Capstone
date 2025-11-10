// models/user.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define progress structure matching your frontend
const progressStructure = {
  basic: {
    termsone:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwo:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsthree: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsfour:  { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  intermediate: {
    termsfive:  { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termssix:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsseven: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termseight: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  advanced: {
    termsnine:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsten:    { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termseleven: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwelve: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  }
};

// Streak schema to track bonus streaks
const streakSchema = {
  currentStreak: { type: Number, default: 0 },
  lastUpdated:   { type: Date,   default: null },
  streakFreeze:  { type: Boolean, default: false }
};

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    username:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    yearLevel:  {
      type: String,
      required: true,
  enum: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]
    },
    role:       {
      type: String,
      required: true,
      enum: ["user", "admin", "super_admin"]
    },
    points:       { type: Number, default: 0 },
    lives:        { type: Number, default: 5 },
    lastLifeTime: { type: Date,   default: Date.now },

    // Use a function for default so each user gets a fresh copy
    progress: {
      type: Object,
      default: () => JSON.parse(JSON.stringify(progressStructure)),
    },
    // Track how many times a user has attempted each quiz (per level -> lesson key -> part)
    quizAttempts: {
      type: Object,
      default: () => ({
        basic: {
          termsone: { part1Attempts: 0, part2Attempts: 0 },
          termstwo: { part1Attempts: 0, part2Attempts: 0 },
          termsthree: { part1Attempts: 0, part2Attempts: 0 },
          termsfour: { part1Attempts: 0, part2Attempts: 0 },
        },
        intermediate: {
          termsfive: { part1Attempts: 0, part2Attempts: 0 },
          termssix: { part1Attempts: 0, part2Attempts: 0 },
          termsseven: { part1Attempts: 0, part2Attempts: 0 },
          termseight: { part1Attempts: 0, part2Attempts: 0 },
        },
        advanced: {
          termsnine: { part1Attempts: 0, part2Attempts: 0 },
          termsten: { part1Attempts: 0, part2Attempts: 0 },
          termseleven: { part1Attempts: 0, part2Attempts: 0 },
          termstwelve: { part1Attempts: 0, part2Attempts: 0 },
        }
      }),
    },
    streak: {
      type: Object,
      default: () => ({ ...streakSchema }),
    },

    profilePic: {
      url:       { type: String, default: 'https://res.cloudinary.com/deohrrkw9/image/upload/v1745911019/changepic_qrpmur.png' },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Only hash if not already hashed (bcrypt hashes start with $2)
  if (typeof this.password === "string" && this.password.startsWith("$2")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);