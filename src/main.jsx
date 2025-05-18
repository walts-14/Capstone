import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster from react-hot-toast
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import SignupForm from "./Pages/Signup/SignupForm.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.jsx";
import Introduction from "./Pages/Introduction/Introduction.jsx";
import Library from "./Pages/Library/Library.jsx";
import BasicLibrary from "./Pages/Library/BasicLibrary.jsx";
import IntermediateLibrary from "./Pages/Library/IntermediateLibrary.jsx";
import AdvancedLibrary from "./Pages/Library/AdvancedLibrary.jsx";
import Settings from "./Pages/Settings/Settings.jsx";
import LectureorQuiz from "./Pages/Dashboard/LessonorQuiz.jsx";
import Page from "./Pages/Dashboard/Page.jsx";
import Quiz from "./Pages/Quizzes/Quiz.jsx";
import Termspage from "./Pages/Library/Terms/Termspage.jsx";

import Finish from "./Pages/Quizzes/Finish.jsx";
import FinishLecture from "./Pages/Library/Terms/FinishLecture.jsx";
import VideoLecture from "./Pages/Library/Lectures/LectureVids.jsx";
import LessonButtons from "./Pages/Dashboard/LessonButtons.jsx";
import LesoneContent from "./Pages/Library/VideoLesson/LesoneContent.jsx";
import VideoUpload from "./Pages/VideoUpload.jsx";
import SuperAdmin from "./Pages/Login/Admin/SuperAdmin.jsx";
import Admin from "./Pages/Login/Admin/AdminDashboard.jsx";
import ProgressTracker from "./Pages/Dashboard/ProgressTracker.jsx";
import { ProgressProvider } from "../src/Pages/Dashboard/ProgressContext.jsx"; // adjust the path accordingly
import VideoList from "./Components/VideoList.jsx"; // adjust the path accordingly
import QuizUpload from "./Pages/QuizUpload.jsx"; // adjust the path accordingly
import IntroductionModal from "./Components/IntroductionModal.jsx"; // adjust the path accordingly
import Maintenance from "./Components/Maintenance/MaintenanceModal.jsx"; // adjust the path accordingly
import LivesRunOut from "./Pages/Quizzes/Livesrunout.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> }, // Redirect "/" to "/login"
  { path: "/login", element: <LoginForm /> },
  { path: "/signup", element: <SignupForm /> },

  // ✅ Wrap Protected Routes Properly
  {
    path: "/",
    element: <ProtectedRoutes />, // ✅ Only logged-in users can access
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "library", element: <Library /> },
      { path: "basiclibrary", element: <BasicLibrary /> },
      { path: "intermediatelibrary", element: <IntermediateLibrary /> },
      { path: "advancedlibrary", element: <AdvancedLibrary /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "introduction", element: <Introduction /> },
      { path: "settings", element: <Settings /> },
      { path: "lectureorquiz/:termId", element: <LectureorQuiz /> },
      { path: "lessonbutton", element: <LessonButtons /> },
      { path: "quiz/:lessonKey", element: <Quiz /> },
      { path: "page/:termId", element: <Page /> },
      { path: "terms/:termId", element: <Termspage /> },
      { path: "finish", element: <Finish /> },
      { path: "VideoLecture/:title", element: <VideoLecture /> },
      { path: "lesonecontent/:lessonKey/:termId", element: <LesoneContent /> },
      { path: "videoupload", element: <VideoUpload /> },
      { path: "admin", element: <Admin /> },
      { path: "superadmin", element: <SuperAdmin /> },
      { path: "progresstracker", element: <ProgressTracker student={{ username: localStorage.getItem("userUsername"), email: localStorage.getItem("userEmail") }} /> },
      { path: "VideoList", element: <VideoList /> },
      { path: "QuizUpload", element: <QuizUpload /> },
      { path: "finishLecture", element: <FinishLecture /> },
      { path: "introductionmodal", element: <IntroductionModal /> },
      { path: "maintenance", element: <Maintenance /> },
      { path: "livesrunout", element: <LivesRunOut /> },
    ],
  },

  // ✅ Catch-all redirect to prevent broken links
  { path: "*", element: <Navigate to="/login" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap RouterProvider with Toaster component */}
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: { background: "#363636", color: "#fff" },
      }}
    />
    <ProgressProvider
      initialUserEmail={localStorage.getItem("userEmail")}
      initialUserName={localStorage.getItem("userName")}
      initialUserUsername={localStorage.getItem("userUsername")}
    >
      <RouterProvider router={router} />
    </ProgressProvider>
  </StrictMode>
);

export default router;
