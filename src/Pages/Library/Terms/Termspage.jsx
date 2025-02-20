import React from "react";
import { useParams } from "react-router-dom";

import Sidenav from "../../../Components/Sidenav";
import LibraryButtons from "../LibraryButtons";
import Termslist from "./Termslist";
import OneTerms from "./OneTerms";
import Lessonlist from "../../../Components/lessonList"; // Ensure consistent casing
import Lessons from "../../../Components/dataLessons";

function Termspage() {
  const { termId } = useParams(); // Get dynamic term ID from the URL
  
  const lesson = Lessons[termId]; // Fetch correct lesson data

  return (
    <div className="lesson-content">
      {lesson ? <Lessonlist Lessons={lesson} /> : <h1>No Data Found</h1>}
      <Sidenav />
      <LibraryButtons />
      <Termslist OneTerms={OneTerms} />
    </div>

    // <>

    // </>
  );
}

export default Termspage;
