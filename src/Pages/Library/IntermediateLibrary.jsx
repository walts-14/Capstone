import React from "react";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "./LibraryButtons";
import "../../css/IntermediateLibrary.css"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

function IntermediateLibrary() {
  return (
    <>
      <Sidenav />
      <LibraryButtons />
      <div className="inter-container fw-bold mb-1">
        <a href="#">
          <div className="inter-content rounded-3">
            <span className="fs-3"> Lesson 1 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1">Basic Greetings & Introductions</p>
          </div>
        </a>
        <a href="#">
          <div className="inter-content rounded-3">
            <span className="fs-3"> Lesson 2 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1">Casual Conversations</p>
          </div>
        </a>
        <a href="#">
          <div className="inter-content rounded-3">
            <span className="fs-3"> Lesson 3 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1"> Expressing Emotions & Feelings</p>
          </div>
        </a>
        <a href="#">
          <div className="inter-content rounded-3">
            <span className="fs-3"> Lesson 4 </span>
            <span className="fs-4"> 30 items</span>
            <p className="fs-1"> Making Requests & Offers</p>
          </div>
        </a>
      </div>
    </>
  );
}
export default IntermediateLibrary;
