import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import SignupForm from "./Components/SignupForm";
import Dashboard from "./Components/Dashboard";
import Library from "./Components/Library";
import Leaderboard from "./Components/Leaderboard";
import IntermediateLibrary from "./Components/IntermediateLibrary";
import AdvancedLibrary from "./Components/AdvancedLibrary";
import Settings from "./Components/Settings";
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
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="/intermediatelibrary" element={<IntermediateLibrary />} />
        <Route path="/advancedlibrary" element={<AdvancedLibrary />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
