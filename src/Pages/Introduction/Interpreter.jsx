import "../../css/Introductions.css";
import Sidenav from "../../Components/Sidenav";
import vid1 from "../../assets/introduction.mp4";
import vid2 from "../../assets/introduction2.mp4";

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
      "I started learning FSL to help address accessibility challenges, and now I volunteered ADAE to support the Deaf and hearing communities.",
    whereTaught: "Community Seminars and Workshops",
  },
];

export default function Interpreter() {
  return (
    <>
      {interpreters.map((intp) => (
        <div
          key={intp.id}
          className="interpreter-intro text-white rounded-4 p-3 position-static"
        >
          <video src={intp.video} autoPlay loop className="interpreter-video" />
          <div className="interpreter-details d-flex flex-column ms-auto">
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
