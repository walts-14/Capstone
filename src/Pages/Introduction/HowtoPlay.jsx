import Sidenav from "../../Components/Sidenav";
import "../../css/Introductions.css";
import how1 from "../../assets/how1.png";
import how2 from "../../assets/how2.png";
import how3 from "../../assets/how3.png";
import how4 from "../../assets/how4.png";
import how5 from "../../assets/how5.png";
import how6 from "../../assets/how6.png";
export default function HowtoPlay() {
  const howImages = [how1, how5, how2, how3, how4, how6];
  return (
    <>
      {howImages.map((src, idx) => (
        <div key={idx} className="how rounded-4">
          <img
            src={src}
            className="img-fluid"
            alt={`tutorial step ${idx + 1}`}
          />
        </div>
      ))}
    </>
  );
}
