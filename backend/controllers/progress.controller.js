import User from "../models/user.js";

/**
 * Retrieves a user's progress data (structured as in the frontend) by user ID.
 */
export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("progress");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ progress: user.progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Updates a user's progress data.
 * Expects the same nested structure as in the frontend.
 */
export const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { progress } = req.body;
    const user = await User.findByIdAndUpdate(userId, { progress }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Progress updated", progress: user.progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
