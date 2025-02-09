import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Library.css";
import Sidenav from "./Sidenav";

function Library() {
  return (
    <>
      <Sidenav />
      <div className="library-contents d-flex fs-3 fw-bold">
        <div className="basic-library d-flex p-2 rounded-4"> BASIC</div>
        <div className="intermediate-library d-flex p-2 rounded-4">
          INTERMEDIATE
        </div>
        <div className="advanced-library d-flex p-2 rounded-4">ADVANCED</div>
      </div>
    </>
  );
}

export default Library;
