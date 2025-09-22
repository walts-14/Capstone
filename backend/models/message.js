// backend/models/Message.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const ReadBySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, required: true },

  // teacher/student metadata (optional but useful for UI)
  teacherId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  teacherName: { type: String, default: "" },

  studentId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  studentName: { type: String, default: "" },

  // generic recipients (keeps prior behavior)
  recipientIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  recipientRole: { type: String, default: "admin" },

  title: { type: String, default: "" },
  body: { type: String, required: true },

  // grade string (e.g. "GRADE 7")
  grade: { type: String, default: "" },

  isBroadcast: { type: Boolean, default: false },

  readBy: { type: [ReadBySchema], default: [] },

  createdAt: { type: Date, default: Date.now },
});

MessageSchema.index({ recipientIds: 1 });
MessageSchema.index({ isBroadcast: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
