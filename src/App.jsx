import React from "react";
import { Outlet } from "react-router-dom";
import VideoUpload from "./Pages/VideoUpload";
import VideoList from "./Components/VideoList";

function App() {
  return (
    <div className="App">
      <Outlet />
      <VideoUpload />
      <VideoList />
    </div>
  );
}

export default App;
