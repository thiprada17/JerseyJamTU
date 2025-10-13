import React, { useState } from "react";
import "./sevenDayMatch.css";
import microwaveImg from "../../../assets/microwave-seven.png";
import group185Img from "../../../assets/sevenoutfits.png";
import homeIcon from "../../../assets/house-fill.png";

export default function SevenDayMatch() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };
  return (
    <div className="blog-container">
      {/*top bar*/}
      <div className="top-bar">
        <div className="top">
          <div className="bar">
            <span className="post-on">Post on</span>
            <span className="expost-on">15 ตุลาคม 2568</span>
            <div className="bar-by">
              <span className="by">By</span>
              <span className="exby">ลาล่า อิอิ</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`home-btn ${clicked ? "animate" : ""}`}
          onClick={handleClick}
        >
          <span className="btn-icon">
            <img src={homeIcon} alt="styles" className="home-icon" />
          </span>
        </button>
      </div>
      {/*Body*/}
      <div className="content">
        <img src={microwaveImg} alt="header" className="header-img" />
        <h1 className="blog-title1">1 อาทิตย์ 7 สไตล์ </h1>
        <h1 className="blog-title2">แมตซ์เสื้อเจอร์ซีย์</h1>
        <div className="style-section">
          <div class="style-item">
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
        <div className="from">
          <span className="from1">แหล่งที่มา</span>
          <br />
          <span className="from2">ให้ทาย</span>
        </div>
        {/*Footer*/}
        <footer className="footer">
          <span className="logo">JerseyJam</span>
        </footer>
      </div>
    </div>
  );
}
