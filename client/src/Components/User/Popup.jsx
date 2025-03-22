import React from "react";
import "../../App.css";

function Popup({ message, type, onClose }) {
  return (
    <div className={`popup ${type} bg-warning rounded-5 my-4 shadow-lg p-3 mb-5 `}>
      <div className="popup-content d-flex flex-row flex-wrap justify-content-center align-items-center">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Popup;