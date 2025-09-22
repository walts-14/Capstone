// backend/routes/messages.js
import express from "express";
import * as messageController from "../controllers/messageController.js";
import { authMiddleware } from '../middlewares/auth.js'; 
import { getUsersByGradeLevel } from '../controllers/messageController.js';

const router = express.Router();

// SuperAdmin creates messages
router.post("/", authMiddleware, messageController.createMessage);

// Admin reads their messages
router.get("/for-admin", authMiddleware, messageController.getMessagesForAdmin);

// Mark message read
router.put("/:id/read", authMiddleware, messageController.markAsRead);

// Get messages sent by current user (SuperAdmin view)
router.get("/sent", authMiddleware, messageController.getMessagesSentBySender);

// Get users by year (for message recipient selection)
router.get("/users/year/:grade", messageController.getUsersByGradeLevel);

export default router;



