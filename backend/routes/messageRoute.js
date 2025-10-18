// backend/routes/messages.js
import express from "express";
import {
  createMessage,
  getMessagesForAdmin,
  markAsRead,
  getMessagesSentBySender,
  getUsersByGradeLevel,
  editMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/auth.js"; // keep path you actually use

const router = express.Router();

// All message routes are mounted under whatever prefix you use in app.js (e.g. app.use('/api/messages', router))

// SuperAdmin creates messages
router.post("/", authMiddleware, createMessage);

// Admin reads their messages
router.get("/for-admin", authMiddleware, getMessagesForAdmin);

// Mark message read
router.put("/:id/read", authMiddleware, markAsRead);

// Get messages sent by current user (SuperAdmin view)
router.get("/sent", authMiddleware, getMessagesSentBySender);

// Get users by year (for message recipient selection) - protect if you want only authenticated users
router.get("/users/year/:grade", authMiddleware, getUsersByGradeLevel);

// Edit message (protected)
router.put("/edit/:id", authMiddleware, editMessage);

// Delete message (protected)
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
