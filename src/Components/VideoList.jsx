import React, { useEffect, useState } from "react";

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div>
      {videos.map((video) => (
        <video key={video._id} controls width="500">
          <source src={video.url} type="video/mp4" />
        </video>
      ))}
    </div>
  );
};

export default VideoList;
