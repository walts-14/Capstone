import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./Components/LoginForm.jsx";
import SignupForm from "./Components/SignupForm.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Library from "./Components/Library.jsx";
import Leaderboard from "./Components/Leaderboard.jsx";
import IntermediateLibrary from "./Components/IntermediateLibrary.jsx";
import AdvancedLibrary from "./Components/AdvancedLibrary.jsx";
import Settings from "./Components/Settings.jsx";

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
    path: "leaderboard",
    element: <Leaderboard />,
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
    path: "settings",
    element: <Settings />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
