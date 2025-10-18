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

// Helper to compute difference in whole days between two dates (a - b)
function diffDaysBetween(a, b) {
  if (!a || !b) return Infinity;
  const A = new Date(a).setHours(0,0,0,0);
  const B = new Date(b).setHours(0,0,0,0);
  const diffTime = A - B;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export const updateStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const { streak } = req.body;

    // Find user and update streak and points atomically
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });


    let pointsToAdd = 0;
    const prevStreak = user.streak?.currentStreak || 0;
    const prevLast = user.streak?.lastUpdated ? String(user.streak.lastUpdated) : null;

    // Only consider awarding points when incoming lastUpdated is today and we haven't awarded for today yet
    if (isToday(streak.lastUpdated) && (!prevLast || !isToday(prevLast))) {
      const incomingDay = Number(streak.currentStreak) || 0;

      // Consecutive increment: incomingDay === prevStreak + 1
      if (incomingDay === prevStreak + 1) {
        const day = incomingDay;
        if (day === 1) pointsToAdd = 5;
        else if (day === 2) pointsToAdd = 10;
        else if (day === 3) pointsToAdd = 15;
        else if (day === 4) pointsToAdd = 20;
        else if (day === 5) pointsToAdd = 30;
        else if (day === 6) pointsToAdd = 40;
        else if (day >= 7) pointsToAdd = 50;
        user.points += pointsToAdd;
      }

      // Reset to 1 after missing days: award day 1 points
      else if (incomingDay === 1) {
        // If there was no previous lastUpdated or previous was more than 1 day ago, award day1 points
        if (!prevLast) {
          pointsToAdd = 5;
          user.points += pointsToAdd;
        } else {
          const daysDiff = diffDaysBetween(new Date().toISOString(), prevLast);
          if (daysDiff > 1) {
            pointsToAdd = 5;
            user.points += pointsToAdd;
          }
        }
      }
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
    const prevStreak = user.streak?.currentStreak || 0;
    const prevLast = user.streak?.lastUpdated ? String(user.streak.lastUpdated) : null;

    if (isToday(streak.lastUpdated) && (!prevLast || !isToday(prevLast))) {
      const incomingDay = Number(streak.currentStreak) || 0;

      if (incomingDay === prevStreak + 1) {
        const day = incomingDay;
        if (day === 1) pointsToAdd = 5;
        else if (day === 2) pointsToAdd = 10;
        else if (day === 3) pointsToAdd = 15;
        else if (day === 4) pointsToAdd = 20;
        else if (day === 5) pointsToAdd = 30;
        else if (day === 6) pointsToAdd = 40;
        else if (day >= 7) pointsToAdd = 50;
        user.points += pointsToAdd;
      } else if (incomingDay === 1) {
        if (!prevLast) {
          pointsToAdd = 5;
          user.points += pointsToAdd;
        } else {
          const daysDiff = diffDaysBetween(new Date().toISOString(), prevLast);
          if (daysDiff > 1) {
            pointsToAdd = 5;
            user.points += pointsToAdd;
          }
        }
      }
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