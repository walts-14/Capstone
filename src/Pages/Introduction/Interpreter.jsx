import "../../css/Introductions.css";
import Sidenav from "../../Components/Sidenav";
import vid1 from "../../assets/introduction.mp4";
import vid2 from "../../assets/introduction2.mp4";
import vid3 from "../../assets/introduction3.mp4";

const interpreters = [
  {
    id: 1,
    video: vid2,
    name: "Daisy Jane P. Noble",
    teachingExperience: "Since January 2024 until now",
    // journey: "I founded the ADAE (Advocates for Deaf Awareness and Equality) to eliminate communication barriers and to raise awareness of Deaf Culture, providing training to promote understanding and support Deaf leaders and education. ",
    journey:
      "I founded ADAE(Advocates for Deaf Awareness and Equality) to break communication barriers and raise Deaf awareness.",
    whereTaught: "Community seminars, organizations, and awareness programs",
  },
  {
    id: 2,
    video: vid1,
    name: "Arniliza L. Sonio",
    teachingExperience: "1 year and 5 months",
    journey:
      "I learned FSL to improve accessibility and now volunteer with ADAE to support both Deaf and hearing communities.",
    whereTaught: "Community Seminars and Workshops",
  },
  {
    id: 3,
    video: vid3,
    name: "Ali Ahmed Amoroto",
    teachingExperience: "1 year",
    journey:
      "I’m an FSL teacher and leader helping hearing students become skilled interpreters and advocates in public and private sectors.",
    whereTaught: "Public, Private sectors and Government Officers",
  },
];

export default function Interpreter() {
  return (
    <>
      {interpreters.map((intp) => (
        <div
          key={intp.id}
          className="interpreter-intro text-white rounded-3xl p-3 relative"
        >
          <video src={intp.video} autoPlay loop muted className="interpreter-video" />
          <div className="interpreter-details flex flex-col ms-auto">
            <p>Interpreter #{intp.id}</p>
            <p>
              Name: <span>{intp.name}</span>
            </p>
            <p>
              Teaching Experience: <span>{intp.teachingExperience}</span>
            </p>
            <p>
              FSL Journey: <span>{intp.journey}</span>
            </p>
            <p>
              Where I've Taught: <span>{intp.whereTaught}</span>
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
