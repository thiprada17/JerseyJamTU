import React, { useState, useEffect, useRef } from "react";
import "./sellerform.css";
import blueLayer from "../assets/bg.png"
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import greyArrow from "../assets/grey_arrow.png"
import Toast from "./component/Toast";
import { FaTag, FaPlusCircle, FaTimes } from "react-icons/fa";

export default function SellerForm() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [imageFile, setImageFile] = useState(null); // เก็บไฟล์ไว้ใช้ตอน submit จ้า
  // const [formData, setFormData] = useState({
  //   shirt_name: "",
  //   shirt_price: "",
  //   shirt_open_date: "",
  //   shirt_close_date: "",
  //   shirt_detail: "",
  //   shirt_url: "",
  // });
  const [formData, setFormData] = useState({
    shirt_name: "",
    shirt_price: "",
    shirt_open_date_display: "", // แบบ dd/mm/yyyy
    shirt_open_date_raw: "",     // แบบ yyyy-mm-dd ใช้ส่ง backend จุ้
    shirt_close_date_display: "",
    shirt_close_date_raw: "",

    shirt_detail: "",
    shirt_url: "",
  });


  // const handleUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setImage(imageUrl); // ใช้ URL preview
  //   }

  //   const fileExt = file.name.split('.').pop();
  //   const fileName = `${Date.now()}.${fileExt}`;
  //   const filePath = `shirt/${fileName}`;

  //   console.log("File selected:", file);

  //   //อัปโหลดรูปไป Supabase Bucket
  //   const { data: uploadData, error: uploadError } = await supabase
  //     .storage
  //     .from("shirt_images")
  //     .upload(filePath, file);

  //   if (uploadError) {
  //     console.error("Upload error:", uploadError.message);
  //     toast.error("Upload failed: " + uploadError.message);
  //     return;
  //   }

  //   //ดึง URL ของรูป
  //   const { data: publicData } = supabase
  //     .storage
  //     .from("shirt_images")
  //     .getPublicUrl(filePath);

  //   //ใส่ URL ของรูปใน Image
  //   if (publicData?.publicUrl) {
  //     setImage(publicData.publicUrl);
  //     console.log("Image uploaded & public URL:", publicData.publicUrl);
  //   }
  // };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);   // พรีวิวรูป
      setImageFile(file);   // เก็บไฟล์ไว้ใช้ตอน submit จรื้อ
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "shirt_price") {
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
    } else {
      let num = Number(value);
      if (num < 0) num = 0;
      if (num > 1000) num = 1000;

      setFormData((prev) => ({
        ...prev,
        [name]: num,
      }));
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};



  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // const payload = {
  //   //   ...formData,
  //   //   shirt_pic: image || "", 
  //   // };
  //   const payload = {
  //     shirt_name: formData.shirt_name,
  //     shirt_price: Number(formData.shirt_price),
  //     shirt_open_date: formData.shirt_open_date_raw,
  //     shirt_close_date: formData.shirt_close_date_raw,
  //     shirt_detail: formData.shirt_detail,
  //     shirt_url: formData.shirt_url,
  //     shirt_pic: image || "",
  //   };
  //   try {
  //     const response = await fetch("http://localhost:8000/shirt/info/post", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       setShowToast(true);

  //       setTimeout(() => {
  //         navigate("/");
  //       }, 2000);

  //       // setTimeout(() => {
  //       //   setShowToast(false);
  //       // }, 3000);
  //     } else {
  //       alert("Warning Mistakes: " + result.error);
  //     }
  //   } catch (err) {
  //     alert("Connection Error");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `shirt/${fileName}`;

      // อัปโหลดไฟล์ไป Supabase
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("shirt_images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        alert("Upload failed: " + uploadError.message);
        return;
      }

      // ดึง public URL ของไฟล์
      const { data: publicData } = supabase
        .storage
        .from("shirt_images")
        .getPublicUrl(filePath);

      imageUrl = publicData.publicUrl;
    }

    // ส่ง backend
    const payload = {
      shirt_name: formData.shirt_name,
      shirt_price: Number(formData.shirt_price),
      shirt_open_date: formData.shirt_open_date_raw,
      shirt_close_date: formData.shirt_close_date_raw,
      shirt_detail: formData.shirt_detail,
      shirt_url: formData.shirt_url,
      shirt_pic: imageUrl,
    };

    try {
      const response = await fetch("http://localhost:8000/shirt/info/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          navigate("/", { state: { showSuccessToast: true } });
        }, 3000);
      } else {
        alert("Warning Mistakes: " + result.error);
      }
    } catch (err) {
      alert("Connection Error");
    }
  };

  const [availableTags] = useState([
    "คณะวิศวกรรมศาสตร์",
    "คณะวิทยาศาสตร์",
    "คณะสถาปัตยกรรมศาสตร์",
    "คณะรัฐศาสตร์",
    "คณะศิลปศาสตร์",
    "คณะเศรษฐศาสตร์",
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagList, setShowTagList] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const tagBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagBoxRef.current && !tagBoxRef.current.contains(event.target)) {
        setShowTagList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <>
      <div className="sellerform-app">
        <div className="sellerform-layers">
          {/* <img src={greenLayer} alt="green" className="sellerform-layer green" />
  <img src={creamLayer} alt="cream" className="sellerform-layer cream" /> */}
          <img src={blueLayer} alt="blue" className="sellerform-layer blue" />
        </div>
        {showToast && (<Toast message="✅ Add Jersey success!" />)}
        <h1 className="sellerform-title">Add Your Jersey</h1>

        <div className="sellerform-container">
          {/* ---------- ซ้ายมือ: โพลารอยด์ + Upload ---------- */}
          <div className="sellerform-left">
            <div className="sellerform-polaroid">
              {image ? (
                <img src={image} alt="Uploaded Jersey" />
              ) : (
                <div className="sellerform-placeholder"></div>
              )}
            </div>
            <label className="sellerform-uploadBtn">
              Upload
              <input type="file" accept="image/*" onChange={handleUpload} hidden />
            </label>
          </div>

          {/* ---------- ขวามือ: ฟอร์ม ---------- */}
          <form className="sellerform-form" onSubmit={handleSubmit}>
            <label className="sellerform-row">
              <span className="sellerform-label">ชื่อเสื้อ</span>
              <input
                name="shirt_name"
                type="text"
                value={formData.shirt_name}
                onChange={handleChange}
                className="sellerform-input"
                placeholder="Rockstar Jersey, TU Jersey..."
              />
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">ราคาเสื้อ</span>
              <input
                name="shirt_price"
                value={formData.shirt_price}
                onChange={handleChange}
                type="number"
                className="sellerform-input"
                placeholder="350"
                min={0}       
                max={1000}   
              />

            </label>
            <label className="sellerform-row">
              <span className="sellerform-label">วันเปิดขาย</span>
              <div className="sellerform-input-wrapper">
                <input
                  type="text"
                  readOnly
                  value={formData.shirt_open_date_display}
                  placeholder="dd/mm/yyyy"
                  className="sellerform-input"
                  onClick={() => document.getElementById("hiddenDateOpen").showPicker()}
                />
                <input
                  type="date"
                  id="hiddenDateOpen"
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    const formatted = `${day}/${month}/${year}`;
                    setFormData((prev) => ({
                      ...prev,
                      shirt_open_date_display: formatted,
                      shirt_open_date_raw: e.target.value,
                    }));
                  }}
                />
              </div>
            </label>

            {/* // onChange={(e) => {
                  //   const [year, month, day] = e.target.value.split("-");
                  //   const formatted = `${day}/${month}/${year}`;
                  //   setFormData((prev) => ({
                  //     ...prev,
                  //     shirt_open_date: formatted,
                  //   }));
                  // }} */}
            <label className="sellerform-row">
              <span className="sellerform-label">วันปิดขาย</span>
              <div className="sellerform-input-wrapper">
                <input
                  type="text"
                  readOnly
                  value={formData.shirt_close_date_display}
                  placeholder="dd/mm/yyyy"
                  className="sellerform-input"
                  onClick={() => document.getElementById("hiddenDateClose").showPicker()}
                />
                <input
                  type="date"
                  id="hiddenDateClose"
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    const formatted = `${day}/${month}/${year}`;
                    setFormData((prev) => ({
                      ...prev,
                      shirt_close_date_display: formatted,
                      shirt_close_date_raw: e.target.value,
                    }));
                  }}
                />
              </div>
            </label>

            {/* // onChange={(e) => {
                  //   const [year, month, day] = e.target.value.split("-");
                  //   const formatted = `${day}/${month}/${year}`;
                  //   setFormData((prev) => ({
                  //     ...prev,
                  //     shirt_close_date: formatted,
                  //   }));
                  // }} */}

            {/* <label className="sellerform-row">
              <span className="sellerform-label">วันปิดขาย</span>
              <input
                type="date"
                name="shirt_close_date"
                value={formData.shirt_close_date}
                onChange={handleChange}
                className="sellerform-input"
                lang="en"
              />
            </label> */}
            <div className="sellerform-block">
              <span className="sellerform-labelTop">รายละเอียดเสื้อ</span>
              <textarea
                name="shirt_detail"
                value={formData.shirt_detail}
                onChange={handleChange}
                className="sellerform-input"
                placeholder={`ราคาเสื้อตัวละ xxx บาท
ไซส์เสื้อบวกเพิ่ม`}
                required
              ></textarea>
            </div>

            <div className="sellerform-block">
              <span className="sellerform-labelTop">ลิงก์ฟอร์มซื้อเสื้อ</span>
              <input
                name="shirt_url"
                value={formData.shirt_url}
                onChange={handleChange}
                type="url"
                className="sellerform-input sellerform-inputLink"
                placeholder="https://example.com/order-form"
                required
              />
              <div className="sellerform-block" ref={tagBoxRef}>
                <span className="sellerform-labelTop">แท็ก</span>
                <div className="tag-input-box" onClick={() => setShowTagList(!showTagList)}>
                  <FaTag className="tag-icon" />
                  <div className="tag-selected-list">
                    {selectedTags.length > 0 ? (
                      selectedTags.map((tag, index) => (
                        <span key={index} className="tag-chip">
                          {tag}
                          <FaTimes
                            className="tag-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTag(tag);
                            }}
                          />
                        </span>
                      ))
                    ) : (
                      <span className="tag-placeholder">เลือกแท็กที่เกี่ยวข้อง...</span>
                    )}
                  </div>

                  {showTagList && (
                    <div className="tag-dropdown">
                      {availableTags.map((tag, index) => (
                        <div
                          key={index}
                          className="tag-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTag(tag);
                          }}
                        >
                          <span>{tag}</span>
                          <FaPlusCircle
                            className={`tag-add-icon ${selectedTags.includes(tag) ? "selected" : ""
                              }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sellerform-submitWrapper">
                <button type="submit" className="sellerform-submitBtn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <img
          src={greyArrow}
          alt="back button"
          className="sellerform-floatingButton"
          onClick={() => navigate('/')}
        />
      </div>
    </>
  );
}
