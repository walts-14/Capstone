import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for hashing

const userSchema = new Schema(
  {
    age: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    points: {
       type: Number, default: 0 }, 
    lives: { 
       type: Number, default: 5 },
    lastLifeTime: { type: Date, default: Date.now },
    streak:{
      count: {type: Number, default: 0},
      lastActiveDate: {type: Date, default: new Date()}
    },
  },
  { timestamps: true }
);

// **Hash password before saving**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});



const User = mongoose.model("User", userSchema);
export default User;
