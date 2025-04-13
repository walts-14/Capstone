import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Dashboard.css";
import Sidenav from "../../Components/Sidenav";
import LessonButtons from "./LessonButtons.jsx";
import ProgressTracker from "./ProgressTracker.jsx"; // Import ProgressTracker component

function Dashboard() {
  return (
    <>
      <Sidenav />

      <ProgressTracker />

      <LessonButtons />
    </>
  );
}

export default Dashboard;
