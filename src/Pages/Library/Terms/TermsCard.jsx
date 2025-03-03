
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../css/LessonCard.css";

function TermsCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lesonecontent/${item.id}`); // Navigate dynamically
  };

  return (
    <button className="terms-card" onClick={handleClick}>
      <h5 className="term-name">{item.terms}</h5>
    </button>
  );
}

export default TermsCard;
