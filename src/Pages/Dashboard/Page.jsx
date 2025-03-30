import React from "react";
import LectureorQuiz from "./LessonorQuiz";
import { useParams } from "react-router-dom";
import Lessons from "../../Components/dataLessons";
import Lessonlist from "../../Components/lessonlist";
import LessonTerms from "../../../src/Pages/Library/Terms/LessonTerms";

function Page() {
  const { termId } = useParams(); // For example, termId = "termsthree"
  const lesson = Lessons[termId]; // Fetch the corresponding lesson data
  const terms = LessonTerms[termId] || [];
  console.log("Terms in Page:", terms);
  return (
    <div className="page-content">
      {lesson ? <Lessonlist Lessons={lesson} /> : <h1>No Data Found</h1>}
      
      <LectureorQuiz termId={termId} LessonTerms={terms} />
    </div>
  );
}

export default Page;
