import React from "react";
import "./MaintenanceModal.css"; // styling below
import maintenanceIcon from "../../assets/maintenance-icon.png"; // Replace with actual path
const MaintenanceModal = ({ show }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <img
          src={maintenanceIcon} // Replace with actual path
          alt="Maintenance Icon"
          className="modal-image"
        />
        <h2>Oops! site under maintenance</h2>
        <p>
          We're working hard to improve your experience and will be back online shortly.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceModal;
