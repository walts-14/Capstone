import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Library.css";
import Sidenav from "./Sidenav";
import Terms from "./Terms";
import IntermediateLibrary from "./IntermediateLibrary";
import AdvancedLibrary from "./AdvancedLibrary";
import { useNavigate } from "react-router-dom";

function Library() {
  const navigate = useNavigate();
  return (
    <>
      <Sidenav />
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
      <Terms />
    </>
  );
}

export default Library;
