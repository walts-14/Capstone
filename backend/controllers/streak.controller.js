import User from "../models/user.js";

/**
 * Retrieves the user's streak data.
 */
export const getStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("streak");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ streak: user.streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Updates the user's streak data.
 * Expects an object containing the streak information.
 */
export const updateStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const { streak } = req.body;
    const user = await User.findByIdAndUpdate(userId, { streak }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Streak updated", streak: user.streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
