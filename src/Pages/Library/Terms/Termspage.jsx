// Termspage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Termslist from "./Termslist";
import Sidenav from "../../../Components/Sidenav";
import LibraryButtons from "../LibraryButtons";

function Termspage() {
  const { termId } = useParams(); // e.g., "termsone", "termstwo", etc.
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/videos${termId ? `?lessonKey=${termId}` : ""}`)
      .then((response) => response.json())
      .then((data) => {
        // Transform data using the new schema fields.
        const transformedData = data.map((video) => ({
          // Set id as string (video._id is already a string)
          id: video._id,
          word: video.word, // Using "word" instead of "title"
          definition: video.description || "Definition not provided",
          video: video.videoUrl, // Using "videoUrl" instead of "url"
        }));
        setTerms(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, [termId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="termspage-content">
      <Sidenav />
      <LibraryButtons />
      <Termslist LessonTerms={terms} lessonKey={termId} />
    </div>
  );
}

export default Termspage;
