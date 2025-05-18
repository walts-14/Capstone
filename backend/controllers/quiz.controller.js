import Video from "../models/videoLesson.js";
import Quiz from "../models/quiz.js";
import User from "../models/user.js";

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
const quizPointsMap = {
  basic: [10, 5, 2],
  intermediate: [15, 8, 3],
  advanced: [20, 10, 5]
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
 * Expects: userId, level, lessonNumber, quizPart, attempt
 */
export const updateUserPointsForQuiz = async (userId, level, lessonNumber, quizPart, attempt) => {
  const pointsArr = quizPointsMap[level] || [0,0,0];
  const pointsToAdd = attempt === 1 ? pointsArr[0] : attempt === 2 ? pointsArr[1] : pointsArr[2];

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // 1) Add quiz points
  user.points = (user.points || 0) + pointsToAdd;

  // 2) Mark quiz progress step
  // Determine term key
  const levelOffset = lessonOffsets[level] || 0;
  const termIndex = levelOffset + (Number(lessonNumber) - 1);
  const termKeys = lessonsByLevel[level] || [];
  const termKey = termKeys[Number(lessonNumber) - 1];
  if (termKey) {
    user.progress = user.progress || {};
    user.progress[level] = user.progress[level] || {};
    user.progress[level][termKey] = user.progress[level][termKey] || { step1Lecture: false, step1Quiz: false, step2Lecture: false, step2Quiz: false };
    // Set appropriate quiz step true
    user.progress[level][termKey][`step${quizPart}Quiz`] = true;
  }

  await user.save();
  return pointsToAdd;
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

    const quizzes = await Quiz.find({ level, lessonNumber: lessonNum, quizPart: part })
      .populate("correctAnswer choices.videoId");
    if (!quizzes.length) {
      return res.status(404).json({ error: "No stored quizzes found" });
    }

    const formatted = shuffleArray(quizzes).slice(0,10).map(q => ({
      questionId: q._id,
      question: q.question,
      correctAnswer: q.correctAnswer._id,
      choices: shuffleArray(q.choices.map(c => ({ videoId: c.videoId._id, word: c.videoId.word, videoUrl: c.videoId.videoUrl, label: c.label })))
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching stored quizzes:", err);
    res.status(500).json({ error: err.message });
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
