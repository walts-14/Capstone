import React from 'react'
import TermsCard from './TermsCard'
import "../../../css/Lessonlist.css"




function Termslist({ OneTerms }) {

  return (
    <>
      <div className="terms-list grid-container">
        {OneTerms.map((item) => (
          <TermsCard key={item.id} item={item} />
        ))}
      </div>
     
    </>

  )
}

export default Termslist