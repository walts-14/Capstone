import Video from "../models/videoLesson.js";
import Quiz from "../models/quiz.js";

/**
 * Utility: Randomly select n items from an array.
 */
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** Pick n random items from an array */
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
 * Returns 10 random quiz questions for a given lesson part.
 * Query parameters:
 *   - level: string ("basic", "intermediate", "advanced")
 *   - lessonNumber: number (e.g., 1)
 *   - quizPart: number (1 for terms 1–15, 2 for terms 16–30)
 */
export const getRandomQuiz = async (req, res) => {
  try {
    const { level, lessonNumber, quizPart } = req.query;
    if (!level || !lessonNumber || !quizPart) {
      return res.status(400).json({ error: "Missing query parameters: level, lessonNumber, and quizPart are required." });
    }
    const lessonNum = Number(lessonNumber);
    const part = Number(quizPart);

    let startTerm, endTerm;
    if (part === 1) {
      startTerm = 1;
      endTerm = 15;
    } else if (part === 2) {
      startTerm = 16;
      endTerm = 30;
    } else {
      return res.status(400).json({ error: "Invalid quizPart. It should be either 1 or 2." });
    }

    // Fetch finished videos in the term range.
    const videos = await Video.find({
      level,
      lessonNumber: lessonNum,
      termNumber: { $gte: startTerm, $lte: endTerm }
    });

    if (videos.length < 10) {
      return res.status(400).json({ error: "Not enough videos to generate a quiz (need at least 10)." });
    }

    // Randomly select 10 videos for quiz questions.
    const selectedQuestions = randomSelect(videos, 10);

    // Generate randomized choices for each question.
    const questions = selectedQuestions.map(questionVideo => {
      const candidates = videos.filter(video => video._id.toString() !== questionVideo._id.toString());
      if (candidates.length < 3) return null;
      const wrongAnswers = randomSelect(candidates, 3);
      let choices = wrongAnswers.concat([questionVideo]);
      choices = shuffleArray(choices);
      return {
        questionId: questionVideo._id,
        question: `Which video represents the sign "${questionVideo.word}"?`,
        correctAnswer: questionVideo._id,
        choices: choices.map(video => ({
          videoId: video._id,
          word: video.word,
          videoUrl: video.videoUrl,
        })),
      };
    }).filter(q => q !== null);

    res.json(questions);
  } catch (error) {
    console.error("Error generating random quiz:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Returns stored quiz questions for a given lesson part.
 * Query parameters:
 *   - level: string ("basic", "intermediate", "advanced")
 *   - lessonNumber: number (e.g., 1)
 *   - quizPart: number (1 or 2)
 */
export const getStoredQuizQuestions = async (req, res) => {
  try {
    const { level, lessonNumber, quizPart } = req.query;
    console.log("getStoredQuizQuestions called with:", { level, lessonNumber, quizPart });
    if (!level || !lessonNumber || !quizPart) {
      return res.status(400).json({ error: "Missing query parameters: level, lessonNumber, and quizPart are required." });
    }
    const lessonNum = Number(lessonNumber);
    const part = Number(quizPart);

    // Fetch stored quiz questions from Quiz collection
    const quizzes = await Quiz.find({
      level,
      lessonNumber: lessonNum,
      quizPart: part
    }).populate("correctAnswer choices.videoId");

    console.log(`Found ${quizzes.length} quizzes for level=${level}, lessonNumber=${lessonNum}, quizPart=${part}`);

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ error: "No stored quiz questions found for the specified parameters." });
    }

    // Utility to shuffle an array
    const shuffleArray = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // Randomly select up to 10 questions
    const selectedQuizzes = quizzes.length > 10 ? shuffleArray(quizzes).slice(0, 10) : quizzes;

    // Format the response to match frontend expectations with shuffled choices
    const formattedQuizzes = selectedQuizzes.map(q => {
      const shuffledChoices = shuffleArray(q.choices.map(choice => ({
        videoId: choice.videoId._id,
        word: choice.videoId.word,
        videoUrl: choice.videoId.videoUrl,
        label: choice.label
      })));
      return {
        questionId: q._id,
        question: q.question,
        correctAnswer: q.correctAnswer._id,
        choices: shuffledChoices
      };
    });

    res.json(formattedQuizzes);
  } catch (error) {
    console.error("Error fetching stored quiz questions:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { question, level, lessonNumber, quizPart, correctAnswer } = req.body;

    // Basic validation
    if (
      !question ||
      !level ||
      ![1,2].includes(Number(quizPart)) ||
      !lessonNumber ||
      !correctAnswer
    ) {
      return res
        .status(400)
        .json({ error: "question, level, lessonNumber, quizPart and correctAnswer are required." });
    }

    // Determine term range for this part
    const part = Number(quizPart);
    const startTerm = part === 1 ? 1 : 16;
    const endTerm = part === 1 ? 15 : 30;

    // Fetch all videos in the same slice
    const pool = await Video.find({
      level,
      lessonNumber: Number(lessonNumber),
      termNumber: { $gte: startTerm, $lte: endTerm }
    }).select("_id word videoUrl");

    // Must have at least 4 total videos
    if (pool.length < 4) {
      return res
        .status(400)
        .json({ error: "Not enough videos in this level/lesson/part to build choices." });
    }

    // Ensure correctAnswer is in that pool
    const correctVideo = pool.find(v => v._id.toString() === correctAnswer);
    if (!correctVideo) {
      return res
        .status(400)
        .json({ error: "correctAnswer must be a video from the specified level/lesson/part." });
    }

    // Remove the correct one, pick 3 wrong
    const wrongPool = pool.filter(v => v._id.toString() !== correctAnswer);
    const wrongChoices = randomSelect(wrongPool, 3);

    // Combine and shuffle
    const allChoices = shuffleArray([correctVideo, ...wrongChoices]);

    // Build the Quiz doc
    const quizDoc = new Quiz({
      question,
      level,
      lessonNumber,
      quizPart: part,
      correctAnswer,
      choices: allChoices.map((video, idx) => ({
        videoId: video._id,
        label: ["A", "B", "C", "D"][idx]
      }))
    });

    await quizDoc.save();
    res.status(201).json({ message: "Quiz created successfully.", quiz: quizDoc });
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ error: "Failed to create quiz." });
  }
};