import "../../css/Introductions.css";
import Sidenav from "../../Components/Sidenav";
export default function Interpreter() {
  return (
    <>
      <Sidenav />
      <div className="interpreter-intro d-flex text-white rounded-4 p-5 position-static">
        <div className="interpreter-details d-flex flex-column ms-auto">
          <p>Interpreter#1</p>
          <p>Name: </p>
          <p>Credentials and Certifications:</p>
          <p>Education / Trainings:</p>
          <p>Years of Experience:</p>
          <p>Specialty Areas:</p>
          <p>Why I teach:</p>
          <p>Fun Fact:</p>
        </div>
      </div>
      <div className="interpreter-introo d-flex text-white rounded-4 p-5 position-static">
        <div className="interpreter-detailss d-flex flex-column ms-auto">
          <p>Interpreter#2</p>
          <p>Name: </p>
          <p>Credentials and Certifications:</p>
          <p>Education / Trainings:</p>
          <p>Years of Experience:</p>
          <p>Specialty Areas:</p>
          <p>Why I teach:</p>
          <p>Fun Fact:</p>
        </div>
      </div>
    </>
  );
}
