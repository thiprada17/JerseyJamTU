import React, { useState } from "react";
import "./jerseyWith.css";
import microwaveImg from "../../../assets/microwave-jersey.png";
import homeIcon from "../../../assets/house-fill.png";
import jersey1 from "../../../assets/jersey1.png";
import jersey2 from "../../../assets/jersey2.png";
import jersey3 from "../../../assets/jersey3.png";
import jersey4 from "../../../assets/jersey4.png";

export default function jerseyWith() {
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
            <span className="expost-on">1 กันยา 2568</span>
            <div className="bar-by">
              <span className="by">By</span>
              <span className="exby">หมามอม</span>
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
        <h1 className="blog-title1">เจอร์ซีย์ กับ อะไรดี?</h1>
        <h1 className="blog-title2">(ในลุคมอท่อ)</h1>
        <div className="box">
          <div className="box1">
            <span className="title-box1">เท่ห์ ๆ</span>
            <br />
            <span className="tt-box1">เล่นบาสกับเพื่อน</span>
            <img src={jersey1} alt="styles" className="j1" />
          </div>
          <div className="box2">
            <span className="title-box2">วันชิว ๆ</span>
            <br />
            <span className="tt-box2">ซิกเนเจอร์เด็กมอท่อ</span>
            <img src={jersey2} alt="styles" className="j2" />
          </div>
          <div className="box3">
            <span className="title-box3">อัง อัง อัง</span>
            <br />
            <span className="tt-box3">กางเกงหรือกระเป๋า</span>
            <br />
            <span className="ttt-box3">โดเรม่อน</span>
            <img src={jersey3} alt="styles" className="j3" />
          </div>
          <div className="box4">
            <span className="title-box4">แซ่บ ๆ</span>
            <br />
            <span className="tt-box4">รรรรรุ่นพี่สายฝอ</span>
            <img src={jersey4} alt="styles" className="j4" />
          </div>
        </div>
        <div className="from">
          <span className="from1">แหล่งที่มา</span>
          <br />
          <span className="from2">เพื่อนในมอทุ่งรังสิตชื่อดัง</span>
        </div>
        {/*Footer*/}
        <footer className="footer">
          <span className="logo">JerseyJam</span>
        </footer>
      </div>
    </div>
  );
}
