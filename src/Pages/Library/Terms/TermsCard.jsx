// TermsCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/LessonCard.css";

function TermsCard({ item, lessonKey }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // item.id is assumed to be a string
    navigate(`/lesonecontent/${lessonKey}/${item.id}`);
  };

  return (
    <button className="terms-card" onClick={handleClick}>
      <h5 className="term-name">{item.word}</h5>
    </button>
  );
}

export default TermsCard;
