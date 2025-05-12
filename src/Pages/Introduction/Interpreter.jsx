import "../../css/Introductions.css";
import Sidenav from "../../Components/Sidenav";
import vid1 from "../../assets/acknowledge.mp4";
import vid2 from "../../assets/Where are you frtom.mp4";

const interpreters = [
  {
    id: 1,
    video: vid1,
    name: "Loremloremlorem",
    credentials: "Loremloremlorem",
    education: "Loremloremlorem",
    years: "Loremloremlorem",
    specialty: "Loremloremlorem",
    whyTeach: "Loremloremlorem",
    funFact: "Loremloremlorem",
  },
  {
    id: 2,
    video: vid2,
    name: "Loremloremlorem",
    credentials: "Loremloremlorem",
    education: "Loremloremlorem",
    years: "Loremloremlorem",
    specialty: "Loremloremlorem",
    whyTeach: "Loremloremlorem",
    funFact: "Loremloremlorem",
  },
];

export default function Interpreter() {
  return (
    <>
      
      {interpreters.map((intp) => (
        <div
          key={intp.id}
          className="interpreter-intro text-white rounded-4 p-5 position-static"
        >
          <video
            src={intp.video}
            controls
            className="interpreter-video "
          />
          <div className="interpreter-details d-flex flex-column ms-auto">
            <p>Interpreter #{intp.id}</p>
            <p>Name: <span>{intp.name}</span></p>
            <p>Credentials and Certifications: <span>{intp.credentials}</span></p>
            <p>Education / Trainings: <span>{intp.education}</span></p>
            <p>Years of Experience: <span>{intp.years}</span></p>
            <p>Specialty Areas: <span>{intp.specialty}</span></p>
            <p>Why I teach: <span>{intp.whyTeach}</span></p>
            <p>Fun Fact: <span>{intp.funFact}</span></p>
          </div>
        </div>
      ))}
    </>
  );
}