import User from "../models/user.js";
import mongoose from "mongoose";

// Get lives for a user by email
export const getLives = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ lives: user.lives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deduct a life on a wrong answer by email
export const loseLife = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.lives > 0) {
            user.lives -= 1;
            user.lastLifeTime = new Date();
            await user.save();
        }

        res.json({ lives: user.lives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gain a life (streak rewards or purchases) by email
export const gainLife = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.lives < 5) {
            user.lives += 1;
            await user.save();
        }

        res.json({ lives: user.lives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const regenerateLives = async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Ensure lastLifeTime is defined
      const lastTime = user.lastLifeTime ? new Date(user.lastLifeTime) : new Date();
      const now = new Date();
  
      // Calculate minutes passed since last life update
      const minutesPassed = Math.floor((now - lastTime) / (1000 * 60));
  
      // Calculate the number of additional lives based on full 40-minute intervals
      const additionalLives = Math.floor(minutesPassed / 40);
  
      // Only update if at least one full 40-minute interval has passed and user hasn't reached max lives
      if (additionalLives > 0 && user.lives < 5) {
          // Increase lives but cap at 5
          user.lives = Math.min(user.lives + additionalLives, 5);
          // Instead of resetting to now, increment lastLifeTime by the amount of time used
          user.lastLifeTime = new Date(lastTime.getTime() + additionalLives * 40 * 60 * 1000);
          await user.save();
      }
  
      res.json({ lives: user.lives });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

