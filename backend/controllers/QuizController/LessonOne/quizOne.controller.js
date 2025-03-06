import quizOne from "../../../models/LessonOne/quizOne.Schema.js"

let previousQuestion = null;

export const getRandomQuizOne = async (req, res) => {
    try {
        let quiz;
        do {
           quiz = await quizOne.aggregate([{ $sample: { size: 1 } }]); // Get 1 random question
        } while (quiz.length > 0 && quiz[0]._id.toString() === previousQuestion);

        if (quiz.length === 0) {
            return res.status(404).send({ error: "No questions found" });
        }

        previousQuestion = quiz[0]._id.toString();
       //console.log("Fetched quiz:", quiz[0]); // Log the quiz data
        res.json(quiz[0]); // ✅ Send full quiz object, not just question text

    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ error: "Server error" });    
    }
}
