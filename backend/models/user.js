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
      enum: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"]
    },
    role:       {
      type: String,
      required: true,
      enum: ["user", "admin", "super_admin"]
    },
    points:    { type: Number, default: 0 },    // for your leaderboard
    lives:     { type: Number, default: 5 },    // how many quiz lives a user has
    lastLifeTime: { type: Date, default: Date.now }, // optional: when lives were last refilled

    progress: { type: Object, default: progressStructure },
    streak:   { type: Object, default: streakSchema },
    profilePic: {
      url: { type: String, default: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/default-profile.png' },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
