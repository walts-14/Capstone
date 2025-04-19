// src/components/QuizSubmissionForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function QuizUpload() {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [videos, setVideos] = useState([]);

  // Load videos to populate the options; assumes videos have _id and word.
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/videos")
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the choices: each choice contains the videoId and a label.
      const formattedChoices = choices.map((videoId, idx) => ({
        videoId,
        label: ["A", "B", "C", "D"][idx],
      }));
  
      // Create the payload that will be sent to the backend.
      const payload = {
        question,
        choices: formattedChoices,
        correctAnswer,
      };
  
      // Post the payload to the backend endpoint.
      const response = await axios.post("http://localhost:5000/api/quizzes/uploadquiz", payload);
      alert(response.data.message);
      // Clear fields after submission.
      setQuestion("");
      setChoices(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2 class = "text-white">Create New Quiz</h2>
      <label class = "text-white">
        Question:
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </label>
      <br />
      <h3 class = "text-white">Select Videos for Answer Choices:</h3>
      {["A", "B", "C", "D"].map((label, idx) => (
        <div key={idx}>
          <label class = "text-white">
            Choice {label}:
            <select value={choices[idx]} onChange={(e) => handleChoiceChange(idx, e.target.value)} required>
              <option value="">--Select Video--</option>
              {videos.map((video) => (
                <option key={video._id} value={video._id}>
                  {video.word}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}
      <br />
      <label className="text-white">
  Correct Answer:
  <select
    value={correctAnswer}
    onChange={(e) => setCorrectAnswer(e.target.value)}
    required
  >
    <option value="">--Select Correct Answer--</option>
    {choices.map((choiceVideoId, idx) => {
      const video = videos.find((v) => v._id === choiceVideoId);
      return (
        video && (
          <option key={choiceVideoId} value={choiceVideoId}>
            {["A", "B", "C", "D"][idx]}: {video.word}
          </option>
        )
      );
    })}
  </select>
</label>
      <br />
      <button type="submit" style={{
            padding: "10px 20px",
            fontSize: "18px",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}>Create Quiz</button>
    </form>
  );
}

export default QuizUpload;
