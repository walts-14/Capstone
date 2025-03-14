import User from "../models/user.js";

// Get lives for a user
export const getLives = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ lives: user.lives });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deduct a life on a wrong answer
export const loseLife = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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

// Gain a life (streak rewards or purchases)
export const gainLife = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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
