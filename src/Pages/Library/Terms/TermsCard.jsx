
import React from 'react'
import "../../../css/LessonCard.css"

function TermsCard({item}) {
  return (
    <>
      <a className="terms-card" href="">
          <h5 className="term-name">{item.terms}</h5>
      </a>
      
    </>
      
  )
}
export default TermsCard