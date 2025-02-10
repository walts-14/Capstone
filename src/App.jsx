import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import SignupForm from "./Components/SignupForm";
import Dashboard from "./Components/Dashboard";
import Library from "./Components/Library";
import Leaderboard from "./Components/Leaderboard";
import IntermediateLibrary from "./Components/IntermediateLibrary";
import AdvancedLibrary from "./Components/AdvancedLibrary";
import axios from "axios";
import { Toaster } from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="/intermediatelibrary" element={<IntermediateLibrary />} />
        <Route path="/advancedlibrary" element={<AdvancedLibrary />} />
      </Routes>
    </>
  );
}
export default App;
