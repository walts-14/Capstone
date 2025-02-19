import React from 'react'
import "../../../css/LessonCard.css"

function LessonCard({item}) {
  return (
    <>
      
        <div className="terms-card">
          <h5 className="term-name">{item.terms}</h5>
        </div>
   
    </>
      
  )
}

export default LessonCard