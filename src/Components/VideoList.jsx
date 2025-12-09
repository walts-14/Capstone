// src/Pages/VideoList.jsx
import React, { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import {scale} from "@cloudinary/url-gen/actions/resize";
import {quality, format} from "@cloudinary/url-gen/actions/delivery";
import {auto} from "@cloudinary/url-gen/qualifiers/quality";
import {auto as autoFormat} from "@cloudinary/url-gen/qualifiers/format";

const cld = new Cloudinary({cloud: {cloudName: 'deohrrkw9'}});

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
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((v) => ({
          id: v._id,
          word: v.word || "Lesson video",
          description: v.description || "",
          // Optimized Cloudinary video URL using SDK
          video: v.publicId
            ? cld.video(v.publicId)
                .resize(scale().width(1000))
                .delivery(quality(auto()))
                .delivery(format(autoFormat()))
                .toURL()
            : v.videoUrl,
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
