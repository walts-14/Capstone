import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import SignupForm from "./Pages/Signup/SignupForm.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Library from "./Pages/Library/Library.jsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.jsx";
import IntermediateLibrary from "./Pages/Library/IntermediateLibrary.jsx";
import AdvancedLibrary from "./Pages/Library/AdvancedLibrary.jsx";
import BasicLibrary from "./Pages/Library/BasicLibrary.jsx";
import Settings from "./Pages/Settings/Settings.jsx";
import Lesson from "./Pages/Dashboard/Lesson.jsx";
import LectureorQuiz from "./Pages/Dashboard/LessonorQuiz.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="intermediatelibrary" element={<IntermediateLibrary />} />
        <Route path="advancedlibrary" element={<AdvancedLibrary />} />
        <Route path="basiclibrary" element={<BasicLibrary />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/lectureorquiz" element={<LectureorQuiz />} />
      </Routes>
    </>
  );
}

export default App;
