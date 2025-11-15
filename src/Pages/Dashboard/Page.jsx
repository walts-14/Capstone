import React from "react";
import LectureorQuiz from "./LessonorQuiz";
import { useParams } from "react-router-dom";
import Lessons from "../../Components/dataLessons";
import Lessonlist from "../../Components/Lessonlist";
import LessonTerms from "../../../src/Pages/Library/Terms/LessonTerms";

function Page() {
  const { termId } = useParams(); // For example, termId = "termsthree"
  const lesson = Lessons[termId]; // Fetch the corresponding lesson data
  const terms = LessonTerms[termId] || [];
  console.log("Terms in Page:", terms);
  return (
    <div className="page-content">
        <div className="lecture-lessonlist-container">
        {lesson ? <Lessonlist Lessons={lesson} /> : <h1>No Data Found</h1>}
      </div>

      <LectureorQuiz termId={termId} LessonTerms={terms} />

      {/* Scoped responsive styles for this page's Lessonlist only */}
      <style>{`
        /* default (mobile-first): full width in the flow */
        @media (max-width: 639px) {
            .lecture-lessonlist-container {
            position: absolute;
            right: 4vw;
            top: 120px;
            width: 90vw;
      
          }
        }
        

        /* tablet */
        @media (min-width: 640px) and (max-width: 768px) {
          .lecture-lessonlist-container {
            position: absolute;
            right: 44vw;
            top: -12px;
            width: 60vw;
            height: 260vh;
          }
        }

        /* desktop */
        @media (min-width: 1024px) {
          .lecture-lessonlist-container {
            position: absolute;
            right: 4vw;
            top: 56px;
            width: 110vw;
          }
        }
      `}</style>
    </div>
  );
}

export default Page;
