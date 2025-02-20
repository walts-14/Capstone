import React from 'react'
import { useNavigate } from "react-router-dom";

const lessonRoutes = [
    { id: 1, termId: "termsone" },
    { id: 2, termId: "termstwo" },
    { id: 3, termId: "termsthree" },
    { id: 4, termId: "termsfour" },
    { id: 5, termId: "termsfour" },
  ];
  
  function LessonButtons() {
    const navigate = useNavigate();
  
    return (
      <div className="lessons-container">
        {lessonRoutes.map((lesson) => (
          <div
            key={lesson.id}
            className="lessons d-flex rounded-4"
            onClick={() => navigate(`/terms/${lesson.termId}`)}
          >
            {lesson.id}
          </div>
        ))}
      </div>
    );
  }

export default LessonButtons