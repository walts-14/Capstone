import User from "../models/user.js";

export const updateStreak = async (req, res) => {
    console.log("🔥 Streak route hit!");

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log("✅ User found:", user);

        const today = new Date().setHours(0, 0, 0, 0);
        const lastActive = user.streak.lastActiveDate
            ? new Date(user.streak.lastActiveDate).setHours(0, 0, 0, 0)
            : null;

        console.log("🟡 Last Active Date:", lastActive);

        if (!lastActive) {
            user.streak.count = 1;
            user.streak.lastActiveDate = new Date();
            await user.save();
            return res.json({ message: "Streak started!", streak: user.streak.count });  // ✅ Only one response
        }

        if (lastActive === today) {
            return res.json({ message: "Streak already counted for today", streak: user.streak.count }); // ✅ Only one response
        }

        if (new Date().getDate() - new Date(lastActive).getDate() === 1) {
            user.streak.count += 1;
        } else if (new Date().getDate() !== new Date(lastActive).getDate()) {
            user.streak.count = 1; // Reset streak only if it's not consecutive days
        }        

        user.streak.lastActiveDate = new Date();
        await user.save();

        res.json({ message: "Streak updated", streak: user.streak.count });  // ✅ Final response here
    } catch (error) {
        console.error("❌ Error updating streak:", error);
        res.status(500).json({ message: "Server error", error: error.message });  // ✅ Error response
    }
};