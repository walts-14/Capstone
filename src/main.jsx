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
import BasicLibrary from "./Pages/Library/BasicLibrary.jsx";
import IntermediateLibrary from "./Pages/Library/IntermediateLibrary.jsx";
import AdvancedLibrary from "./Pages/Library/AdvancedLibrary.jsx";
import Settings from "./Pages/Settings/Settings.jsx";
import Lesson from "./Pages/Dashboard/Lesson.jsx";
import LectureorQuiz from "./Pages/Dashboard/LessonorQuiz.jsx";
import Page from "./Pages/Dashboard/Page.jsx";
import Quiz from "./Pages/Quizzes/Quiz.jsx";
import Termspage from "./Pages/Library/Terms/Termspage.jsx";
import Correct from "./Components/correct.jsx";
import Wrong from "./Components/wrong.jsx";
import VideoLecture from "./Pages/Library/Lectures/LectureVids.jsx";
import LessonButtons from "./Pages/Dashboard/LessonButtons.jsx";


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
    path: "terms/:termId",
    element: <Termspage />,
  },
  {
    path: "page/:termId",
    element: <Page />,
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
  {
    path: "lesson",
    element: <Lesson />,
  },
  {
    path: "lectureorquiz",
    element: <LectureorQuiz />,
  },
  {
    path: "lessonbutton",
    element: <LessonButtons />,
  },
  {
    path: "quiz",
    element: <Quiz />,
  },
  {
    path: "page",
    element: <Page />,
  },
  {
    path: "correct",
    element: <Correct />,
  },
  {
    path: "wrong",
    element: <Wrong />,
  },
  {
    path: "VideoLecture/:title",
    element: <VideoLecture />,
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
          background: "#363636",
          color: "#fff",
        },
      }}
    />
    <RouterProvider router={router} />
  </StrictMode>
);
