// backend/controllers/messageController.js

// safe helper to get an ObjectId instance or null (works across mongoose/bson versions)
const toObjectId = (v) => {
  try {
    if (!v && v !== 0) return null;
    const s = String(v);
    if (!mongoose.Types.ObjectId.isValid(s)) return null;
    // use `new` to avoid "cannot be invoked without 'new'" errors
    return new mongoose.Types.ObjectId(s);
  } catch (e) {
    return null;
  }
};


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

    // Debug log: created message summary
    try {
      console.log("createMessage: created message", {
        id: String(msg._id),
        senderId: String(msg.senderId?._id || msg.senderId),
        senderRole: msg.senderRole,
        isBroadcast: msg.isBroadcast,
        recipientRole: msg.recipientRole,
        recipientIds: msg.recipientIds,
        grade: msg.grade,
        title: msg.title,
      });
    } catch (e) {
      /* ignore logging errors */
    }

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
    const role = String(user.role || "").toLowerCase();
    if (!role.includes("admin")) return res.status(403).json({ message: "Forbidden" });

    // Prepare both string and ObjectId forms for matching
    const userIdStr = String(user._id || user.id || user.userId || "");
    const userIdObj = toObjectId(userIdStr);

    // Build flexible OR conditions:
    const orConditions = [
      { isBroadcast: true, recipientRole: "admin" },
      { recipientRole: "admin" }, // Include all messages where recipientRole === admin
    ];

    if (userIdObj) {
      orConditions.push({ recipientIds: userIdObj });
    }
    // match string-stored ids
    orConditions.push({ recipientIds: userIdStr });

    // match embedded objects such as { value: "..."} or { _id: "..." }
    orConditions.push({
      recipientIds: {
        $elemMatch: {
          $or: [
            { _id: userIdObj || userIdStr },
            { id: userIdObj || userIdStr },
            { value: userIdObj || userIdStr },
          ],
        },
      },
    });

    const query = { $or: orConditions };

    // Exclude messages soft-deleted for this user (both ObjectId and string)
    const norArr = [];
    if (userIdObj) norArr.push({ deletedFor: userIdObj });
    norArr.push({ deletedFor: userIdStr });
    if (norArr.length) query.$nor = norArr;

    if (req.query.grade) {
      query.$and = [{ grade: req.query.grade }];
    }

    // Logging for debugging
    const queryForLog = JSON.parse(JSON.stringify(query, (k, v) => {
      if (v && v._bsontype === "ObjectID") return String(v);
      return v;
    }));
    console.log("getMessagesForAdmin - user:", userIdStr, "query:", JSON.stringify(queryForLog, null, 2));

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate("senderId", "name email role")
      .lean();

    console.log("getMessagesForAdmin - found:", Array.isArray(messages) ? messages.length : 0, "messages");

    const data = messages.map((m) => {
      const isRead = (m.readBy || []).some((r) => String(r.userId) === userIdStr);
      return { ...m, isRead };
    });

    return res.json(data);
  } catch (err) {
    console.error("getMessagesForAdmin error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Server error", error: err?.message || String(err) });
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

    const role = String(user.role || "").toLowerCase();
    const userIdStr = String(user._id || user.id || user.userId || "");
    const userIdObj = toObjectId(userIdStr);

    // Allow admins to mark broadcasts or direct messages; support ObjectId, string, or embedded ids
    const recipientMatch = (rid) => {
      if (!rid) return false;
      const ridStr = String(rid._id || rid.id || rid.value || rid);
      return ridStr === userIdStr;
    };

    const isRecipient =
      (msg.isBroadcast && role.includes("admin")) ||
      (msg.recipientRole === "admin" && role.includes("admin")) ||
      (msg.recipientIds || []).some(recipientMatch);

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
// tolerant getMessagesSentBySender
export const getMessagesSentBySender = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const role = String(user.role || "").toLowerCase();
    if (!["superadmin", "super_admin"].includes(role))
      return res.status(403).json({ message: "Forbidden" });

    // Build query conditions: prefer matching by senderId (token id), fallback to senderEmail and senderRole
    const orConditions = [];

    // If token contains a usable _id, use it to match senderId exactly
    try {
      if (user._id && mongoose.Types.ObjectId.isValid(String(user._id))) {
        orConditions.push({ senderId: mongoose.Types.ObjectId(String(user._id)) });
      }
    } catch (e) {
      // ignore coercion issues
    }

    // If token contains an email, include it as a match
    if (user.email && String(user.email).trim()) {
      orConditions.push({ senderEmail: String(user.email).trim() });
    }

    // Also allow matching by sender role (case-insensitive)
    orConditions.push({ senderRole: { $regex: new RegExp(`^${escapeRegExp(role)}$`, "i") } });

    const messages = await Message.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "getMessagesSentBySender - found:",
      Array.isArray(messages) ? messages.length : 0,
      messages.map((m) => String(m._id))
    );

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

export const editMessage = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    // accept both `text` and `body` to be flexible
    const { text, body, grade, teacherId, teacherName, studentId, studentName } = req.body;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    // require some content to update
    const newBody = (body || text || "").trim();
    if (!newBody) return res.status(400).json({ message: "Message body cannot be empty" });

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const role = String(user.role || "").toLowerCase();
    const userEmail = String(user.email || "").trim();
    const userIdStr = user._id || user.id || user.userId || null;

    const isSenderById =
      userIdStr && message.senderId && String(message.senderId) === String(userIdStr);
    const isSenderByEmail = userEmail && message.senderEmail && String(message.senderEmail) === String(userEmail);
    const isSuperAdmin = ["superadmin", "super_admin"].includes(role);

    if (!isSenderById && !isSenderByEmail && !isSuperAdmin) {
      return res.status(403).json({ message: "Forbidden: You can't edit this message" });
    }

    // apply updates
    message.body = newBody;
    if (typeof grade === "string") message.grade = grade;
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) message.teacherId = teacherId;
    if (typeof teacherName === "string") message.teacherName = teacherName;
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) message.studentId = studentId;
    if (typeof studentName === "string") message.studentName = studentName;
    message.updatedAt = new Date();

    await message.save();

    return res.json({ message: "Message updated successfully", updatedMessage: message });
  } catch (err) {
    console.error("editMessage error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const role = String(user.role || "").toLowerCase();
    const userEmail = String(user.email || "").trim();
    const userIdStr = user._id || user.id || user.userId || null;

    const isSenderById =
      userIdStr && message.senderId && String(message.senderId) === String(userIdStr);
    const isSenderByEmail = userEmail && message.senderEmail && String(message.senderEmail) === String(userEmail);
    const isSuperAdmin = ["superadmin", "super_admin"].includes(role);

    // If sender or superadmin -> delete message globally
    if (isSenderById || isSenderByEmail || isSuperAdmin) {
      await Message.findByIdAndDelete(id);
      return res.json({ message: "Message deleted" });
    }

    // Otherwise, if the requester is a recipient, soft-delete for that user only
    const recipientMatch = (rid) => {
      if (!rid) return false;
      const ridStr = String(rid._id || rid.id || rid.value || rid);
      return ridStr === String(userIdStr);
    };

    const isRecipientForThis =
      (message.isBroadcast && role.includes("admin")) ||
      (message.recipientRole === "admin" && role.includes("admin")) ||
      (message.recipientIds || []).some(recipientMatch);

    if (isRecipientForThis) {
      // add to deletedFor if not present
      const already = (message.deletedFor || []).some((d) => String(d) === String(user._id));
      if (!already) {
        message.deletedFor = message.deletedFor || [];
        message.deletedFor.push(user._id);
        await message.save();
      }
      return res.json({ message: "Message removed for user" });
    }

    return res.status(403).json({ message: "Forbidden: You can't delete this message" });
  } catch (err) {
    console.error("deleteMessage error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const replyToMessage = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { body: replyBody, text } = req.body;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const role = String(user.role || "").toLowerCase();
    if (!role.includes("admin")) {
      return res.status(403).json({ message: "Forbidden: Only admins can reply" });
    }

    // Extract userId from token (can be user._id, user.id, etc.)
    const userId = user._id || user.id || user.userId;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user in token" });
    }

    const content = String((replyBody ?? text ?? '').trim());
    if (!content) {
      return res.status(400).json({ message: 'Reply body cannot be empty' });
    }

    const originalMessage = await Message.findById(id);
    if (!originalMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the user is a recipient of the original message
    const isRecipient =
      (originalMessage.isBroadcast && role.includes("admin")) ||
      (originalMessage.recipientRole === "admin" && role.includes("admin")) ||
      (originalMessage.recipientIds || []).some((rid) => String(rid) === String(userId));

    if (!isRecipient) {
      return res.status(403).json({ message: "Forbidden: You are not a recipient of this message" });
    }

    // Decide where the reply goes: if the original has a valid senderId, send directly; otherwise fall back to senderRole
    const senderIdValid =
      originalMessage.senderId && mongoose.Types.ObjectId.isValid(String(originalMessage.senderId));

    const recipientRole = originalMessage.senderRole || "superadmin";

    const replyPayload = {
      senderId: userId, // Ensure this is the extracted userId
      senderRole: user.role,
      senderEmail: user.email || "",
      body: content,
      title: `Re: ${originalMessage.title || "Message"}`,
      recipientRole,
      isBroadcast: false,
      parentMessageId: id, // reference to original message
      grade: originalMessage.grade || "",
      teacherId: originalMessage.teacherId || null,
      teacherName: originalMessage.teacherName || "",
      studentId: originalMessage.studentId || null,
      studentName: originalMessage.studentName || "",
    };

    if (senderIdValid) {
      replyPayload.recipientIds = [originalMessage.senderId];
    }

    const replyMessage = await Message.create(replyPayload);

    await replyMessage.populate("senderId", "name email role");

    console.log("replyToMessage: created reply", {
      id: String(replyMessage._id),
      senderId: String(replyMessage.senderId?._id || replyMessage.senderId),
      parentMessageId: id,
    });

    // Socket emit notification
    try {
      const io = req.app.get("io");
      if (io) {
        io.to(`admin_${originalMessage.senderId}`).emit("newMessage", replyMessage.toObject());
      }
    } catch (emitErr) {
      console.warn("socket emit failed", emitErr);
    }

    return res.status(201).json({
      message: "Reply sent successfully",
      reply: replyMessage.toObject ? replyMessage.toObject() : replyMessage,
    });
  } catch (err) {
    console.error("replyToMessage error", err.message, err.stack);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Fetch replies for a given message (visible to sender/recipient; superadmin can view their threads)
 * GET /api/messages/:id/replies
 */
export const getRepliesForMessage = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const role = String(user.role || "").toLowerCase();
    const userIdStr = String(user._id || user.id || user.userId || "");

    const original = await Message.findById(id);
    if (!original) return res.status(404).json({ message: "Message not found" });

    const isSender = original.senderId && String(original.senderId) === userIdStr;
    const isRecipient = (original.recipientIds || []).some((rid) => String(rid) === userIdStr);
    const isSuperAdmin = role.includes("superadmin") || role.includes("super_admin");

    if (!isSender && !isRecipient && !isSuperAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const replies = await Message.find({ parentMessageId: id })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email role")
      .lean();

    return res.json({ replies });
  } catch (err) {
    console.error("getRepliesForMessage error", err.message, err.stack);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Mark all messages as read for the logged-in admin
 * PUT /api/messages/all/read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const role = String(user.role || "").toLowerCase();
    if (!role.includes("admin")) return res.status(403).json({ message: "Forbidden" });

    const userIdStr = String(user._id || user.id || user.userId || "");
    if (!userIdStr) return res.status(400).json({ message: "Invalid user" });
    const userIdObj = toObjectId(userIdStr);

    // Find all messages targeted to this admin (broadcast or direct)
    const orConditions = [
      { isBroadcast: true, recipientRole: "admin" },
      { recipientRole: "admin" }, // Standalone: all messages where recipientRole is admin
    ];
    if (userIdObj) orConditions.push({ recipientIds: userIdObj });
    orConditions.push({ recipientIds: userIdStr });
    orConditions.push({
      recipientIds: {
        $elemMatch: {
          $or: [
            { _id: userIdObj || userIdStr },
            { id: userIdObj || userIdStr },
            { value: userIdObj || userIdStr },
          ],
        },
      },
    });

    const query = { $or: orConditions };

    // Exclude soft-deleted messages
    const norArr = [];
    if (userIdObj) norArr.push({ deletedFor: userIdObj });
    norArr.push({ deletedFor: userIdStr });
    if (norArr.length) query.$nor = norArr;

    // Update all matching messages: add this user to readBy if not already there
    const result = await Message.updateMany(query, {
      $addToSet: { readBy: { userId: user._id, at: new Date() } },
    });

    console.log("markAllAsRead - updated:", result.modifiedCount);

    return res.json({ success: true, markedCount: result.modifiedCount });
  } catch (err) {
    console.error("markAllAsRead error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete all messages for the logged-in admin (soft-delete)
 * DELETE /api/messages/all
 */
export const deleteAllMessages = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const role = String(user.role || "").toLowerCase();
    if (!role.includes("admin")) return res.status(403).json({ message: "Forbidden" });

    const userIdStr = String(user._id || user.id || user.userId || "");
    if (!userIdStr) return res.status(400).json({ message: "Invalid user" });
    const userIdObj = toObjectId(userIdStr);

    // Find all messages targeted to this admin (broadcast, direct recipientIds, or recipientRole === admin)
    const orConditions = [
      { isBroadcast: true, recipientRole: "admin" },
      { recipientRole: "admin" }, // All messages where recipientRole is admin
    ];
    if (userIdObj) orConditions.push({ recipientIds: userIdObj });
    orConditions.push({ recipientIds: userIdStr });
    orConditions.push({
      recipientIds: {
        $elemMatch: {
          $or: [
            { _id: userIdObj || userIdStr },
            { id: userIdObj || userIdStr },
            { value: userIdObj || userIdStr },
          ],
        },
      },
    });

    const query = { $or: orConditions };

    // Exclude already soft-deleted messages
    const norArr = [];
    if (userIdObj) norArr.push({ deletedFor: userIdObj });
    norArr.push({ deletedFor: userIdStr });
    if (norArr.length) query.$nor = norArr;

    // Soft-delete: add user to deletedFor array
    const result = await Message.updateMany(query, {
      $addToSet: { deletedFor: user._id },
    });

    console.log("deleteAllMessages - deleted for user:", result.modifiedCount);

    return res.json({ success: true, deletedCount: result.modifiedCount });
  } catch (err) {
    console.error("deleteAllMessages error", err);
    return res.status(500).json({ message: "Server error" });
  }
};