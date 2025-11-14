import User from "../models/user.js";

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

async function updateStreakAndAwardPoints(user, streak) {
  let pointsToAdd = 0;
  const prevStreak = user.streak?.currentStreak || 0;
  const prevLast = user.streak?.lastUpdated ? String(user.streak.lastUpdated) : null;

  // New account: if there's no previous lastUpdated and incoming is Day 1, award immediately
  if (!prevLast && Number(streak.currentStreak) === 1) {
    pointsToAdd = 5;
  }

  // Only consider awarding points when incoming lastUpdated is today and we haven't awarded for today yet
  if (pointsToAdd === 0 && isToday(streak.lastUpdated) && (!prevLast || !isToday(prevLast))) {
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
    }

    // Reset to 1 after missing days: award day 1 points
    else if (incomingDay === 1) {
      // If there was no previous lastUpdated or previous was more than 1 day ago, award day1 points
      if (!prevLast) {
        pointsToAdd = 5;
      } else {
        const daysDiff = diffDaysBetween(new Date().toISOString(), prevLast);
        if (daysDiff > 1) {
          pointsToAdd = 5;
        }
      }
    }
  }

  // If we determined points should be added, perform an atomic conditional update
  if (pointsToAdd > 0) {
    // Build a per-day guard to ensure only one award per calendar day
    const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const query = {
      _id: user._id,
      "streak.lastUpdated": prevLast,
      $or: [ { lastPointsAwarded: { $exists: false } }, { lastPointsAwarded: { $ne: todayKey } } ]
    };

    const update = { $set: { streak, lastPointsAwarded: todayKey }, $inc: { points: pointsToAdd } };

    const updated = await User.findOneAndUpdate(query, update, { new: true });

    if (updated) {
      return { message: "Streak and points updated", streak: updated.streak, points: updated.points, pointsAdded: pointsToAdd };
    }

    // If we reach here, a concurrent request already modified the streak or already awarded today — don't double-award.
    const fresh = await User.findById(user._id);
    fresh.streak = streak;
    await fresh.save();
    return { message: "Streak updated (concurrent update prevented double-award)", streak: fresh.streak, points: fresh.points, pointsAdded: 0 };
  }

  // No points to add — just save the incoming streak
  user.streak = streak;
  await user.save();

  return { message: "Streak and points updated", streak: user.streak, points: user.points, pointsAdded: pointsToAdd };
}

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

export const updateStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const { streak } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await updateStreakAndAwardPoints(user, streak);
    res.json(result);
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

export const updateStreakByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { streak } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await updateStreakAndAwardPoints(user, streak);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};