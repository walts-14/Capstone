 import Video from "../models/videoLesson.js"
import Quiz from "../models/quiz.js"
import User from "../models/user.js"

/**
 * Utility: Randomly shuffle an array in-place.
 */
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Pick n random items from an array.
 */
const randomSelect = (arr, n) => {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
};

/**
 * Map quiz attempts to points for each level.
 */
// Points tiers as specified by the user. Indexing: 1st/2nd, 3rd, 4th+
const quizPointsMap = {
  basic:        { firstTwo: 10, third: 5, fourthPlus: 2 },
  intermediate: { firstTwo: 15, third: 8, fourthPlus: 3 },
  advanced:     { firstTwo: 20, third: 10, fourthPlus: 5 }
};

// Helper term keys by level
const lessonsByLevel = {
  basic:        ["termsone","termstwo","termsthree","termsfour"],
  intermediate: ["termsfive","termssix","termsseven","termseight"],
  advanced:     ["termsnine","termsten","termseleven","termstwelve"],
};
const lessonOffsets = { basic: 0, intermediate: 4, advanced: 8 };

/**
 * Returns 10 random quiz questions for a given lesson part.
 * Query params: level, lessonNumber, quizPart
 */
export const getRandomQuiz = async (req, res) => {
  try {
    const { level, lessonNumber, quizPart } = req.query;
    const part = Number(quizPart);
    const lessonNum = Number(lessonNumber);
    if (!level || !lessonNum || ![1,2].includes(part)) {
      return res.status(400).json({ error: "Missing/invalid level, lessonNumber or quizPart" });
    }

    const startTerm = part === 1 ? 1 : 16;
    const endTerm   = part === 1 ? 15 : 30;

    const videos = await Video.find({ level, lessonNumber: lessonNum, termNumber: { $gte: startTerm, $lte: endTerm } });
    if (videos.length < 10) {
      return res.status(400).json({ error: "Not enough videos for quiz generation (need ≥10)" });
    }

    const selected = randomSelect(videos, 10);
    const questions = selected.map(video => {
      const candidates = videos.filter(v => v._id.toString() !== video._id.toString());
      const wrong = randomSelect(candidates, 3);
      const choices = shuffleArray([...wrong, video]).map(v => ({ videoId: v._id, word: v.word, videoUrl: v.videoUrl }));
      return {
        questionId: video._id,
        question: `Which video represents the sign "${video.word}"?`,
        correctAnswer: video._id,
        choices
      };
    });

    res.json(questions);
  } catch (err) {
    console.error("Error generating random quiz:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update user points and progress for a quiz attempt.
 * Expects: userId, level, lessonNumber, quizPart, attempt, correctCount
 * Returns: { pointsEarned, totalPoints, passed }
 */
export const updateUserPointsForQuiz = async (userEmail, level, lessonNumber, quizPart, attempt, correctCount) => {
  const correct = Number(correctCount) || 0;
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new Error('User not found');

  // Normalize inputs
  const lvl = String(level);
  const lessonIdx = Number(lessonNumber) - 1; // 0-based index into lessonsByLevel[level]
  const part = Number(quizPart) === 2 ? 2 : 1;

  // Resolve term key used in progress and quizAttempts
  const termKeys = lessonsByLevel[lvl] || [];
  const termKey = termKeys[lessonIdx];
  if (!termKey) throw new Error('Invalid level/lessonNumber');

  // Ensure structures exist
  // Use an atomic increment on the nested quizAttempts field to avoid race conditions
  const attemptPath = `quizAttempts.${lvl}.${termKey}.part${part}Attempts`;

  // Ensure the nested path exists by initializing with default object before atomic update if necessary
  // Use findOneAndUpdate with $setOnInsert logic if the full structure doesn't exist. Simpler: ensure top-level containers exist then $inc.
  await User.updateOne(
    { email: userEmail },
    { $set: { [`quizAttempts.${lvl}.${termKey}`]: user.quizAttempts?.[lvl]?.[termKey] || { part1Attempts: 0, part2Attempts: 0 } } },
    { upsert: false }
  );

  // Atomically increment the attempt counter and return the updated document
  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { $inc: { [attemptPath]: 1 } },
    { new: true }
  );

  if (!updatedUser) throw new Error('User not found after increment');

  const newAttemptNumber = updatedUser.quizAttempts?.[lvl]?.[termKey]?.[`part${part}Attempts`] || 0;
  const storedAttempts = newAttemptNumber - 1;

  // Debug logging: show previous storedAttempts and newAttemptNumber (server logs)
  try {
    console.log(`quizAttempts debug for ${userEmail}: level=${lvl}, term=${termKey}, part=${part}, previous=${storedAttempts}, new=${newAttemptNumber}`);
  } catch (e) {}

  // Determine per-answer points according to the tiered rules
  const tiers = quizPointsMap[lvl] || { firstTwo: 0, third: 0, fourthPlus: 0 };
  let perAnswer = 0;
  if (newAttemptNumber === 1 || newAttemptNumber === 2) perAnswer = tiers.firstTwo;
  else if (newAttemptNumber === 3) perAnswer = tiers.third;
  else perAnswer = tiers.fourthPlus;

  const pointsToAdd = perAnswer * correct;
  const passed = correct >= 7;

  let pointsEarned = 0;
  let finalTotalPoints = updatedUser.points || 0;

  if (passed) {
    pointsEarned = pointsToAdd;
    // Atomically add points and set progress flag
    const progressPath = `progress.${lvl}.${termKey}.step${part}Quiz`;
    const afterPointsUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $inc: { points: pointsEarned }, $set: { [progressPath]: true } },
      { new: true }
    );
    finalTotalPoints = afterPointsUser.points || 0;
  }

  return { pointsEarned, totalPoints: finalTotalPoints, passed, attemptNumber: newAttemptNumber };
};

/**
 * Returns stored quiz questions for a given lesson part.
 */
export const getStoredQuizQuestions = async (req, res) => {
  try {
    const { level, lessonNumber, quizPart } = req.query;
    const lessonNum = Number(lessonNumber);
    const part = Number(quizPart);
    if (!level || !lessonNum || ![1,2].includes(part)) {
      return res.status(400).json({ error: "Missing/invalid level, lessonNumber or quizPart" });
    }

    // populate correctAnswer and nested videoId inside choices
    const quizzes = await Quiz.find({ level, lessonNumber: lessonNum, quizPart: part })
      .populate("correctAnswer choices.videoId");

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ error: "No stored quizzes found" });
    }

    const shuffled = shuffleArray([...quizzes]); // copy then shuffle
    const formatted = [];

    for (let i = 0; i < shuffled.length && formatted.length < 10; i++) {
      const q = shuffled[i];
      // skip if quiz or required populated fields are missing
      if (!q) {
        //console.warn(`Skipping null quiz at index ${i}`);
        continue;
      }
      if (!q.correctAnswer) {
        //console.warn(`Skipping quiz ${q._id} because correctAnswer is null (maybe deleted).`);
        continue;
      }
      if (!Array.isArray(q.choices)) {
        //console.warn(`Skipping quiz ${q._id} because choices is not an array.`);
        continue;
      }

      // Build choices and filter out any invalid ones (e.g. videoId === null)
      const choices = q.choices
        .map(c => {
          const vid = c && c.videoId;
          if (!vid) return null; // populated reference missing
          return {
            videoId: vid._id,
            word: vid.word || "",
            videoUrl: vid.videoUrl || "",
            label: c.label
          };
        })
        .filter(Boolean);

      // require at least 4 valid choices; otherwise skip the quiz
      if (choices.length < 4) {
        console.warn(`Skipping quiz ${q._id} because it has <4 valid choices after populate.`);
        continue;
      }

      formatted.push({
        questionId: q._id,
        question: q.question || "",
        correctAnswer: q.correctAnswer._id,
        choices: shuffleArray(choices)
      });
    }

    if (formatted.length === 0) {
      return res.status(404).json({ error: "No valid stored quizzes found (populated refs missing?)" });
    }

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching stored quizzes:", err);
    res.status(500).json({ error: err.message });
  }
};

// Debug: return the stored attempt count for a given user/level/lesson/part
export const getUserQuizAttempt = async (req, res) => {
  try {
    const { email, level, lessonNumber, quizPart } = req.query;
    if (!email || !level || !lessonNumber || !quizPart) {
      return res.status(400).json({ error: 'email, level, lessonNumber and quizPart are required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const lvl = String(level);
    const lessonIdx = Number(lessonNumber) - 1;
    const part = Number(quizPart) === 2 ? 2 : 1;
    const termKeys = lessonsByLevel[lvl] || [];
    const termKey = termKeys[lessonIdx];
    if (!termKey) return res.status(400).json({ error: 'Invalid level/lessonNumber' });

    const storedAttempts = (user.quizAttempts && user.quizAttempts[lvl] && user.quizAttempts[lvl][termKey] && user.quizAttempts[lvl][termKey][`part${part}Attempts`]) || 0;
    return res.json({ storedAttempts });
  } catch (err) {
    console.error('Error in getUserQuizAttempt:', err);
    return res.status(500).json({ error: err.message });
  }
};


export const createQuiz = async (req, res) => {
  try {
    const { question, level, lessonNumber, quizPart, correctAnswer } = req.body;
    const part = Number(quizPart);
    const lessonNum = Number(lessonNumber);
    if (!question || !level || ![1,2].includes(part) || !lessonNum || !correctAnswer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const startTerm = part === 1 ? 1 : 16;
    const endTerm   = part === 1 ? 15 : 30;
    const pool = await Video.find({ level, lessonNumber: lessonNum, termNumber: { $gte: startTerm, $lte: endTerm } });
    if (pool.length < 4) {
      return res.status(400).json({ error: "Not enough videos to build quiz" });
    }

    const correctVideo = pool.find(v => v._id.toString() === correctAnswer);
    if (!correctVideo) {
      return res.status(400).json({ error: "correctAnswer not in video pool" });
    }

    const wrong = randomSelect(pool.filter(v => v._id.toString() !== correctAnswer), 3);
    const all = shuffleArray([correctVideo, ...wrong]);

    const quizDoc = new Quiz({ question, level, lessonNumber: lessonNum, quizPart: part, correctAnswer, choices: all.map((v,i) => ({ videoId: v._id, label: ["A","B","C","D"][i] })) });
    await quizDoc.save();

    res.status(201).json({ message: "Quiz created", quiz: quizDoc });
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ error: err.message });
  }
};
