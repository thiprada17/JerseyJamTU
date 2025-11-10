import React, { useState } from "react";
import "./personalcolor.css";
import microwaveImg from "../../../assets/microwave-personal.png";
import perImg from "../../../assets/personalcolor.png";
import homeIcon from "../../../assets/news_houseIcon.png";
import { useNavigate } from "react-router-dom";

export default function personalcolor() {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      navigate("/main");
    }, 200);
  };

  return (
    <div className="perC-blog-container">
      {/*top bar*/}
      <div className="perC-top-bar">
        <div className="perC-top">
          <div className="perC-bar">
            <span className="perC-post-on">Post on</span>
            <span className="perC-expost-on">20 ตุลา 2568</span>
            <div className="perC-bar-by">
              <span className="perC-by">By</span>
              <span className="perC-exby">อาจารย์สมศรี</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`perC-home-btn ${clicked ? "animate" : ""}`}
          onClick={handleClick}
        >
          <span className="perC-btn-icon">
            <img src={homeIcon} alt="styles" className="perC-home-icon" />
          </span>
        </button>
      </div>
      {/*Body*/}
      <div className="perC-content">
        <img src={microwaveImg} alt="header" className="perC-header-img" />
        <h1 className="perC-blog-title1">Personal Color</h1>
        <div className="perC-blog-topic">Personal Color คืออะไร?</div>
        <div className="perC-blog-content">
          Personal Color หรือโทนสีประจำตัว คือ สีที่เหมาะที่สุดของแต่ละคน
          ซึ่งจะช่วยขับผิวให้ดูเปล่งปลั่งมีออร่ามากขึ้น
          และยังช่วยเสริมเสน่ห์ให้เราได้ด้วยค่ะ
          ในทางตรงกันข้ามถ้าเราเลือกสีที่ไม่เหมาะกับตัวเองก็จะทำให้หน้าดูหมอง
          ไม่สดใส ริ้วรอยบนหน้าดูชัดขึ้นได้
        </div>
        <div className="perC-blog-content">
          วิธีการเช็กสี Personal Color
          ก็ขึ้นอยู่กับหลายปัจจัยทั้งอันเดอร์โทนสีผิว สีตา และสีผมของแต่ละคน
          ซึ่งศาสตร์ของ Personal Color นี้จะจัดแบ่งสีผิวออกเป็นโทนอุ่น (Warm
          Tone) และ โทนเย็น (Cool Tone) โดยแต่ละโทนจะแบ่งออกเป็นชื่อฤดูมีทั้งหมด
          4 กลุ่ม ตามลักษณะสีผิวจะมีชื่อฤดูที่แตกต่างกันไป ดังนี้ค่ะ
        </div>
        <div className="perC-style-section">
          <div class="perC-style-item">
            <img src={perImg} alt="styles" className="perC-style-img" />
          </div>
        </div>
        <div className="perC-from">
          <span className="perC-from1">แหล่งที่มา</span>
          <br />
          <span className="perC*from2">
            ชวนเช็ก Personal Color หาโทนสีประจำตัวที่ใช่ จะแต่งลุคไหนก็เกิด! -
            cosmenet
          </span>
        </div>
      </div>
    {/*Footer*/}
    <footer className="perC-footer">
      <span className="perC-logo">JerseyJam</span>      </footer>
    </div>
  );
}
