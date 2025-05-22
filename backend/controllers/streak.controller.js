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
// Helper to check if a date is today
function isToday(date) {
  if (!date) return false;
  const now = new Date();
  const d = new Date(date);
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate();
}

export const updateStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const { streak } = req.body;

    // Find user and update streak and points atomically
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });


    let pointsToAdd = 0;
    // Only add points if:
    // - lastUpdated is today
    // - previous lastUpdated is not today
    // - currentStreak is exactly previousStreak + 1
    const prevStreak = user.streak?.currentStreak || 0;
    // Only add points if:
    // - lastUpdated is today
    // - previous lastUpdated is not today
    // - currentStreak is exactly previousStreak + 1
    // - lastUpdated is different from previous lastUpdated (prevents double add on refresh)
    if (
      isToday(streak.lastUpdated) &&
      (!user.streak || !isToday(user.streak.lastUpdated)) &&
      streak.currentStreak === prevStreak + 1 &&
      (!user.streak.lastUpdated || new Date(streak.lastUpdated).getTime() !== new Date(user.streak.lastUpdated).getTime())
    ) {
      const day = streak.currentStreak;
      if (day === 1) pointsToAdd = 5;
      else if (day === 2) pointsToAdd = 10;
      else if (day === 3) pointsToAdd = 15;
      else if (day === 4) pointsToAdd = 20;
      else if (day === 5) pointsToAdd = 30;
      else if (day === 6) pointsToAdd = 40;
      else if (day >= 7) pointsToAdd = 50;
      user.points += pointsToAdd;
    } else {
      // Prevent double points: do not add points again for the same day or if not a valid increment
      pointsToAdd = 0;
    }

    user.streak = streak;
    await user.save();

    res.json({ message: "Streak and points updated", streak: user.streak, points: user.points, pointsAdded: pointsToAdd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
export const getStreakByEmail = async (req, res) => {
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
 * Updates the user's streak data by email.
 * Expects body { streak: { currentStreak, lastUpdated, … } }.
 */
export const updateStreakByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { streak } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });


    let pointsToAdd = 0;
    // Only add points if:
    // - lastUpdated is today
    // - previous lastUpdated is not today
    // - currentStreak is exactly previousStreak + 1
    const prevStreak = user.streak?.currentStreak || 0;
    if (
      isToday(streak.lastUpdated) &&
      (!user.streak || !isToday(user.streak.lastUpdated)) &&
      streak.currentStreak === prevStreak + 1
    ) {
      const day = streak.currentStreak;
      if (day === 1) pointsToAdd = 5;
      else if (day === 2) pointsToAdd = 10;
      else if (day === 3) pointsToAdd = 15;
      else if (day === 4) pointsToAdd = 20;
      else if (day === 5) pointsToAdd = 30;
      else if (day === 6) pointsToAdd = 40;
      else if (day >= 7) pointsToAdd = 50;
      user.points += pointsToAdd;
    }

    user.streak = streak;
    await user.save();

    res.json({
      message: "Streak and points updated",
      streak: user.streak,
      points: user.points,
      pointsAdded: pointsToAdd
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};