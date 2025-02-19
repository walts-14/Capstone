import React from 'react'


function LessonCard({item}) {
  return (
    <div>
      <div className="item">
        <div className="card-body">
          <h5 className="card-term">{item.terms}</h5>
        </div>
      </div>
    </div>
  )
}

export default LessonCard