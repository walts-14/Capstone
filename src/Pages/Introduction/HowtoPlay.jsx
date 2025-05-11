import Sidenav from "../../Components/Sidenav";
import "../../css/Introductions.css";
import how1 from "../../assets/how1.png";
import how2 from "../../assets/how2.png";
import how3 from "../../assets/how3.png";
import how4 from "../../assets/how4.png";
export default function HowtoPlay() {
  return (
    <>
      <Sidenav />
      <div className="how text-white h-auto pt-5 rounded-4">
        <img
          src={how1}
          className="img-fluid justify-content-center"
          alt="tutorial image"
        />
      </div>
      <div className="howw text-white h-auto pt-5 rounded-4">
        <img
          src={how2}
          className="img-fluid justify-content-center"
          alt="tutorial image"
        />
      </div>
      <div className="howw3 text-white h-auto pt-5 rounded-4">
        <img
          src={how3}
          className="img-fluid justify-content-center"
          alt="tutorial image"
        />
      </div>
      <div className="howw4 text-white h-auto pt-5 rounded-4">
        <img
          src={how4}
          className="img-fluid justify-content-center"
          alt="tutorial image"
        />
      </div>
    </>
  );
}
