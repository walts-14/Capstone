import User from "../models/user.js";

export const getLeaderboard = async (req, res) => {
    try {
        // Use .lean() to get plain objects instead of Mongoose documents.
        const users = await User.find().sort({ points: -1 }).lean();

        // Map over the plain objects and add default points if missing
        const updatedUsers = users.map(user => ({
            ...user,
            points: user.points ?? 0
        }));

        res.status(200).json(updatedUsers);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: error.message });
    }
};
