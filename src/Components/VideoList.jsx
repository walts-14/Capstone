// src/Pages/VideoList.jsx
import React, { useEffect, useState } from "react";

const CLOUD_NAME = "deohrrkw9"; // your Cloudinary cloud name

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheKey = "all-videos";
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setVideos(JSON.parse(cached));
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((v) => ({
          id: v._id,
          word: v.word || "Lesson video",
          description: v.description || "",
          // High-quality Cloudinary fallback
          video: v.videoUrl || (v.publicId
            ? `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_mp4,q_100/${v.publicId}.mp4`
            : null),
        }));
        setVideos(transformed);
        localStorage.setItem(cacheKey, JSON.stringify(transformed));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading videos…</p>;
  if (videos.length === 0) return <p>No videos found.</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1rem" }}>
      {videos.map((v) => (
        <div key={v.id} style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: ".25rem" }}>{v.word}</h3>
          {v.description && <p style={{ marginTop: 0 }}>{v.description}</p>}

          {v.video ? (
            <video
              controls
              width="800"
              preload="auto"
              style={{ display: "block", background: "#000" }}
            >
              <source src={v.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoList;
