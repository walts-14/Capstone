import "../../css/Introductions.css";
import Sidenav from "../../Components/Sidenav";
import vid1 from "../../assets/acknowledge.mp4";
import vid2 from "../../assets/Where are you frtom.mp4";


const interpreters = [
  {
    id: 1,
    video: vid1,
    name: "Jane “Jay” Doe",
    teachingExperience: "8 years",
    journey: "I discovered my passion for FSL while volunteering at a Deaf youth camp.",
    whereTaught: "Public schools and community youth programs"
  },
  {
    id: 2,
    video: vid2,
    name: "Carlos Rivera",
    teachingExperience: "5 years",
    journey: "I began learning FSL in college after taking an intro course and never stopped.",
    whereTaught: "Local community center and online workshops"
  }
];

export default function Interpreter() {
  return (
    <>
      {interpreters.map((intp) => (
        <div
          key={intp.id}
          className="interpreter-intro text-white rounded-4 p-3 position-static"
        >
          <video
            src={intp.video}
            controls
            className="interpreter-video"
          />
          <div className="interpreter-details d-flex flex-column ms-auto">
            <p>Interpreter #{intp.id}</p>
            <p>Name: <span>{intp.name}</span></p>
            <p>Teaching Experience: <span>{intp.teachingExperience}</span></p>
            <p>FSL Journey: <span>{intp.journey}</span></p>
            <p>Where They’ve Taught: <span>{intp.whereTaught}</span></p>
          </div>
        </div>
      ))}
    </>
  );
}
