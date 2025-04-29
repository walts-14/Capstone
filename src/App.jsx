import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ProgressProvider } from "./Pages/Dashboard/ProgressContext";

function App() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Initialize userId and userName from localStorage on app load
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    if (storedUserId) setUserId(storedUserId);
    if (storedUserName) setUserName(storedUserName);
  }, []);

  return (
    <ProgressProvider initialUserId={userId} initialUserName={userName}>
      <div className="App">
        <h1>Sign Language Learning System</h1>
        <Outlet context={{ setUserId, setUserName }} /> {/* Pass setters via context */}
      </div>
    </ProgressProvider>
  );
}

export default App;
