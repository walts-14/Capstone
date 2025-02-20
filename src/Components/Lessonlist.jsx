import React from 'react';
import Lessonscard from './Lessonscard';
import "../css/Lessonlist.css";

function Lessonlist({ Lessons }) {
  return (
    <div className="lesson-list">
      
        <Lessonscard key={Lessons[6].id} item={Lessons[6]} />
      
    </div>
  );
}

export default Lessonlist;