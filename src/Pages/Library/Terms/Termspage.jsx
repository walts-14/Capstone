import React from "react";

import { useParams } from "react-router-dom";
import Lessons from "../../../Components/dataLessons";
import Lessonlist from "../../../Components/Lessonlist";
import LessonTerms from "../../../../src/Pages/Library/Terms/LessonTerms";
import Sidenav from "../../../Components/Sidenav";
import LibraryButtons from "../LibraryButtons";
import Termslist from "./Termslist";

function Termspage() {
  const { termId } = useParams(); // e.g., "termsone", "termstwo", etc.
  const lesson = Lessons[termId]; // Get lesson details (dataLessons)
  const terms = LessonTerms[termId] || []; // Get correct terms for this lesson

  return (
    <div className="termspage-content">
      {lesson ? <Lessonlist Lessons={lesson} /> : <h1>No Data Found</h1>}
      <Sidenav />
      <LibraryButtons />
      <Termslist LessonTerms={terms} lessonKey={termId} />
    </div>
  );
}

export default Termspage;
