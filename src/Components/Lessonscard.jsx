import React from "react";

function LessonsCard({ item }) {
  // Define a helper function to choose the background color based on difficulty
  const getColor = (difficulty) => {
    switch(difficulty) {
      case "Basic":
        return "#174360";      // Color for basic
      case "Intermediate":
        return "#6A5606";      // Color for intermediate
      case "Advanced":
        return "#601C15";      // Color for advanced
      default:
        return "#ffffff";      // Fallback background color
    }
  };

  // Get the appropriate color for the current lesson item
  const bgColor = getColor(item.difficulty);

  return (
    <div className="lessonTitle" style={{ backgroundColor: bgColor }}>
      <h1 className="m-0">{item.num}</h1>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <h2 className="m-0">{item.title}</h2>
    </div>
  );
}

export default LessonsCard;
