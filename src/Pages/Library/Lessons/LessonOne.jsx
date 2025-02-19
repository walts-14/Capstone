import React from 'react'
import Sidenav from '../../../Components/Sidenav'
import LibraryButtons from '../LibraryButtons'
import Lessonlist from '../../Library/Lessons/Lessonlist'
import OneTerms from './Lessonlist'
import "../../../css/LessonOne.css"

function LessonCard() {
  return (
    <>  
          <Sidenav />
          <LibraryButtons/>

        
          <Lessonlist items={OneTerms} />
      
         
    </>
  )
}

export default LessonCard