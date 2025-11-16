import User from "../models/user.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import { comparePassword } from "../middlewares/auth.js";

export const addPointsToUser = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.points += points;
    await user.save();
  } catch (error) {
    console.error("Error adding points to user:", error);
    throw error;
  }
};

/**
 * Logs in an existing user.
 * This function verifies the user's credentials and returns a JWT token if successful.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt for:", email);

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ No user found with this email");
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔍 Debugging logs for password check
    console.log("Entered password:", password);
    console.log("Stored (hashed) password:", user.password);

    const match = await comparePassword(password, user.password);
    console.log("Password comparison result:", match);
    if (!match) {
      console.log("❌ Password does not match");
      console.log("Password comparison details:", {
        inputLength: password.length,
        storedLength: user.password.length,
        inputType: typeof password,
        storedType: typeof user.password,
      });
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      status: "ok",
      success: true,
      message: "Login Successful",
      data: token,
      user: { _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("🔥 Server error during login:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

/// Profile Picture Upload Function
// Replace your current uploadProfilePicture with this

export const uploadProfilePicture = async (req, res) => {
  try {
    console.info('uploadProfilePicture: incoming request', {
      hasAuthHeader: !!req.headers.authorization,
      reqUserPresent: !!req.user,
    });

    // AUTH CHECK
    if (!req.user || !req.user.id) {
      console.warn('uploadProfilePicture: missing req.user');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // FILE CHECK
    if (!req.file) {
      console.warn('uploadProfilePicture: no file attached (req.file is undefined). Check multer and field name.');
      return res.status(400).json({ message: 'No file uploaded. Make sure form field is "image" and multer is configured with .single("image")' });
    }

    console.info('uploadProfilePicture: req.file', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    // get user
    const user = await User.findById(req.user.id);
    if (!user) {
      // remove uploaded temp file to avoid leaks
      try { if (req.file.path) fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(404).json({ message: "User not found" });
    }

    // Delete previous pic from cloudinary (if exists)
    if (user.profilePic?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      } catch (destroyErr) {
        console.warn('uploadProfilePicture: cloudinary destroy warning', destroyErr.message);
        // don't abort; proceed with uploading new one
      }
    }

    // Upload new image to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });
    } catch (cloudErr) {
      console.error('uploadProfilePicture: cloudinary upload failed', cloudErr);
      // cleanup local file
      try { if (req.file.path) fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(500).json({ error: 'Cloudinary upload failed', details: cloudErr.message });
    }

    // Save in DB
    user.profilePic = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();

    // remove local temp file after successful upload
    try {
      if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn('uploadProfilePicture: failed to unlink temp file', e.message);
    }

    console.info('uploadProfilePicture: success', {
      userId: user._id.toString(),
      public_id: user.profilePic.public_id,
      url: user.profilePic.url,
    });

    return res.status(200).json({
      message: "Profile picture uploaded",
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error('uploadProfilePicture: handler error', { message: err.message, stack: err.stack });
    // Attempt to remove the temp file if it exists
    try { if (req.file?.path) fs.unlinkSync(req.file.path); } catch (e) {}
    return res.status(500).json({ error: 'Server error during upload', details: err.message });
  }
};


/// Delete Profile Picture Function
export const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove from Cloudinary
    if (user.profilePic?.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Set to default image
    user.profilePic = {
      url: "https://res.cloudinary.com/deohrrkw9/image/upload/v1745911019/changepic_qrpmur.png",
      public_id: null,
    };

    await user.save();

    res.status(200).json({ message: "Profile picture deleted and reset to default" });
  } catch (err) {
    console.error("Error deleting profile picture:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Fetches a user by email.
 * This will be used to get the user details for profile information (name, username, etc.).
 */
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).lean(); // lean() helps return a plain JS object

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        yearLevel: user.yearLevel,
        role: user.role,
        profilePic: user.profilePic?.url || null,
      },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
