import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./closetmm.css";
import greyArrow from "../assets/grey_arrow.png";

export default function Closetmm() {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = ["Jersey", "Accessories", "Shoe", "Bottom"];
  const [category, setCategory] = useState("Jersey");
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const frameId = location.state?.frameId;
  const selectedImages = location.state?.selectedImages || {};

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
    console.log("Closetmm mount, location.state:", location.state);
  }, []);
  // พี่ขอเก็บไว้ก่อนนะ
  // useEffect(() => {
  //   if (category === "Jersey") {
  //     async function fetchShirts() {
  //       try {
  //         const response = await fetch(`http://localhost:8000/shirt/info/get`);
  //         if (!response.ok) throw new Error("Failed to fetch shirt info");
  //         const data = await response.json();
  //         setItems(data);
  //       } catch (error) {
  //         console.error("Closetmm fetch error:", error);
  //         setItems([]);
  //       }
  //     }
  //     fetchShirts();
  //   } else {
  //     setItems([]);
  //   }
  // }, [category]);

  useEffect(() => {
    async function fetchItems() {
      try {
        if (category === "Jersey") {
          const response = await fetch(`http://localhost:8000/shirt/info/get`);
          if (!response.ok) throw new Error("Failed to fetch shirt info");
          const data = await response.json();
          setItems(data);
        } else {
          let folderName = category;
          const response = await fetch(`http://localhost:8000/category/${folderName}/info/get`);
          if (!response.ok) throw new Error("Failed to fetch images from storage");
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Closetmm fetch error:", error);
        setItems([]);
      }
    }
    fetchItems();
  }, [category]);


  const handleSelect = (imageUrl) => {
    console.log("Closetmm: handleSelect for frameId", frameId, "imageUrl:", imageUrl);
    console.log("Closetmm: existing selectedImages:", selectedImages);
    const updatedImages = {
      ...selectedImages,
      [frameId]: imageUrl,
    };
    console.log("Closetmm: updatedImages to send back:", updatedImages);
    navigate("/mixandmatch", {
      state: {
        selectedImages: updatedImages,
      },
    });
  };

  const buttonRefs = useRef([]);
  useEffect(() => {
    const currentButton = buttonRefs.current[activeIndex];
    if (currentButton) {
      const offset = currentButton.offsetLeft;
      const width = currentButton.offsetWidth;
      setUnderlineStyle({
        "--underline-offset": `${offset}px`,
        "--underline-width": `${width}px`,
      });
    }
  }, [activeIndex]);

  return (
    <div className="closet-container">
      <div className="closet-left">
        <h1 className="closet-title">Mix & Match</h1>
        <div className="closet-category-bar" style={underlineStyle}>
          <div className="category-buttons">
            {categories.map((cat, index) => (
              <button
                key={cat}
                className={`category-button ${activeIndex === index ? "active" : ""}`}
                onClick={() => {
                  setActiveIndex(index);
                  setCategory(cat);
                }}
                ref={(el) => (buttonRefs.current[index] = el)}
              >
                {cat}
              </button>
            ))}
          </div>
          <img
            src={greyArrow}
            alt="back button"
            className="mam-floatingButton"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      <div className="closet-right">
        <div className="closet-grid">
          {items.length === 0 && <h1 className="closet-title">ยังมะมีรูปจ้า</h1>}
          {items.map((item, index) => (
            <div
              className="closet-item"
              key={item.id || index}
              onClick={() =>
                handleSelect(item.url || item.shirt_pic)
              }
            >
              <img src={item.url || item.shirt_pic} alt={item.shirt_name || item.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
