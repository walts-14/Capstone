import React from 'react'

function Lessonscard({item}) {
  return (
    <div className="lessonTitle">
        <h1 className='m-0'>{item.num}</h1>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <h2 className='m-0' >{item.title}</h2>
    </div>
  )
}

export default Lessonscard