import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import question from "../assets/question.png";
import Interpreter from "../Pages/Introduction/Interpreter";
import how1 from "../assets/how1.png";
import how2 from "../assets/how2.png";
import how3 from "../assets/how3.png";
import how4 from "../assets/how4.png";
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
  const howImages = [how1, how2, how3, how4];
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
        className="question-button"
        style={{
          width: "75px",
          height: "75px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "-3px",
          left: "-100px",
          borderRadius: "50%",
          zIndex: 10,
        }}
      >
        <img src={question} alt="Help" style={{ width: "75px" }} />
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
            className="modal-content rounded-4"
            onClick={(e) => e.stopPropagation()}
          >
           

            {showInterpreter ? (
              <Interpreter />
            ) : (
              <>
                <div className="slideshow-container ">
                  <img
                    src={howImages[slideIndex]}
                    alt={`Slide ${slideIndex + 1}`}
                    className="img-fluid"
                  />
                   <div className="slideshow-controls d-flex justify-content-between mt-3">
                      <button
                        onClick={prevSlide}
                        disabled={totalSlides <= 1}
                        className="btn rounded-4"
                      >
                        PREVIOUS
                      </button>

                      <button
                        onClick={nextSlide}
                        disabled={totalSlides <= 1}
                        className="btn rounded-4"
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
