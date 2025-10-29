import React from "react";
import "./notification.css";

export default function Notification({ type = "error", message, onClose }) {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <div className="notification-box">
        <p className="notification-message">{message}</p>
        <button className="notification-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
