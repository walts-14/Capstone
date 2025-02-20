import Quiz from "../models/quiz.schema.js"; 

export const getRandomQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.aggregate([{ $sample: { size: 1 } }]); // Get 1 random question

        if (quiz.length === 0) {
            return res.status(404).json({ error: "No questions found" });
        }

        console.log("Fetched quiz:", quiz[0]); // Log the quiz data
        res.json(quiz[0]); // ✅ Send full quiz object, not just question text

    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ error: "Server error" });
    }
};
