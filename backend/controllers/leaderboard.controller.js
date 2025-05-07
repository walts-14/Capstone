// backend/controllers/leaderboard.controller.js
import User from "../models/user.js";

const DEFAULT_PROFILE_PIC_URL = "https://res.cloudinary.com/deohrrkw9/image/upload/v1745911019/changepic_qrpmur.png";

export const getLeaderboard = async (req, res) => {
  try {
    // Exclude admins & super_admins, sort by points desc, only fetch needed fields
    const users = await User.find({
      role: { $nin: ["admin", "super_admin"] }
    })
      .sort({ points: -1 })
      .select("name email points profilePic yearLevel")
      .lean();

    // Normalize missing values
    const updatedUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      points: u.points ?? 0,
      profilePic: (u.profilePic && u.profilePic.url) || DEFAULT_PROFILE_PIC_URL,
      yearLevel: u.yearLevel || "N/A"
    }));

    res.status(200).json(updatedUsers);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ message: error.message });
  }
};
