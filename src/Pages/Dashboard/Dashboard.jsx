import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Dashboard.css";
import Sidenav from "../../Components/Sidenav";
import LessonButtons from "./LessonButtons.jsx";
import ProgressTracker from "./ProgressTracker.jsx";
import backgroundImage from "../../../src/assets/background display.png";
function Dashboard() {
  return (
    <>
      <Sidenav />
      <ProgressTracker />
      <LessonButtons />
      <div className="container"></div>
      <img src={backgroundImage} 
      style={
        {
          position: "fixed",
          top: "0%",
          
          left: "0%",
          width: "100%",
          height: "100%",
          
          zIndex: "-1",
        }
      } />
    </>
  );
}

export default Dashboard;
