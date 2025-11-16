import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Termslist from "./Termslist";
import Sidenav from "../../../Components/Sidenav";
import LibraryButtons from "../LibraryButtons";
import Lessons from "../../../Components/dataLessons";
import Back from "../../../assets/BackButton.png";
import Lessonlist from "../../../Components/Lessonlist";

function Termspage() {
  const { termId } = useParams(); // e.g., "termsone", "termstwo", etc.
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const lesson = Lessons[termId]; // Get lesson details (dataLessons)

  // Map your termId strings to the corresponding level and lessonNumber
  const termMap = {
    termsone: { level: "basic", lessonNumber: 1 },
    termstwo: { level: "basic", lessonNumber: 2 },
    termsthree: { level: "basic", lessonNumber: 3 },
    termsfour: { level: "basic", lessonNumber: 4 },
    termsfive: { level: "intermediate", lessonNumber: 1 },
    termssix: { level: "intermediate", lessonNumber: 2 },
    termsseven: { level: "intermediate", lessonNumber: 3 },
    termseight: { level: "intermediate", lessonNumber: 4 },
    termsnine: { level: "advanced", lessonNumber: 1 },
    termsten: { level: "advanced", lessonNumber: 2 },
    termseleven: { level: "advanced", lessonNumber: 3 },
    termstwelve: { level: "advanced", lessonNumber: 4 },
    // add more mappings if you have intermediate/advanced...
  };

  // Destructure the mapping (or undefined if not found)
  const mapping = termMap[termId];
  const level = mapping?.level;
  const forcedDifficulty = level
    ? level === "basic"
      ? "Basic"
      : level === "intermediate"
      ? "Intermediate"
      : "Advanced"
    : undefined;
  const lessonNumber = mapping?.lessonNumber;

  // Back handler to go back to the list for the same difficulty
  function handleBack() {
    if (level === "intermediate") navigate("/IntermediateLibrary");
    else if (level === "advanced") navigate("/AdvancedLibrary");
    else navigate("/BasicLibrary");
  }

  useEffect(() => {
    // If there's no valid mapping, skip fetching
    if (!level || !lessonNumber) {
      setTerms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Build the query string with level & lessonNumber
    fetch(
      `/api/videos?level=${level}&lessonNumber=${lessonNumber}`
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.map((video) => ({
          id: video._id,
          word: video.word,
          definition: video.description || "Definition not provided",
          video: video.videoUrl,
        }));
        setTerms(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, [level, lessonNumber]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="termspage-content">
      <Sidenav />
      <LibraryButtons forcedDifficulty={forcedDifficulty} />
      <div className="terms-section">
        {lesson ? (
          <Lessonlist Lessons={lesson} />
        ) : (
          <h1>No Lesson Data Found</h1>
        )}

        {terms.length > 0 ? (
          <Termslist LessonTerms={terms} lessonKey={termId} />
        ) : (
          <h2>No videos found for this lesson.</h2>
        )}
      </div>
    </div>
  );
}

export default Termspage;
