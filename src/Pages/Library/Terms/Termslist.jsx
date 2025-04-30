// Termslist.jsx
import React from "react";
import TermsCard from "./TermsCard";
import "../../../css/Lessonlist.css";

function Termslist({ LessonTerms, lessonKey }) {
  return (
    <div className="terms-list grid-container gap-5">
      {LessonTerms.map((item) => (
        <TermsCard key={item.id} item={item} lessonKey={lessonKey} />
      ))}
    </div>
  );
}

export default Termslist;
