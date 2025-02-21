import React from "react";
import LectureorQuiz from "./LessonorQuiz";
import { useParams } from "react-router-dom";
import Lessons from "../../Components/dataLessons";
import Lessonlist from "../../Components/lessonList";

function Page() {
  const {termId} = useParams();// Get dynamic term ID from the URL
  const lesson = Lessons[termId];// Fetch correct lesson data
  return (
   
    <div className="page-content"> 
      {lesson ? <Lessonlist Lessons={lesson} /> : <h1>No Data Found</h1>}
      <LectureorQuiz />
    </div>
  );
}

export default Page;
