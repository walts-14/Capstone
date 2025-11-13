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

        {/* Responsive styles for smooth transition */}
      <style>{`
        /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 768px) {
          .result-ans {
            height: 68px !important;
            width: 42vw !important;
            top: 15.2vh !important;
        
            text-align: center !important;
          }
          .result-ans span{
            font-size: 1.4rem !important;
            margin: 0rem !important;
            
          }
          .result-ans img{
            width: 30px !important;
            height: 30px !important;
            margin-left: 0.8rem !important;
          }
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
          .result-ans {
            height: 68px !important;
            width: 100vw !important;
            top: 30vh !important;
            border-radius: 0px 0px   !important;
            text-align: center !important;
          }
          .result-ans span{
            font-size: 1.2rem !important;
            margin: 0rem !important;
            
          }
          .result-ans img{
            width: 30px !important;
            height: 30px !important;
            margin-right: 1.2rem !important;
          }
        }
        
        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
             .result-ans {
            height: 68px !important;
            width: 34vw !important;
            top: 15.2vh !important;
        
            text-align: center !important;
          }
          .result-ans span{
            font-size: 1.4rem !important;
            margin: 0rem !important;
            
          }
          .result-ans img{
            width: 30px !important;
            height: 30px !important;
            margin-left: 0rem !important;
          }
        }

      `}</style>
    </div>
  );
}
