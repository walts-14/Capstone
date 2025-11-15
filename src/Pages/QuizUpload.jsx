// src/components/QuizSubmissionForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function QuizUpload() {
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("basic");
  const [lessonNumber, setLessonNumber] = useState(1);
  const [quizPart, setQuizPart] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // 1) Fetch all videos once
  useEffect(() => {
    axios
      .get("/api/videos")
      .then((res) => setAllVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // 2) Filter down to only the 15 videos matching level, lessonNumber, and quizPart
  const filteredVideos = allVideos.filter((v) => {
    if (v.level !== level) return false;
    if (v.lessonNumber !== Number(lessonNumber)) return false;

    // term 1–15 for part 1, 16–30 for part 2
    const minTerm = quizPart === 1 ? 1 : 16;
    const maxTerm = quizPart === 1 ? 15 : 30;
    return v.termNumber >= minTerm && v.termNumber <= maxTerm;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/quizzes/uploadquiz", {
        question,
        level,
        lessonNumber,
        quizPart,
        correctAnswer,
      });
      alert("Quiz created!");
      // reset
      setQuestion("");
      setCorrectAnswer("");
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-gray-600 rounded max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-white">Create New Quiz</h2>

      {/* Question */}
      <div>
        <label className="text-white block">Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="mt-1 w-full p-2 rounded border-2 border-white text-white bg-gray-700"
        />
      </div>

      {/* Level */}
      <div>
        <label className="text-white block">Level:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="mt-1 p-2 rounded w-full border-2 border-white text-white bg-gray-700"
        >
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Lesson Number */}
      <div>
        <label className="text-white block">Lesson Number:</label>
        <input
          type="number"
          min="1"
          max="4"
          value={lessonNumber}
          onChange={(e) => setLessonNumber(e.target.value)}
          className="mt-1 p-2 rounded w-full border-2 border-white text-white bg-gray-700"
        />
      </div>

      {/* Quiz Part */}
      <div>
        <label className="text-white block">Quiz Part:</label>
        <select
          value={quizPart}
          onChange={(e) => setQuizPart(Number(e.target.value))}
          className="mt-1 p-2 rounded bg-gray-700 w-full border-2 border-white text-white"
        >
          <option value={1}>Part 1 (Terms 1–15)</option>
          <option value={2}>Part 2 (Terms 16–30)</option>
        </select>
      </div>

      {/* Correct Answer */}
      <div>
        <label className="text-white block">Correct Answer Video:</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
          className="mt-1 p-2 rounded w-full border-2 border-white text-white bg-gray-700"
        >
          <option value="">-- Select Video --</option>
          {filteredVideos.map((v) => (
            <option key={v._id} value={v._id}>
              {`[Term ${v.termNumber}] ${v.word}`}
            </option>
          ))}
        </select>
        {filteredVideos.length === 0 && (
          <p className="text-sm text-yellow-300 mt-1">
            No videos found for that level/lesson/part.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 text-white rounded w-full border-white bg-blue-500"
      >
        Create Quiz
      </button>
    </form>
  );
}

export default QuizUpload;
