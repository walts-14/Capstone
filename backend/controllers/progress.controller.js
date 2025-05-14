import User from "../models/user.js";

// Exactly the same shape as in your Mongoose schema:
const progressStructure = {
  basic: {
    termsone:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwo:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsthree: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsfour:  { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  intermediate: {
    termsfive:  { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termssix:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsseven: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termseight: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  },
  advanced: {
    termsnine:   { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termsten:    { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termseleven: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
    termstwelve: { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false },
  }
};

// Deep‐merge helper (mutates target)
function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] instanceof Object &&
      key in target &&
      target[key] instanceof Object
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// GET  /api/progress/email/:email
export const getProgressByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("progress");
    console.log("DEBUG: Raw user.progress from DB for", email, ":", user.progress);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 1) start from a fresh full tree, 2) overlay stored progress
    const filled = deepMerge(
      JSON.parse(JSON.stringify(progressStructure)),
      user.progress || {}
    );

    // 3) if we healed anything, save it back
    if (JSON.stringify(filled) !== JSON.stringify(user.progress)) {
      user.progress = filled;
      await user.save();
    }

    return res.json({ progress: filled });
  } catch (err) {
    console.error("getProgressByEmail error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// PUT  /api/progress/email/:email
export const updateProgressByEmail = async (req, res) => {
  try {
    const { email }    = req.params;
    const { progress } = req.body;

    // Fetch current progress to merge
    const user = await User.findOne({ email }).select("progress");
    if (!user) return res.status(404).json({ error: "User not found" });

    // merge incoming deltas into existing full tree
    const merged = deepMerge(
      user.progress || JSON.parse(JSON.stringify(progressStructure)),
      progress
    );

    // Update only the progress field using updateOne to avoid validation errors
    await User.updateOne({ email }, { progress: merged });

    return res.json({ message: "Progress updated", progress: merged });
  } catch (err) {
    console.error("updateProgressByEmail error:", err);
    return res.status(500).json({ error: err.message });
  }
};

