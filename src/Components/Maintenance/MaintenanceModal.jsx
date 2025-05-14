import React from "react";
import "./MaintenanceModal.css";
import maintenanceIcon from "../../assets/maintenance-icon.png";

const MaintenanceModal = ({ show, onClose }) => {
  if (!show) return null;

  // Stop clicks inside the box from closing
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="maintenance-modal-backdrop" onClick={onClose}>
      <div className="maintenance-modal-box" onClick={stopPropagation}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <img
          src={maintenanceIcon}
          alt="Maintenance Icon"
          className="maintenance-modal-image"
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
