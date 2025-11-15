import React, { useState, useEffect, useRef } from "react";
import "./sellerform.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import greyArrow from "../../assets/grey_arrow.png"
import Toast from "../component/Toast";
import { FaTag, FaPlusCircle, FaTimes } from "react-icons/fa";
import Notification from "../component/Notification"; // << เพิ่ม
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SellerForm() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [imageFile, setImageFile] = useState(null); // เก็บไฟล์ไว้ใช้ตอน submit จ้า
  const [notification, setNotification] = useState({ message: "", type: "error" }); // << เพิ่ม
  const [startDate, setStartDate] = useState(null); // for datepicker
  const [endDate, setEndDate] = useState(null);     // for datepicker
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.shirt_name ||
      formData.shirt_price === "" ||
      !formData.shirt_open_date_raw ||
      !formData.shirt_close_date_raw ||
      !formData.shirt_detail ||
      !formData.shirt_url
    ) {
      setNotification({ message: "กรุณากรอกข้อมูลให้ครบถ้วน", type: "error" });
      return;
    }

    // << เพิ่ม: validate วันปิดต้องมากกว่าวันเปิด (noti แทน alert)
    const o = formData.shirt_open_date_raw;
    const c = formData.shirt_close_date_raw;
    if (!o || !c || c <= o) {
      setNotification({ message: "กรุณากรอกวันที่ให้ถูกต้อง: วันปิดต้องมากกว่าวันเปิด", type: "error" });
      return;
    }

    if (!imageFile) {
      setNotification({ message: "กรุณาอัปโหลดรูปภาพเสื้อ", type: "error" });
      return;
    }

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
        setNotification({ message: "อัปโหลดรูปไม่สำเร็จ: " + uploadError.message, type: "error" }); // << แทน alert
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
      // tags: selectedTags,
    };

    try {
      const response = await fetch("https://jerseyjamtu.onrender.com/shirt/info/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Tags to send:", selectedTags);
        setShowToast(true);
        setTimeout(() => {
          navigate("/", { state: { showSuccessToast: true } });
        }, 3000);

        const shirtId = result.shirt_id;
        if (!shirtId) {
          console.error("No shirt_id returned from server");
          return;
        }

        //ส่งแท็กแต่ละอันไปbackend
        for (const tag of selectedTags) {
          await fetch("https://jerseyjamtu.onrender.com/shirt/tag/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shirt_id: shirtId, tag_name: tag }),
          });
        }
      } else {
        setNotification({ message: "กรอกข้อมูลไม่ถูกต้อง: " + (result?.error || ""), type: "error" }); // << แทน alert
      }
    } catch (err) {
      setNotification({ message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง", type: "error" }); // << แทน alert
    }
  };

const [availableTags] = useState([
  "วิศวกรรมศาสตร์",
  "วิทยาศาสตร์",
  "สถาปัตยกรรมศาสตร์",
  "รัฐศาสตร์",
  "ศิลปศาสตร์",
  "เศรษฐศาสตร์",
  "แพทยศาสตร์",
  "พาณิชยศาสตร์",
  "นิติศาสตร์",
  "สังคมสงเคราะห์ศาสตร์",
  "สังคมวิทยาและมานุษยวิทยา",
  "วารสารศาสตร์",
  "ศึกษาศาสตร์",
  "ศิลปกรรมศาสตร์",
  "ทันตแพทยศาสตร์",
  "สหเวชศาสตร์",
  "พยาบาลศาสตร์",
  "เภสัชศาสตร์",
  "วิทยาศาสตร์และเทคโนโลยี",
  "แพทย์แผนไทย",
  "สิ่งแวดล้อม",
  "นวัตกรรม",
  "นานาชาติ",
  "สถาบันเทคโนโลยีนานาชาติ",
  "วิทยาลัยโลกคดีศึกษา",
  "วิทยาลัยสหวิทยาการ",
  "วิทยาลัยพัฒนาศาสตร์"
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
        {/* << เพิ่ม Notification ให้เด้งบนหน้านี้ */}
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: "", type: "error" })}
        />

        {/* <div className="sellerform-layers">
          <img src={blueLayer} alt="blue" className="sellerform-layer blue" />
        </div> */}
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
                required
              />
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">ราคาเสื้อ</span>
              <input
                name="shirt_price"
                type="number"
                className="sellerform-input"
                placeholder="350"
                value={formData.shirt_price}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === "") {
                    setFormData((prev) => ({ ...prev, shirt_price: "" }));
                    return;
                  }

                  let num = Number(value);
                  if (num < 0) num = 0;
                  if (num > 1000) num = 1000;

                  setFormData((prev) => ({ ...prev, shirt_price: num }));
                }}
                onInput={(e) => {
                  if (e.target.value > 1000) e.target.value = 1000; // ป้องกันการพิมพ์เกิน
                  if (e.target.value < 0) e.target.value = 0;
                }}
                min={0}
                max={1000}
                required
              />
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">วันเปิดขาย</span>
              <div className="date-input-wrapper">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (!date) return;
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    setFormData(prev => ({
                      ...prev,
                      shirt_open_date_display: `${day}/${month}/${year}`,
                      shirt_open_date_raw: `${year}-${month}-${day}`
                    }));
                  }}
                  className="sellerform-input"
                  placeholderText="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                />

              </div>
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">วันปิดขาย</span>
              <div className="date-input-wrapper">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    if (!date) return;
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    setFormData(prev => ({
                      ...prev,
                      shirt_close_date_display: `${day}/${month}/${year}`,
                      shirt_close_date_raw: `${year}-${month}-${day}`
                    }));
                  }}
                  className="sellerform-input"
                  placeholderText="dd/mm/yyyy"
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                />

              </div>
            </label>
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
              <span className="sellerform-labelTop">ลิงก์ฟอร์มสั่งซื้อ</span>
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