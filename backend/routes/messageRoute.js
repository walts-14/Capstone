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
  replyToMessage,
  getRepliesForMessage,
  markAllAsRead,
  deleteAllMessages,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/auth.js"; // keep path you actually use

const router = express.Router();

// All message routes are mounted under whatever prefix you use in app.js (e.g. app.use('/api/messages', router))

// SuperAdmin creates messages
router.post("/", authMiddleware, createMessage);

// Admin reads their messages
router.get("/for-admin", authMiddleware, getMessagesForAdmin);

// Bulk operations MUST come before /:id routes to avoid route matching issues
// Bulk: Mark all messages as read
router.put("/all/read", authMiddleware, markAllAsRead);

// Bulk: Delete all messages (soft-delete for user)
router.delete("/all", authMiddleware, deleteAllMessages);

// Get messages sent by current user (SuperAdmin view)
router.get("/sent", authMiddleware, getMessagesSentBySender);

// Get users by year (for message recipient selection) - protect if you want only authenticated users
router.get("/users/year/:grade", authMiddleware, getUsersByGradeLevel);

// Single message operations (these use /:id pattern, so must come after /all and /sent)
// Fetch replies for a specific message
router.get("/:id/replies", authMiddleware, getRepliesForMessage);

// Mark message read
router.put("/:id/read", authMiddleware, markAsRead);

// Admin replies to a message from Super Admin
router.post("/:id/reply", authMiddleware, replyToMessage);

// Edit message (protected)
router.put("/edit/:id", authMiddleware, editMessage);

// Delete message (protected)
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
