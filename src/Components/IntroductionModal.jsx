import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import question from "../assets/question.png";
import Hand from "../assets/introhand.png";
import Interpreter from "../Pages/Introduction/Interpreter";
import how1 from "../assets/how1.png";
import how2 from "../assets/how2.png";
import how3 from "../assets/how3.png";
import how4 from "../assets/how4.png";
import how5 from "../assets/how5.png";
import how6 from "../assets/how6.png";
import "../css/IntroductionModal.css";

export default function IntroductionModal() {
  const [showModal, setShowModal] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const location = useLocation();

  // Determine which component to show based on path
  const libPaths = [
    "/library",
    "/BasicLibrary",
    "/IntermediateLibrary",
    "/AdvancedLibrary",
    "/terms/termsone",
    "/terms/termstwo",
    "/terms/termsthree",
    "/terms/termsfour",
    "/terms/termsfive",
    "/terms/termssix",
    "/terms/termsseven",
    "/terms/termseight",
    "/terms/termsnine",
    "/terms/termsten",
    "/terms/termseleven",
    "/terms/termstwelve",
  ];
  const showInterpreter = libPaths.includes(location.pathname);
  const howImages = [how1, how5, how2, how3, how4, how6];
  const totalSlides = howImages.length;

  const nextSlide = () => {
    if (slideIndex === totalSlides - 1) {
      setShowModal(false);
    } else {
      setSlideIndex((prev) => prev + 1);
    }
  };

  // Previous slide (wraps around)
  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const openModal = () => {
    setSlideIndex(0);
    setShowModal(true);
  };
  return (
    <>
      {/* Trigger Button */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openModal();
        }}
        className="question-button flex justify-center items-center rounded-5 z-10 bg-transparent "
      >
        <img
          src={showInterpreter ? Hand : question}
          alt={showInterpreter ? "Hand" : "Help"}
        />
      </a>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          {/* <button
            onClick={() => setShowModal(false)}
            className="modal-close-btn"
          >
            ✕
          </button> */}
          <div
            className="modal-content rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {showInterpreter ? (
              <Interpreter />
            ) : (
              <>
                <div className="slideshow-container">
                  <img
                    src={howImages[slideIndex]}
                    alt={`Slide ${slideIndex + 1}`}
                    className="max-w-full h-auto"
                  />
                  <div className="slideshow-controls flex justify-between mt-3">
                    <button
                      onClick={prevSlide}
                      disabled={totalSlides <= 1}
                      className="btn rounded-xl text-white"
                    >
                      PREVIOUS
                    </button>

                    <button
                      onClick={nextSlide}
                      disabled={totalSlides <= 1}
                      className="btn rounded-xl text-white"
                    >
                      {slideIndex === totalSlides - 1 ? "CLOSE" : "KEEP GOING"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
