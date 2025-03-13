import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../css/LessonCard.css";

function TermsCard({ item, lessonKey }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to a URL that contains both the lesson key and the item's id
    navigate(`/lesonecontent/${lessonKey}/${item.id}`);
  };

  return (
    <button className="terms-card" onClick={handleClick}>
      <h5 className="term-name">{item.terms}</h5>
    </button>
  );
}

export default TermsCard;
