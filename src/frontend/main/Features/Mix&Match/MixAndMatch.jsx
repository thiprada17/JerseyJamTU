import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./mixAndmatch.css";
import greyArrow from "../../../../assets/grey_arrow.png";
import html2canvas from "html2canvas";
import Toast from "../../../component/Toast";

const polaroidFrames = [
  { id: 1, className: "frame frame1ass" },
  { id: 2, className: "frame frameShirt" },
  { id: 3, className: "frame frameLeg" },
  { id: 4, className: "frame frame2ass" },
  { id: 5, className: "frame frameShoe" },
  { id: 6, className: "frame frame3ass" },
];

export default function MixAndMatch() {
  const navigate = useNavigate();
  const locate = useLocation();
  const captureRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState({});
  const [positions, setPositions] = useState(
    polaroidFrames.reduce((acc, frame) => {
      acc[frame.id] = { x: 0, y: 0 };
      return acc;
    }, {})
  );
  const [dragging, setDragging] = useState(null);
  const [moved, setMoved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

useEffect(() => {
    const verify = async () => {
      try {
        const authToken = localStorage.getItem('token');

        if (!authToken) {
          window.alert('token not found');
          navigate('/');
          return
        }

        const authen = await fetch('http://localhost:8000/authen/users', {
          method: 'GET',
          headers: { authorization: `Bearer ${authToken}` }
        });

        if (!authen.ok) {
          console.error('authen fail', authen.status);
          window.alert('authen fail');
          navigate('/');
          return
        }

        const authenData = await authen.json();
        console.log('auth ' + authenData.success);

        if (!authenData && !authenData.data && !authenData.data.success) {
          window.alert('token not pass');
          localStorage.clear();
          navigate('/');
          return
        }

      } catch (error) {
        console.error('verify error:', error);
        window.alert('verify error');
        navigate('/');

      }
    };

    verify();
  }, [navigate]);
    
  useEffect(() => {
    if (locate.state?.selectedImages) {
      setSelectedImages(locate.state.selectedImages);
    } else {
      const stored = localStorage.getItem("selectedImages");
      if (stored) setSelectedImages(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [selectedImages]);

  const onMouseDown = (e, id) => {
    e.preventDefault();
    setDragging({
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: positions[id].x,
      initialY: positions[id].y,
    });
    setMoved(false);
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setMoved(true);
    setPositions((prev) => ({
      ...prev,
      [dragging.id]: {
        x: dragging.initialX + dx,
        y: dragging.initialY + dy,
      },
    }));
  };

  const onMouseUp = () => setDragging(null);

  const onClickFrame = (id) => {
    if (!moved) {
      navigate("/closet", {
        state: { frameId: id, selectedImages },
      });
    }
  };

  const captureScreenshot = () => setConfirmVisible(true);

  const doCapture = async () => {
    setConfirmVisible(false);
    if (!captureRef.current) return;

    const element = captureRef.current;
    const saveButton = document.querySelector(".mam-btn");
    if (saveButton) saveButton.style.visibility = "hidden";

    await new Promise((r) => setTimeout(r, 100));

    const rect = element.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: null,
      scale,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
      logging: false,
      ignoreElements: (el) => el.classList.contains("no-capture"),
    });

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "mixandmatch.png";
    link.click();

    if (saveButton) saveButton.style.visibility = "visible";
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      <div
        ref={captureRef}
        className="mixandmatch-container"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {polaroidFrames.map((frame) => (
          <div
            key={frame.id}
            className={frame.className}
            onMouseDown={(e) => onMouseDown(e, frame.id)}
            onClick={() => onClickFrame(frame.id)}
            style={{
              transform: `translate(${positions[frame.id].x}px, ${positions[frame.id].y}px)`,
              cursor: "grab",
              position: "absolute",
            }}
          >
            {selectedImages[frame.id] && (
              <div className="img-wrapper">
                <img
                  src={selectedImages[frame.id]}
                  alt="selected"
                  className="frame-img"
                />
              </div>
            )}
          </div>
        ))}

        <img
          src={greyArrow}
          alt="back button"
          className="sellerform-floatingButton no-capture"
          onClick={() => navigate("/main")}
        />

        <button className="mam-btn no-capture" onClick={captureScreenshot}>
          📸 SAVE
        </button>
      </div>

      {confirmVisible && (
        <div className="confirm-popup no-capture">
          <div className="confirm-box">
            <p>ต้องการแคปภาพตอนนี้ไหม?</p>
            <div className="confirm-btns">
              <button className="ok-btn" onClick={doCapture}>
                ตกลง
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmVisible(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && <Toast message="Capture Success! 🎀" />}
    </>
  );
}
