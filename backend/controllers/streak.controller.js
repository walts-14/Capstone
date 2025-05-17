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

    // Calculate points based on streak day
    const day = streak.currentStreak;
    let pointsToAdd = 0;
    if (day === 1) pointsToAdd = 5;
    else if (day === 2) pointsToAdd = 10;
    else if (day === 3) pointsToAdd = 15;
    else if (day === 4) pointsToAdd = 20;
    else if (day === 5) pointsToAdd = 30;
    else if (day === 6) pointsToAdd = 40;
    else if (day >= 7) pointsToAdd = 50;

    // Find user and update streak and points atomically
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.streak = streak;
    user.points += pointsToAdd;

    await user.save();

    res.json({ message: "Streak and points updated", streak: user.streak, points: user.points, pointsAdded: pointsToAdd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
