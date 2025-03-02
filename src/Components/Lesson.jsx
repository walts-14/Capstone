import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Lesson.css";

const Lesson = ({ buttonColors = [], shadowStyle = "none" }) => {
  return (
    <div className="lessons-container text-white fs-1 fw-bold gap-4 p-2">
      {[1, 2, 3, 4, 5].map((num, index) => (
        <button
          key={num}
          className="lessons p-1 rounded-4 text-white"
          type="button"
          style={{
            backgroundColor: buttonColors[index] || "transparent",
            boxShadow: shadowStyle,
          }}
          onClick={() => alert(`Button ${num} Clicked!`)}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default Lesson;
