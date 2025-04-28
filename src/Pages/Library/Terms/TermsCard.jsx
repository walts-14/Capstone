
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../css/LessonCard.css";

function TermsCard({ item, lessonKey }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lesonecontent/${lessonKey}/${item.id}`);
  };

  // only override for the two other ranges:
  const getOverrideStyle = () => {
    // intermediate: termsfive through termseight
    if ([
      "termsfive", "termssix", "termsseven", "termseight"
    ].includes(lessonKey)) {
      return {
        backgroundColor: "var(--intermediate-yellow)",
        boxShadow:     "0 5px 1px 8px var(--intermediate-shadow)",
      };
    }

    // advance: termsnine through termstwelve
    if ([
      "termsnine", "termsten", "termseleven", "termstwelve"
    ].includes(lessonKey)) {
      return {
        backgroundColor: "var(--advance-red)",
        boxShadow:       "0 5px 1px 8px var(--advance-shadow)",
      };
    }

    // default (termsone–termsfour): just use the CSS file
    return {};
  };

  return (
    <button
      className="terms-card"
      style={getOverrideStyle()}
      onClick={handleClick}
    >
      <h5 className="term-name">{item.word}</h5>
    </button>
  );
}

export default TermsCard;

