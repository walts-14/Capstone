import User from "../models/user.js";

export const getPoints = async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Prevent client/browser caching for points - always return fresh value
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      return res.json({ points: user.points });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const gainPoints = async (req, res) => {
    try {
      const { email } = req.params;
      const { points } = req.body; // Points to add, e.g., { points: 10 }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.points = (user.points || 0) + points;
      await user.save();
      res.json({ points: user.points });
    } catch (error) {
      console.error("Error gaining points:", error);
      res.status(500).json({ message: error.message });
    }
  };