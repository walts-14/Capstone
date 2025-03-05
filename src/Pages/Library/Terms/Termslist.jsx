import React from 'react'
import TermsCard from './TermsCard'
import "../../../css/Lessonlist.css"




function Termslist({ LessonTerms }) {

  return (
    <>
      <div className="terms-list grid-container">
        {LessonTerms.map((item) => (
          <TermsCard key={item.id} item={item} />
        ))}
      </div>
     
    </>

  )
}

export default Termslist