import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import question from "../assets/question.png";
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
    "/Library",
    "/BasicLibrary",
    "/IntermediateLibrary",
    "/AdvancedLibrary",
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
      <button
        onClick={openModal}
        className="question-button w-20 h-17 flex justify-center items-center absolute -top-1  -left-25 rounded-5 z-10"
      >
        <img src={question} alt="Help" className="w-19" />
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <button
            onClick={() => setShowModal(false)}
            className="modal-close-btn"
          >
            ✕
          </button>
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
                      className="btn rounded-xl"
                    >
                      PREVIOUS
                    </button>

                    <button
                      onClick={nextSlide}
                      disabled={totalSlides <= 1}
                      className="btn rounded-xl"
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
