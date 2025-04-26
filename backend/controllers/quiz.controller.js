import Video from "../models/videoLesson.js";
import Quiz from "../models/quiz.js";

/**
 * Utility: Randomly select n items from an array.
 */
const randomSelect = (array, n) => {
  const copy = [...array];
  const result = [];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  return result;
};

/**
 * Utility: Shuffle an array (Fisher-Yates algorithm).
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

export const createQuiz = async (req, res) => {
    try {
      const { question, choices, correctAnswer } = req.body;
  
      const newQuiz = new Quiz({
        question,
        choices,
        correctAnswer,
      });

      if (!question || !choices || choices.length !== 4 || !correctAnswer) {
        return res.status(400).json({ error: "All fields are required and must be valid." });
      }
  
      await newQuiz.save();
      res.status(201).json({ message: "Quiz created successfully." });
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ error: "Failed to create quiz." });
    }
  };