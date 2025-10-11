import React from "react";
import "./sevenDayMatch.css";
import microwaveImg from "../../../assets/microwave-seven.png";
import group185Img from "../../../assets/sevenoutfits.png";

export default function SevenDayMatch() {
  return (
    <div className="blog-container">
      {/* 🔹 แถบด้านบน */}
      <div className="top-bar">
        <div className="top-left">
          <span className="post-on">Post on 15 ตุลาคม 2568</span>
          <span className="by">By ลาล่า วิธ</span>
        </div>
        <button
          className="home-btn"
          onClick={() => alert("กลับไปหน้า Home")}
        >
          🏠 Home
        </button>
      </div>

      {/* 🔹 ส่วนเนื้อหา */}
      <div className="content">
        <img src={microwaveImg} alt="header" className="header-img" />

        <h1 className="blog-title1">1 อาทิตย์ 7 สไตล์ </h1>
        <h1 className="blog-title2">แมตซ์เสื้อเจอร์ซีย์</h1>

        <div className="style-section">
          <img src={group185Img} alt="styles" className="style-img" />

          <div className="day-list">
            <div className="day monday">วันจันทร์</div>
            <div className="day tuesday">วันอังคาร</div>
            <div className="day wednesday">วันพุธ</div>
            <div className="day thursday">วันพฤหัสบดี</div>
            <div className="day friday">วันศุกร์</div>
            <div className="day saturday">วันเสาร์</div>
            <div className="day sunday">วันอาทิตย์</div>
          </div>
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer className="footer">
        <span className="logo">JerseyJam</span>
      </footer>
    </div>
  );
}