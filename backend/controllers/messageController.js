// backend/controllers/messageController.js

import Message from "../models/message.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// Utility to escape RegExp special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a message (SuperAdmin only)
 * Request body expected:
 * {
 *   title?, body, grade?,
 *   recipientIds?: [ObjectId],  // optional teacher id(s)
 *   isBroadcast?: boolean,
 *   teacherId?: ObjectId, teacherName?: string,
 *   studentId?: ObjectId, studentName?: string
 * }
 */
export const createMessage = async (req, res) => {
  try {
    const sender = req.user;
    if (!sender) return res.status(401).json({ message: "Unauthorized" });
    if (sender.role !== "superadmin" && sender.role !== "super_admin")
      return res.status(403).json({ message: "Forbidden" });

    // Support different token id fields
    const senderId = sender._id || sender.id || sender.userId;
    if (!senderId) {
      console.error("createMessage error: senderId missing in token", sender);
      return res.status(401).json({ message: "Unauthorized: senderId missing" });
    }

    const {
      title = "",
      body,
      grade = "",
      recipientIds = [],
      isBroadcast = false,
      teacherId: incomingTeacherId,
      teacherName: incomingTeacherName,
      studentId: incomingStudentId,
      studentName: incomingStudentName,
    } = req.body;

    if (!body) return res.status(400).json({ message: "body is required" });

    // Resolve teacher (best-effort): if only a name/email was provided, try to find user
    let resolvedTeacherId = null;
    let resolvedTeacherName = incomingTeacherName || "";

    if (incomingTeacherId && mongoose.Types.ObjectId.isValid(incomingTeacherId)) {
      resolvedTeacherId = incomingTeacherId;
      if (!resolvedTeacherName) {
        const t = await User.findById(incomingTeacherId).select("name email username");
        if (t) resolvedTeacherName = t.name || t.email || t.username || "";
      }
    } else if (incomingTeacherName) {
      const t = await User.findOne({
        $or: [
          { email: incomingTeacherName },
          { name: incomingTeacherName },
          { username: incomingTeacherName },
        ],
      }).select("_id name email username");
      if (t) {
        resolvedTeacherId = t._id;
        resolvedTeacherName = t.name || t.email || t.username || incomingTeacherName;
      } else {
        resolvedTeacherName = incomingTeacherName;
      }
    }

    // Resolve student similarly
    let resolvedStudentId = null;
    let resolvedStudentName = incomingStudentName || "";

    if (incomingStudentId && mongoose.Types.ObjectId.isValid(incomingStudentId)) {
      resolvedStudentId = incomingStudentId;
      if (!resolvedStudentName) {
        const s = await User.findById(incomingStudentId).select("name email username");
        if (s) resolvedStudentName = s.name || s.email || s.username || "";
      }
    } else if (incomingStudentName) {
      const s = await User.findOne({
        $or: [
          { email: incomingStudentName },
          { name: incomingStudentName },
          { username: incomingStudentName },
        ],
      }).select("_id name email username");
      if (s) {
        resolvedStudentId = s._id;
        resolvedStudentName = s.name || s.email || s.username || incomingStudentName;
      } else {
        resolvedStudentName = incomingStudentName;
      }
    }

    // Validate recipientIds array
    const validRecipientIds = Array.isArray(recipientIds)
      ? recipientIds.filter((id) => mongoose.Types.ObjectId.isValid(id))
      : [];

    // Ensure teacherId is included as recipient if available (common case)
    if (
      resolvedTeacherId &&
      !validRecipientIds.some((id) => String(id) === String(resolvedTeacherId))
    ) {
      validRecipientIds.unshift(resolvedTeacherId);
    }

    const msg = await Message.create({
      senderId,
      senderRole: sender.role,
      teacherId: resolvedTeacherId || null,
      teacherName: resolvedTeacherName || "",
      studentId: resolvedStudentId || null,
      studentName: resolvedStudentName || "",
      recipientIds: isBroadcast ? [] : validRecipientIds,
      recipientRole: "admin",
      title: title || `${resolvedTeacherName || "Teacher"} → ${resolvedStudentName || "Student"}`,
      body,
      grade,
      isBroadcast: Boolean(isBroadcast),
    });

    await msg.populate("senderId", "name email role");

    // Socket emit (optional) - emits to 'admins' room for broadcast or admin_<id> for specific
    try {
      const io = req.app.get("io");
      if (io) {
        const payload = msg.toObject();
        if (msg.isBroadcast) {
          io.to("admins").emit("newMessage", payload);
        } else {
          (msg.recipientIds || []).forEach((rid) => {
            io.to(`admin_${rid}`).emit("newMessage", payload);
          });
        }
      }
    } catch (emitErr) {
      console.warn("socket emit failed", emitErr);
    }

    return res.status(201).json(msg);
  } catch (err) {
    console.error("createMessage error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get messages for logged-in admin
 * - returns broadcasts and messages targeted to this admin
 * - computes isRead flag for convenience
 */
export const getMessagesForAdmin = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const query = {
      $or: [{ isBroadcast: true, recipientRole: "admin" }, { recipientIds: user._id }],
    };

    if (req.query.grade) {
      query.$and = [{ grade: req.query.grade }];
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate("senderId", "name email role")
      .lean();

    const data = messages.map((m) => {
      const isRead = (m.readBy || []).some((r) => String(r.userId) === String(user._id));
      return { ...m, isRead };
    });

    return res.json(data);
  } catch (err) {
    console.error("getMessagesForAdmin error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Mark a message as read by the logged-in user
 * PUT /api/messages/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    const isRecipient =
      (msg.isBroadcast && user.role === "admin") ||
      (msg.recipientIds || []).some((rid) => String(rid) === String(user._id));

    if (!isRecipient) return res.status(403).json({ message: "Not authorized" });

    const already = (msg.readBy || []).some((r) => String(r.userId) === String(user._id));
    if (!already) {
      msg.readBy.push({ userId: user._id, at: new Date() });
      await msg.save();
      try {
        const io = req.app.get("io");
        if (io) io.to(`admin_${user._id}`).emit("messageRead", { messageId: id, userId: user._id });
      } catch (e) {
        /* ignore socket notify failure */
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("markAsRead error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get messages created by the logged-in sender (useful for SuperAdmin view)
 * GET /api/messages/sent
 */
export const getMessagesSentBySender = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "superadmin") return res.status(403).json({ message: "Forbidden" });

    const messages = await Message.find({ senderId: user._id })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email role")
      .lean();

    return res.json(messages);
  } catch (err) {
    console.error("getMessagesSentBySender error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsersByGradeLevel = async (req, res) => {
  try {
    const rawGrade = req.params.grade || "";
    const grade = String(rawGrade).trim();
    console.log("[getUsersByGradeLevel] Requested grade:", grade);

    // no grade -> return all users (but remove password)
    if (!grade) {
      const users = await User.find({}).select("-password -__v").lean();
      console.log("[getUsersByGradeLevel] Returning all users:", users.map(u => u.yearLevel));
      return res.json({ data: users });
    }

    const escaped = escapeRegExp(grade);
    // numeric fallback (if grade contains a digit like "7" from "Grade 7")
    const numeric = (grade.match(/\d+/) || [""])[0];

    // build an $or of patterns: exact (case-insensitive), contains, numeric-word-boundary
    const orConditions = [
      { yearLevel: { $regex: `^${escaped}$`, $options: "i" } }, // exact-ish
      { yearLevel: { $regex: escaped, $options: "i" } }, // contains
    ];
    if (numeric) {
      orConditions.push({ yearLevel: { $regex: `\\b${escapeRegExp(numeric)}\\b`, $options: "i" } });
    }

    const users = await User.find({ $or: orConditions }).select("-password -__v").lean();
    console.log("[getUsersByGradeLevel] Matched users:", users.map(u => u.yearLevel));
    return res.json({ data: users });
  } catch (err) {
    console.error("getUsersByGradeLevel error", err);
    return res.status(500).json({ message: "Server error" });
  }
};