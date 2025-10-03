import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./mixAndmatch.css";
import greyArrow from "../assets/grey_arrow.png";

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

  const [selectedImages, setSelectedImages] = useState({});
  const [positions, setPositions] = useState(
    polaroidFrames.reduce((acc, frame) => {
      acc[frame.id] = { x: 0, y: 0 };
      return acc;
    }, {})
  );
  const [dragging, setDragging] = useState(null);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    console.log("MixAndMatch mount, locate.state:", locate.state);
    if (locate.state?.selectedImages) {
      setSelectedImages(locate.state.selectedImages);
    } else {
      const stored = localStorage.getItem("selectedImages");
      if (stored) {
        setSelectedImages(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
  }, [selectedImages]);

  const handleSelect = (id, imageUrl) => {
    setSelectedImages((prev) => {
      const updated = { ...prev, [id]: imageUrl };
      console.log("MixAndMatch: updated images:", updated);
      return updated;
    });
  };

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
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setMoved(true);
    }
    setPositions((prev) => ({
      ...prev,
      [dragging.id]: {
        x: dragging.initialX + dx,
        y: dragging.initialY + dy,
      },
    }));
  };

  const onMouseUp = () => {
    setDragging(null);
  };

  const onClickFrame = (id) => {
    if (!moved) {
      console.log("MixAndMatch: onClickFrame, navigate to closet with frameId:", id);
      navigate("/closet", {
        state: {
          frameId: id,
          selectedImages: selectedImages,
        },
      });
    }
  };

  return (
    <div
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
            <img
              src={selectedImages[frame.id]}
              alt="selected"
              className="frame-img"
            />
          )}

          <input
            type="file"
            accept="image/*"
            id={`file-input-${frame.id}`}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file); 
                handleSelect(frame.id, imageUrl);
              }
            }}
          />
        </div>
      ))}

      <img
        src={greyArrow}
        alt="back button"
        className="sellerform-floatingButton"
        onClick={() => navigate("/main")}
      />
    </div>
  );
}
