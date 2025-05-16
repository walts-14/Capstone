import User from "../models/user.js";

/**
 * Retrieves the user's streak data.
 */
export const getStreak = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("streak");
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
    const { email } = req.params;
    const { streak } = req.body;

    console.log(`updateStreak called for email: ${email}`);
    console.log(`Streak data received:`, streak);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`User points before update: ${user.points}`);

    // Check if points were already added today
    const lastUpdated = user.streak?.lastUpdated ? new Date(user.streak.lastUpdated) : null;
    const now = new Date();

    console.log(`Last updated date: ${lastUpdated}`);
    console.log(`Current date: ${now}`);

    // If lastUpdated is null, treat as points not added today
    let isSameDay = false;
    if (lastUpdated) {
      isSameDay = lastUpdated.getFullYear() === now.getFullYear() &&
        lastUpdated.getMonth() === now.getMonth() &&
        lastUpdated.getDate() === now.getDate();
    }

    if (isSameDay) {
      // Points already added today, do not add again
      console.log("Points already added today, skipping increment.");
      // Update streak info but keep lastUpdated unchanged
      user.streak.currentStreak = streak.currentStreak;
      user.streak.streakFreeze = streak.streakFreeze;
      await user.save();
      return res.json({ message: "Streak updated, points not added again today", streak: user.streak, points: user.points, pointsAdded: 0 });
    }

    // Calculate points based on currentStreak from request body
    const day = streak.currentStreak;
    let pointsToAdd = 0;
    if (day === 1) pointsToAdd = 5;
    else if (day === 2) pointsToAdd = 10;
    else if (day === 3) pointsToAdd = 15;
    else if (day === 4) pointsToAdd = 20;
    else if (day === 5) pointsToAdd = 30;
    else if (day === 6) pointsToAdd = 40;
    else if (day >= 7) pointsToAdd = 50;

    // Add points and update streak info including lastUpdated to now
    user.points += pointsToAdd;
    user.streak.currentStreak = streak.currentStreak;
    user.streak.streakFreeze = streak.streakFreeze;
    user.streak.lastUpdated = now;

    // Mark streak as modified to ensure mongoose detects changes
    user.markModified('streak');

    await user.save();

    console.log(`User points after update: ${user.points}`);

    res.json({ message: "Streak and points updated", streak: user.streak, points: user.points, pointsAdded: pointsToAdd });
  } catch (err) {
    console.error("Error in updateStreak:", err);
    res.status(500).json({ error: err.message });
  }
};
