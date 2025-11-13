import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import "./mixAndmatch.css";
import greyArrow from "../../../../assets/grey_arrow.png";
import Toast from "../../../component/Toast";

const polaroidFrames = [
  { id: 1, className: "frame frame1ass" },
  { id: 2, className: "frame frameShirt" },
  { id: 3, className: "frame frameLeg" },
  { id: 4, className: "frame frame2ass" },
  { id: 5, className: "frame frameShoe" },
  { id: 6, className: "frame frame3ass" },
];

const initialPositionsPct = {
  1: { top: 12.5, left: 16.7 },
  2: { top: 5, left: 38 },
  3: { top: 39, left: 40 },
  4: { top: 31.25, left: 70 },
  5: { top: 75, left: 58 },
  6: { top: 70, left: 28 },
};

export default function MixAndMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const captureRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState({});
  const [positionsPx, setPositionsPx] = useState({});
  const dragOffset = useRef({});
  const dragging = useRef(null);
  const [showHint, setShowHint] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const getEventPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const updatePositions = () => {
    if (!captureRef.current) return;
    const { width, height } = captureRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const newPositions = {};
    for (let id in initialPositionsPct) {
      const offset = dragOffset.current[id] || { dx: 0, dy: 0 };
      newPositions[id] = {
        x: (initialPositionsPct[id].left / 100) * width + offset.dx,
        y: (initialPositionsPct[id].top / 100) * height + offset.dy,
      };
    }
    setPositionsPx(newPositions);
  };

  // drag
  const handlePointerDown = (e, id) => {
    e.preventDefault();
    const { x, y } = getEventPos(e);
    dragging.current = {
      id,
      startX: x,
      startY: y,
      initialOffset: dragOffset.current[id] || { dx: 0, dy: 0 },
      moved: false,
    };
    setShowHint(false);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const { x, y } = getEventPos(e);
    const dx = x - dragging.current.startX;
    const dy = y - dragging.current.startY;

    if (!dragging.current.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      dragging.current.moved = true;
    }

    dragOffset.current[dragging.current.id] = {
      dx: dragging.current.initialOffset.dx + dx,
      dy: dragging.current.initialOffset.dy + dy,
    };

    requestAnimationFrame(updatePositions);
  };

  const handlePointerUp = () => {
    if (dragging.current) {
      localStorage.setItem("framePositions", JSON.stringify(dragOffset.current));
      if (!dragging.current.moved) {
        navigate("/closet", { state: { frameId: dragging.current.id, selectedImages } });
      }
    }
    dragging.current = null;
  };

  // ---------- Screenshot ----------
  const captureScreenshot = () => setConfirmVisible(true);

  const doCapture = async () => {
    setConfirmVisible(false);
    if (!captureRef.current) return;

    const clone = captureRef.current.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.width = `${captureRef.current.offsetWidth}px`;
    clone.style.height = `${captureRef.current.offsetHeight}px`;
    clone.style.zIndex = "9999";
    clone.style.transform = "none";
    document.body.appendChild(clone);

    clone.querySelectorAll(".no-capture").forEach(el => el.remove());
    clone.querySelectorAll(".frame").forEach(frame => {
      const id = frame.dataset.id;
      const pos = positionsPx[id];
      if (pos) {
        frame.style.position = "absolute";
        frame.style.left = `${pos.x}px`;
        frame.style.top = `${pos.y}px`;
        frame.style.transform = "none";
      }
    });

    const images = Array.from(clone.querySelectorAll("img"));
    await Promise.all(images.map(img => new Promise(res => {
      if (img.complete && img.naturalHeight !== 0) res();
      else img.onload = img.onerror = () => res();
    })));

    await new Promise(r => setTimeout(r, 200));

    const canvas = await html2canvas(clone, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fff",
      scale: window.devicePixelRatio || 1,
    });

    document.body.removeChild(clone);

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "mixandmatch.png";
    link.click();

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };
  // ---------- Initialize selected images & positions ----------
  useLayoutEffect(() => {
    const initialize = async () => {
      const container = captureRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) {
        setTimeout(initialize, 100);
        return;
      }

      // โหลด selectedImages จาก location.state หรือ localStorage
      const imgs = location.state?.selectedImages || JSON.parse(localStorage.getItem("selectedImages") || "{}");
      setSelectedImages(imgs);

      // รอให้รูปโหลดเสร็จ
      await Promise.all(
        Object.values(imgs).map(src => {
          if (!src) return Promise.resolve();
          return new Promise(res => {
            const img = new Image();
            img.onload = img.onerror = () => res();
            img.src = src;
          });
        })
      );

      if (location.state?.fromMain) {
        dragOffset.current = {};
      } else {
        const savedPositions = JSON.parse(localStorage.getItem("framePositions") || "{}");
        dragOffset.current = savedPositions || {};
      }

      updatePositions();
    };

    initialize();
  }, [location.state]);

  // ---------- Show hint overlay ----------
  useEffect(() => {
    if (!hasShownHint) {
      setShowHint(true);
      setHasShownHint(true);
      const timer = setTimeout(() => setShowHint(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [hasShownHint]);

  useEffect(() => {
    console.log("Location state:", location.state);
    if (location.state?.fromMain) {
      console.log("Navigated from main");
      dragOffset.current = {}; 
    } else {
      const savedPositions = JSON.parse(localStorage.getItem("framePositions") || "{}");
      dragOffset.current = savedPositions || {};
    }

    updatePositions();

    if (!hasShownHint) {
      setShowHint(true);
      setHasShownHint(true);
      const timer = setTimeout(() => setShowHint(false), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // ---------- Event Listeners ----------
  useEffect(() => {
    const handleMouseMove = handlePointerMove;
    const handleMouseUp = handlePointerUp;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useLayoutEffect(() => {
    const container = captureRef.current;
    if (!container) return;
    const handleTouchStart = (e) => {
      const frameEl = e.target.closest(".frame");
      if (!frameEl) return;
      handlePointerDown(e, Number(frameEl.dataset.id));
    };
    const handleTouchMove = handlePointerMove;
    const handleTouchEnd = handlePointerUp;

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [selectedImages]);

  return (
    <>
      <div
        ref={captureRef}
        className="mixandmatch-container"
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
      >
        {polaroidFrames.map(frame => (
          <div
            key={frame.id}
            data-id={frame.id}
            className={frame.className}
            style={{
              left: positionsPx[frame.id]?.x || 0,
              top: positionsPx[frame.id]?.y || 0,
              cursor: "grab",
              position: "absolute",
            }}
            onMouseDown={(e) => handlePointerDown(e, frame.id)}>
            {selectedImages[frame.id] && (
              <div className="img-wrapper" style={{ pointerEvents: "none" }}>
                <img
                  src={selectedImages[frame.id]}
                  alt="selected"
                  className="frame-img"
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>
        ))}
        <img
          src={greyArrow}
          alt="back button"
          className="sellerform-floatingButton no-capture"
          onClick={() => {
            localStorage.removeItem("selectedImages");
            setSelectedImages({});
            navigate("/main");
          }}
        />
        <button className="mam-btn no-capture" onClick={captureScreenshot}>
          📸 SAVE
        </button>
        {showHint && (
          <div className="hint-overlay no-capture">
            ✨ ลากเพื่อขยับ • กดเพื่อเลือกเสื้อผ้า ✨
          </div>
        )}
      </div>
      {confirmVisible && (
        <div className="confirm-popup no-capture">
          <div className="confirm-box">
            <p>ต้องการแคปภาพตอนนี้ไหม?</p>
            <div className="confirm-btns">
              <button className="ok-btn" onClick={doCapture}>ตกลง</button>
              <button className="cancel-btn" onClick={() => setConfirmVisible(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
      {showToast && <Toast message="Capture Success! 🎀" />}
    </>
  );
}
