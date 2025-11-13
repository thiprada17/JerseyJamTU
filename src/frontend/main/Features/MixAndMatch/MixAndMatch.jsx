import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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

        const authen = await fetch('https://jerseyjamtu.onrender.com/authen/users', {
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

  const getPosi = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };
  const onPointerDown = (e, id) => {
    const { x, y } = getPosi(e);
    setDragging({
      id,
      startX: x,
      startY: y,
      initialX: positionsPx[id].x,
      initialY: positionsPx[id].y,
    });
    setMoved(false);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const { x, y } = getPosi(e);
    const dx = x - dragging.startX;
    const dy = y - dragging.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setMoved(true);
    setPositionsPx((prev) => ({
      ...prev,
      [dragging.id]: {
        x: dragging.initialX + dx,
        y: dragging.initialY + dy,
      },
    }));
    dragOffset.current[dragging.id] = { dx, dy };
  };

  const onPointerUp = () => setDragging(null);
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
  const initialPositionsPct = {
    1: { top: 12.5, left: 16.7 },
    2: { top: 5, left: 38 },
    3: { top: 39, left: 40 },
    4: { top: 31.25, left: 70 },
    5: { top: 75, left: 58 },
    6: { top: 70, left: 28 },
  };

  const [positionsPx, setPositionsPx] = useState({});
  const dragOffset = useRef({});
  const updatePositions = () => {
    if (!captureRef.current) return;
    const { width, height } = captureRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    const newPositions = {};
    for (let id in initialPositionsPct) {
      newPositions[id] = {
        x:
          (initialPositionsPct[id].left / 100) * width +
          (dragOffset.current[id]?.dx || 0),
        y:
          (initialPositionsPct[id].top / 100) * height +
          (dragOffset.current[id]?.dy || 0),
      };
    }
    setPositionsPx(newPositions);
  };
  useLayoutEffect(() => {
    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  const [showHint, setShowHint] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  useEffect(() => {
    if (!hasShownHint) {
      setShowHint(true);
      setHasShownHint(true);
      const timer = setTimeout(() => setShowHint(false), 2500); 
      return () => clearTimeout(timer);
    }
  }, [hasShownHint]);
  const handleFrameEnter = () => {
    setShowHint(true);
  };
  const handleFrameLeave = () => {
    setShowHint(false);
  };
  const hideHint = () => setShowHint(false);

  return (
    <>
    
      <div ref={captureRef}
        className="mixandmatch-container"
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}>
        {polaroidFrames.map((frame) => (
          <div
            key={frame.id}
            className={frame.className}
            onMouseEnter={handleFrameEnter}
            onMouseLeave={handleFrameLeave}
            onTouchStart={handleFrameEnter}
            onTouchEnd={handleFrameLeave}
            onMouseDown={(e) => { onPointerDown(e, frame.id); hideHint(); }}
            onTouchStartCapture={(e) => { onPointerDown(e, frame.id); hideHint(); }}
            onClick={() => { onClickFrame(frame.id); hideHint(); }}

            style={{
              transform: `translate(${positionsPx[frame.id]?.x}px, ${positionsPx[frame.id]?.y}px)`,
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
        {showHint && (
          <div className="hint-overlay no-capture">
            ✨ ลากเพื่อขยับ • กดเพื่อเลือกเสื้อผ้า ✨
          </div>)}
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
