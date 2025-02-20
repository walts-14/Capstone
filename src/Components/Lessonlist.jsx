import React from 'react'

const Lessons = [
    
];

function lessonList() {
  return (
    <div className="lesson-list grid-container">
        {Lessons.map((item) => (
        <TermsCard key={item.id} item={item} />
        ))}
  </div>   
  )
}

export default lessonList