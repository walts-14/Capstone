// src/components/VideoUploader.js
import React, { useState } from "react";
import axios from "axios";

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("basic");
  const [lessonNumber, setLessonNumber] = useState(1);
  const [termNumber, setTermNumber] = useState(1);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");

  // Handle file change for video upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle word (sign) input change
  const handleWordChange = (e) => {
    setWord(e.target.value);
  };

  // Handle description input change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle level selection change
  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  // Handle lesson number change
  const handleLessonNumberChange = (e) => {
    setLessonNumber(Number(e.target.value));
  };

  // Handle term number change
  const handleTermNumberChange = (e) => {
    setTermNumber(Number(e.target.value));
  };

  // Upload video to backend
  const uploadVideo = async () => {
    if (!selectedFile || !word) {
      alert("Please select a video file and enter the sign (word).");
      return;
    }

    // Create a new FormData and append file and metadata fields
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("word", word);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("lessonNumber", lessonNumber);
    formData.append("termNumber", termNumber);

    try {
      const response = await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.videoUrl) {
        setUploadedVideoUrl(response.data.videoUrl);
      }
      alert(response.data.message);
      // Optionally clear the form fields after successful upload.
      setSelectedFile(null);
      setWord("");
      setDescription("");
      setLevel("basic");
      setLessonNumber(1);
      setTermNumber(1);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  // Define simple styling for inputs (optional)
  const inputStyle = {
    color: "white",
    fontSize: "18px",
    width: "400px",
    padding: "10px",
    backgroundColor: "#333",
    border: "none",
    borderRadius: "5px",
    margin: "10px 0",
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Upload Your Video</h2>
      <div>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ ...inputStyle, width: "auto", color: "white" }}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter sign (word)"
          value={word}
          onChange={handleWordChange}
          style={inputStyle}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter video description"
          value={description}
          onChange={handleDescriptionChange}
          style={inputStyle}
          required
        />
      </div>
      <div>
        <label style={{ color: "white" }}>Level:&nbsp;</label>
        <select value={level} onChange={handleLevelChange} style={inputStyle} required>
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div>
        <label style={{ color: "white" }}>Lesson Number:&nbsp;</label>
        <input
          type="number"
          value={lessonNumber}
          onChange={handleLessonNumberChange}
          min="1"
          max="4"
          style={inputStyle}
          required
        />
      </div>
      <div>
        <label style={{ color: "white" }}>Term Number:&nbsp;</label>
        <input
          type="number"
          value={termNumber}
          onChange={handleTermNumberChange}
          min="1"
          max="30"
          style={inputStyle}
          required
        />
      </div>
      <div>
        <button
          onClick={uploadVideo}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Upload Video
        </button>
      </div>
      {uploadedVideoUrl && (
        <div>
          <p style={{ color: "white" }}>Uploaded Video:</p>
          <video controls width="400">
            <source src={uploadedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;