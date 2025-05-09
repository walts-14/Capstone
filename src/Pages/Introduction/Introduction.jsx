import Sidenav from "../../Components/Sidenav";

export default function Introduction() {
  return (
    <>
      <Sidenav />
      <div className="introductions d-flex">
        <div className="intro-text d-flex position-absolute justify-content-center text-white p-4 rounded-4">
          INTRODUCTION
        </div>
        <div className="twobuttons fs-1 d-flex flex-row position-absolute">
          <button className="rounded-2 ps-3 pe-3">Interpreter</button>
          <button className="rounded-2 ps-3 pe-3">How to Play</button>
        </div>
      </div>
    </>
  );
}
