import React from "react";
import check from "../../assets/check.png";
import ekis from "../../assets/ekis.png";
import "../../css/resultbanner.css";

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
  const phraseColor = isCorrect ? "#ECFFF2" : "#FFE9E9";

  return (
    <div
      className={`result-ans flex flex-col items-center justify-center absolute top-35.5   ${isCorrect ? "correct-ans" : "wrong-ans"
        }`}
    >
      <div className="flex justify-between w-full">
        <span
          className="banner-label mr-auto mb-0 whitespace-nowrap"
          style={{ color: isCorrect ? "#0F311A" : "#300D0D" }}
        >
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
          fontSize: "2.2rem",
        }}
      >
        {phrase}
      </span>
    </div>
  );
}
