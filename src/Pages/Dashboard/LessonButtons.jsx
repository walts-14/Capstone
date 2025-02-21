import React from 'react'
import { useNavigate } from "react-router-dom";

const lessonRoutes = [
    { id: 1, termId: "termsone" },
    { id: 2, termId: "termstwo" },
    { id: 3, termId: "termsthree" },
    { id: 4, termId: "termsfour" },
    { id: 5, termId: "termsfour" },
    { id: 6, termId: "termsfive" },
    { id: 7, termId: "termssix" },
    { id: 8, termId: "termsseven" },
    { id: 9, termId: "termseight" },
    { id: 10, termId: "termseight" },
    { id: 11, termId: "termsnine" },
    { id: 12, termId: "termsten" },
    { id: 13, termId: "termseleven" },
    { id: 14, termId: "termstwelve" },
    { id: 15, termId: "termstwelve" },
  ];
  
  function LessonButtons() {
    const navigate = useNavigate();
  
    // Split lessons into groups of 5
    const chunkSize = 5;
    const lessonGroups = [];
    for (let i = 0; i < lessonRoutes.length; i += chunkSize) {
      lessonGroups.push(lessonRoutes.slice(i, i + chunkSize));
    }
  
    return (
      <div>
        {lessonGroups.map((group, index) => (
          <div key={index} className="lessons-container">
            {group.map((lesson) => (
              <div
                key={lesson.id}
                className="lessons d-flex rounded-4"
                onClick={() => navigate(`/page/${lesson.termId}`)}
              >
                {lesson.id}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

export default LessonButtons