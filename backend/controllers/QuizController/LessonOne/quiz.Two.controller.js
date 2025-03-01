import quizTwo from "../../../models/LessonOne/quizTwo.schema.js";

export const getRandomQuizTwo = async (req, res) => {
    try {
        const quiz = await quizTwo.aggregate([{ $sample: { size: 1 } }]); // Get 1 random question

        if (quiz.length === 0) {
            return res.status(404).json({ error: "No questions found" });
        }

       //console.log("Fetched quiz:", quiz[0]); // Log the quiz data
        res.json(quiz[0]); // ✅ Send full quiz object, not just question text

    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ error: "Server error" });
    }
}
