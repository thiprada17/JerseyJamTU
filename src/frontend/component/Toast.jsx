import React, { useEffect, useRef, useState } from "react";
import "./toast.css";

export default function Toast({ message }) {
  const toastRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 300);

    const hideTimer = setTimeout(() => {
      if (toastRef.current) {
        toastRef.current.classList.add("hide");
      }
    }, 3000); // 500 delay + 2500 display

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="custom-toast-login" ref={toastRef}>
      {message}
    </div>
  );
}
