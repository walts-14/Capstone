import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/LibraryButtons.css";
import { Outlet, useNavigate } from "react-router-dom";
import IntroductionModal from "../../Components/IntroductionModal";
function LibraryButtons() {
  const navigate = useNavigate();
  return (
    <>
      <div className="library-contents flex text-2xl font-bold text-center">
        <IntroductionModal />
        <button
          className="btns-content rounded-4"
          onClick={() => navigate("/BasicLibrary")}
        >
          BASIC
        </button>
        <button
          className="btns-content rounded-4"
          onClick={() => navigate("/IntermediateLibrary")}
        >
          INTERMEDIATE
        </button>
        <button
          className="btns-content rounded-4"
          onClick={() => navigate("/AdvancedLibrary")}
        >
          ADVANCED
        </button>
      </div>
    </>
  );
}
export default LibraryButtons;
