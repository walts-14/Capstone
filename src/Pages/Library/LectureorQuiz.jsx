import React from "react";
import { useLocation } from "react-router-dom";

const LectureorQuiz = () => {
  const location = useLocation();
  const lessonKey = location.state?.lessonKey;
  const termId = location.state?.termId;

  console.log("Received LessonTerms in LectureorQuiz:", lessonKey);
  console.log("Received termId in LectureorQuiz:", termId);

  // ...rest of your component code...
};

export default LectureorQuiz;