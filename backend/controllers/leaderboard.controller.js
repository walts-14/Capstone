export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().sort({ points: -1 });

        // Add default points if missing
        const updatedUsers = users.map(user => ({
            ...user,
            points: user.points ?? 0
        }));

        res.status(200).json(updatedUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
};
