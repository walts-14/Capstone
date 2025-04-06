import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for hashing

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
      type: Number, 
      default: 0
    }, 
    lives: { 
      type: Number, 
      default: 5 
    },
    lastLifeTime: { 
      type: Date, 
      default: Date.now 
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin', 'super_admin'], // Define allowed roles
    },
  },
  { timestamps: true } // Correctly placed timestamps option
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
