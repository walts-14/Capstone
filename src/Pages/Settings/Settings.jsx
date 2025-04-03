import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidenav from "../../Components/Sidenav";
import "../../css/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Settings() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn"); // Also clear logged-in state
    navigate("/login", { replace: true }); // Ensure redirection
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setUserName(userName);
  });

  return (
    <>
      <Sidenav />
      <div className="btns">
        <button
          type="button"
          className="btn btn-secondary btn-lg fw-bold fs-3 rounded-5"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </>
  );
}
export default Settings;
