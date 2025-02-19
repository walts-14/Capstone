import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster from react-hot-toast
import LoginForm from "./Pages/Login/LoginForm.jsx";
import SignupForm from "./Pages/Signup/SignupForm.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.jsx";
import Library from "./Pages/Library/Library.jsx";
import LessonOne from "./Pages/Library/Lessons/LessonOne.jsx";
import BasicLibrary from "./Pages/Library/BasicLibrary.jsx";
import IntermediateLibrary from "./Pages/Library/IntermediateLibrary.jsx";
import AdvancedLibrary from "./Pages/Library/AdvancedLibrary.jsx";
import Settings from "./Pages/Settings/Settings.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "signup",
    element: <SignupForm />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "library",
    element: <Library />,
  },  
  {
    path: "lessonOne",
    element: <LessonOne />,
  },  
  {
    path: "intermediatelibrary",
    element: <IntermediateLibrary />,
  },
  {
    path: "advancedlibrary",
    element: <AdvancedLibrary />,
  },
  {
    path: "leaderboard",
    element: <Leaderboard />,
  }, 
  {
    path: "basiclibrary",
    element: <BasicLibrary />,
  }, 
  {
    path: "settings",
    element: <Settings />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap RouterProvider with Toaster component */}
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
    <RouterProvider router={router} />
  </StrictMode>
);
