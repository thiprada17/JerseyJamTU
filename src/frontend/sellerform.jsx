import React, { useState } from "react";
import "./sellerform.css";
import greenLayer from "../assets/green.png";
import creamLayer from "../assets/cream.png";
import blueLayer from "../assets/blue.png";

export default function sellerform() {
  const [image, setImage] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="sellerform-app">
      {/* -------- หน้าแรก -------- */}
      <section className="sellerform-pageOne">
        <div className="sellerform-layers">
          <img src={greenLayer} alt="green" className="sellerform-layer" />
          <img src={creamLayer} alt="cream" className="sellerform-layer" />
          <img src={blueLayer} alt="blue" className="sellerform-layer" />
        </div>
        <h1 className="sellerform-title">Add Your Jersey</h1>
      </section>

      {/* -------- หน้าที่สอง -------- */}
      <section className="sellerform-pageTwo">
        <div className="sellerform-container">
          {/* ซ้ายมือ: อัปโหลดรูป */}
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

          {/* ขวามือ: ฟอร์ม */}
          <form className="sellerform-form">
            <label>
                <span>ชื่อเสื้อ</span>
                <input type="text" placeholder="Rockstar Jersey, TU Jersey..." />
            </label>

            <label>
                <span>ราคาเสื้อ</span>
                <input type="number" placeholder="350" />
            </label>

            <label>
                <span>วันเปิดขาย</span>
                <input type="date" />
            </label>

            <label>
                <span>วันปิดขาย</span>
                <input type="date" />
            </label>

            <label className="sellerform-labelTop">
                <span>รายละเอียดเสื้อ</span>
                <textarea placeholder="ราคาเสื้อตัวละ xxx บาท&#10;ไซส์เสื้อบวกเพิ่ม"></textarea>
            </label>

            <label className="sellerform-labelTop">
                <span>ลิงก์ฟอร์มซื้อเสื้อ</span>
                <input type="url" placeholder="link url" />
            </label>
          </form>
        </div>
      </section>
    </div>
  );
}