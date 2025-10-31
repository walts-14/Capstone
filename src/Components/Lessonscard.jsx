import React from "react";

function LessonsCard({ item }) {
  // Define a helper function to choose the background color based on difficulty
  const getColor = (difficulty) => {
    switch(difficulty) {
      case "Basic":
        return "#174360";      // Color for basic
      case "Intermediate":
        return "#6A5606";      // Color for intermediate
      case "Advance":
        return "#601C15";      // Color for advance
      default:
        return "#ffffff";      // Fallback background color
    }
  };

  // Get the appropriate color for the current lesson item
  const bgColor = getColor(item.difficulty);

  return (
   <>
      <div className="lessonTitle" style={{ backgroundColor: bgColor }}>
        <h1 className="m-0">{item.num}</h1>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <h2 className="m-0">{item.title}</h2>
      </div>

      <div className="lessonTitle MobilelessonTitle" style={{ backgroundColor: bgColor }}>
        <h1 className="m-0">{item.num}</h1>
        <h2 className="m-0">{item.title}</h2>
      </div>

       <style>{`
         /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 1023px) {

         .lessonTitle {
            display: flex !important;
          
          }
        
           .MobilelessonTitle {
            display: none !important;
          }
          
        }

         /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {


            .MobilelessonTitle {
            display: none !important;
          }
          
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
           .lessonTitle {
            display: none !important;
          }
          
          .MobilelessonTitle {
            display: flex !important;
        
          }
        
       
          
       

      `}</style>
   </>
    
  );
}

export default LessonsCard;
