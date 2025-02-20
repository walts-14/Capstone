import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidenav from "../../Components/Sidenav";
import LibraryButtons from "./LibraryButtons";
import IntermediateLibrary from "./IntermediateLibrary";
import AdvancedLibrary from "./AdvancedLibrary";
import BasicLibrary from "../Library/BasicLibrary";

function Library() {
  return (
    <>
      <BasicLibrary />
    </>
  );
}

export default Library;
