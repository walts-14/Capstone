import React from "react";
import { Outlet } from "react-router-dom";
import { ProgressProvider } from "./Pages/Dashboard/ProgressContext";

function App({ userId }) {
  return (
    <ProgressProvider userId={userId}>
      <div className="App">
        <h1>Sign Language Learning System</h1>
        <Outlet /> {/* This renders the child route components */}
      </div>
    </ProgressProvider>
  );
}

export default App;
