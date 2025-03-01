import quizOne from "../../../models/LessonOne/quizOne.Schema.js"

export const getRandomQuizOne = async (req, res) => {
    try {
        const quiz = await quizOne.aggregate([{ $sample: { size: 1 } }]); // Get 1 random question

        if (quiz.length === 0) {
            return res.status(404).send({ error: "No questions found" });
        }

       //console.log("Fetched quiz:", quiz[0]); // Log the quiz data
        res.json(quiz[0]); // ✅ Send full quiz object, not just question text

    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ error: "Server error" });
    }
}
