import User from "../models/user.js";

export const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
        .sort({ points: -1 })   // ✅ Sort by points in descending order
        .select("name points"); // ✅ Only return name and points

    res.json(topUsers);
    }catch (error) {
        console.error("❌ Error getting leaderboard:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}