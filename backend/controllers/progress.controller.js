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

    // Fetch current progress and ensure we start from a fresh full tree
    const user = await User.findOne({ email }).select("progress points");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Always clone the default structure to avoid mutating shared state
    const base = JSON.parse(JSON.stringify(progressStructure));
    // Merge existing user progress into base, then overlay incoming updates
    const merged = deepMerge(
      deepMerge(base, user.progress || {}),
      progress
    );

    // Points mapping
    const lecturePoints = { basic: 50, intermediate: 75, advanced: 100 };
    const lessonCompletionBonus = { basic: 100, intermediate: 150, advanced: 200 };

    let pointsToAdd = 0;

    // Helper to check if a lecture step is newly completed
    const isNewlyCompleted = (oldProg, newProg, lvl, term, step) =>
      !oldProg?.[lvl]?.[term]?.[step] && newProg?.[lvl]?.[term]?.[step];

    // Award points for newly completed lectures
    ["basic","intermediate","advanced"].forEach(level => {
      Object.keys(merged[level]).forEach(term => {
        ["step1Lecture","step2Lecture"].forEach(step => {
          if (isNewlyCompleted(user.progress, merged, level, term, step)) {
            pointsToAdd += lecturePoints[level];
          }
        });
      });
    });

    // Award bonus when a lesson is fully completed
    const isLessonCompleted = (prog, lvl, term) =>
      prog[lvl][term] && Object.values(prog[lvl][term]).every(v => v === true);

    ["basic","intermediate","advanced"].forEach(level => {
      Object.keys(merged[level]).forEach(term => {
        if (!isLessonCompleted(user.progress || {}, level, term)
            && isLessonCompleted(merged, level, term)) {
          pointsToAdd += lessonCompletionBonus[level];
        }
      });
    });

    // Persist updates
    user.progress = merged;
    user.points += pointsToAdd;
    await user.save();

    return res.json({ message: "Progress updated", progress: merged, pointsAdded: pointsToAdd, totalPoints: user.points });
  } catch (err) {
    console.error("updateProgressByEmail error:", err);
    return res.status(500).json({ error: err.message });
  }
};
