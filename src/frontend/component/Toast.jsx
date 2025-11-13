import { useEffect, useState } from "react";
import "./toast.css";

export default function Toast({ message, duration = 3000, onClose }) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => setIsHiding(true), duration - 500);
    const closeTimer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`custom-toast-login ${isHiding ? "hide" : ""}`}>
      {message}
    </div>
  );
}
