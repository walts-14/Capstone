// src/models/TokenModel.js
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  jtiHash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  purpose: { type: String, default: "magic-login" },
  used: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export const TokenModel = mongoose.model("TokenModel", TokenSchema);
