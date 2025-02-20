import React from 'react'
import Sidenav from '../../../Components/Sidenav'
import LibraryButtons from '../LibraryButtons'
import Termslist from './Termslist'
import OneTerms from './Termslist'


function TermsOne() {
  return (
    <>  
          <Sidenav />
          <LibraryButtons/>

          <div className="lessonTitle">
            <h1 className='m-0'>Lesson 1</h1>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <h2 className='m-0' >Introduction to Sign Language</h2>
          </div>

          <Termslist items={OneTerms} />
      
         
    </>
  )
}

export default TermsOne