import User from "../models/user.js";
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
export const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete previous pic from cloudinary
    if (user.profilePic?.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });

    // Save new profile pic
    user.profilePic = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();
    fs.unlinkSync(req.file.path); // Remove local file
    res.json({
      message: "Profile picture uploaded",
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
