import React from 'react';
import Sidenav from '../../../Components/Sidenav';
import LibraryButtons from '../LibraryButtons';
import Termslist from './Termslist';
import OneTerms from './OneTerms';
import Lessonlist from '../../../Components/Lessonlist'; // Ensure consistent casing
import Lessons from '../../../Components/dataLessons';

function TermsOne() {
  return (
    <>
      <Sidenav />
      <LibraryButtons />
      <Lessonlist Lessons={Lessons} />
      <Termslist OneTerms={OneTerms} />
    </>
  );
}

export default TermsOne;