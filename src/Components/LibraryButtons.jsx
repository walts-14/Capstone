import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/LibraryButtons.css";
import { useNavigate } from "react-router-dom";

function LibraryButtons() {
  const navigate = useNavigate();
  return (
    <>
      <div className="library-contents d-flex fs-3 fw-bold">
        <button
          className="btns-content rounded-4"
          onClick={() => navigate("/library")}
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
