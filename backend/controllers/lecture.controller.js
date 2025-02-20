import Lecture from "../models/lecture.schema.js";

export const getLecture = async (req, res) => {
    try {
        const { title } = req.params; // Extract title from request params
       // console.log("Received request for title:", title); // Debugging log

        const lecture = await Lecture.findOne({ title: new RegExp(`^${title}$`, "i") }); // Case-insensitive search

        if (!lecture) {
            console.log("Lecture not found");
            return res.status(404).json({ error: "Lecture not found" });
        }

        res.status(200).json(lecture);
    } catch (error) {
        console.error("Error fetching lecture:", error);
        res.status(500).json({ error: "Server error" });
    }
};
