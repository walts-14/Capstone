import React from "react";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/ResultBanner.css";

const correctPhrases = [
  "Great job!",
  "You nailed it!",
  "Perfect!",
  "Awesome work!",
  "Bravo!",
  "Right on!",
  "Exactly!",
];

const wrongPhrases = [
  "Oops—try again!",
  "Almost there!",
  "Keep going!",
  "You’ve got this!",
  "Don’t give up!",
  "One more time!",
  "Practice makes perfect!",
  "Practice makes perfect!",
];

export default function ResultBanner({ isCorrect }) {
  // pick a random phrase
  const phrases = isCorrect ? correctPhrases : wrongPhrases;
  const rawPhrase =
    phrases[Math.floor(Math.random() * phrases.length)];

  // uppercase + dynamic color
  const phrase = rawPhrase.toUpperCase();
  const phraseColor = isCorrect ? "#ACFFC7" : "#FFACAC";

  return (
    <div
      className={`result-ans d-flex flex-column align-items-center justify-content-center  ${
        isCorrect ? "correct-ans" : "wrong-ans"
      }`}
    >
      <div className="d-flex justify-content-between w-100">
        <span className="banner-label me-auto mb-0 text-nowrap ">
          {isCorrect ? "Correct answer!" : "Wrong answer"}
        </span>

        {isCorrect ? (
          <img
            src={check}
            className="check-icon"
            alt="Correct"
          />
        ) : (
          <img
            src={ekis}
            className="ekis-icon"
            alt="Wrong"
          />
        )}
      </div>

      {/* the random encouragement line, upper-cased + colored */}
      <span
        
        style={{ 
          color: phraseColor,
          fontSize: "2.2rem",}}
      >
        {phrase}
      </span>
    </div>
  );
}
