import React from "react";
import Lessonscard from "./Lessonscard";
import "../css/LessonList.css";

function Lessonlist({ Lessons }) {
  return (
    <div className="lesson-list">
      {Lessons.map((lesson) => (
        <Lessonscard key={lesson.id} item={lesson} />
      ))}
    </div>
  );
}

export default Lessonlist;
