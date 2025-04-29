import User from "../models/user.js";

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({
            role: { $nin: ["admin", "superadmin"] }
        })
            .sort({ points: -1 })
            .select("name points profilePic") // only fetch needed fields
            .lean();

        const updatedUsers = users.map(user => ({
            ...user,
            points: user.points ?? 0,
            profilePic: user.profilePic || "" // fallback if needed
        }));

        res.status(200).json(updatedUsers);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: error.message });
    }
};
