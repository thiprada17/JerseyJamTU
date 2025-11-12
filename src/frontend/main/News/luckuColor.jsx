import React, { useState } from "react";
import "./luckyColor.css";
import microwaveImg from "../../../assets/microwave-lucky.png";
import tableImg from "../../../assets/luckyTable.png";
import homeIcon from "../../../assets/news_houseIcon.png";
import { useNavigate } from "react-router-dom";

export default function luckyColor() {
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
    <div className="LuckyC-blog-container">
      {/*top bar*/}
      <div className="LuckyC-top-bar">
        <div className="LuckyC-top">
          <div className="LuckyC-bar">
            <span className="LuckyC-post-on">Post on</span>
            <span className="LuckyC-expost-on">20 ตุลา 2568</span>
            <div className="LuckyC-bar-by">
              <span className="LuckyC-by">By</span>
              <span className="LuckyC-exby">อาจารย์สมศรี</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`LuckyC-home-btn ${clicked ? "animate" : ""}`}
          onClick={handleClick}
          title="กลับหน้าหลัก"
        >
          <span className="LuckyC-btn-icon">
            <img src={homeIcon} alt="styles" className="LuckyC-home-icon" />
          </span>
        </button>
      </div>
      {/*Body*/}
      <div className="LuckyC-content">
        <img src={microwaveImg} alt="header" className="LuckyC-header-img" />
        <h1 className="LuckyC-blog-title1">
          สีเสื้อมงคล <br />
          ประจำเดือนตุลาคม 2568
        </h1>
        <div className="LuckyC-blog-topic">
          ใส่สีเสื้อมงคล 2568 เสริมอะไรได้บ้าง ?
        </div>
        <div className="LuckyC-blog-content">
          ต้องบอกว่าเสื้อสีมงคลเป็นของคู่ใจกับอาชีพนักขาย จะขายของ ขายงาน
          ไปเจอคู่เดตแรกไม่อยากทะเลาะกับแฟนสีเสื้อมงคล 2568
          ช่วยได้ไม่เชื่อก็ต้องเชื่อเพราะเราลองทำมาแล้ว!
          อย่างน้อยใส่ไว้ใจมาเรื่องดี ๆ จะตามมาแน่นอน
          แต่ก่อนที่เราจะไปดูว่าวันไหนสีอะไรมงคล
          อะไรห้ามใส่มาดูสิ่งที่เสริมแต่ละด้านกันหน่อยดีกว่าว่ามันช่วยอะไรได้บ้าง
        </div>

        <ul className="LuckyC-blog-content">
          <li>
            <span style={{ color: "#DF2D3B" }}>
              สีเสื้อเสริมด้านการเงิน โชคลาภ :
            </span>
            ใส่เสื้อสีดี ๆ จะช่วยเสริมโชคลาภ รับทรัพย์เข้ากระเป๋าแบบจุก ๆ
            ทำอะไรเป็นเงินเป็นทอง ขายงานลูกค้าก็ผ่าน
            ใดใดคือค้าขายเงินทองไหลมาเทมา
          </li>
          <li>
            <span style={{ color: "#DF2D3B" }}> สีเสื้อเสริมด้านการงาน : </span>
            ฝั่งการงานถ้าเราเลือกสีเสื้อดีมีชัยไปกว่าครึ่ง
            เพราะจะช่วยเสริมให้การทำงานราบรื่น
            ติดต่อเจรจาประสบความสำเร็จไม่ว่าอุปสรรคอะไรก็จะผ่านไปได้ด้วยดี
            ทำมาค้าขายก็รุ่ง เลือกสีดีไม่มีอะไรให้กังวลใจแน่นอน
          </li>
          <li>
            <span style={{ color: "#DF2D3B" }}>สีเสื้อเสริมด้านความรัก : </span>
            อยากน่าสนใจมีแรงดึงดูดมากขึ้น แม่สีเสื้อมงคลคือปั๊วะต้องลอง
            ใส่สีดีจะช่วยเสริมความรักให้สมหวังมีคนหลงรัก
            ไปที่ไหนก็มีคนเอ็นดูถ้าทะเลาะกับแฟนอยู่ง้อได้แน่นอน
          </li>
          <li>
            <span style={{ color: "#DF2D3B" }}>
              สีเสื้อห้ามใส่กาลกิณีประจำวัน :{" "}
            </span>
            ห้าม ห้าม ห้ามเตือนแล้วนะ! เป็นสีที่ไม่ควรใส่เลยในวันนั้น ๆ
            ใส่แล้วอาจทำให่โชคไม่ดี หรือมีเรื่องติด ๆ ขัด ๆ
            ไม่สำเร็จดั่งใจหวังสักอย่าง หรือวันนั้นอาจจะกลายเป็น Bad Day
            ไปเลยก็ได้ อ่านต่อได้ท
          </li>
        </ul>

        <div className="LuckyC-style-section">
          <div class="LuckyC-style-item">
            <img src={tableImg} alt="styles" className="LuckyC-style-img" />
          </div>
        </div>
        <div className="LuckyC-from">
          <span className="LuckyC-from1">แหล่งที่มา</span>
          <br />
          <span className="LuckyC-from2">
            สีเสื้อมงคล 2568 แจกตารางสีเสริมดวงดี รับทรัพย์ เพิ่มความปังตลอดปี!
            - phusuda{" "}
          </span>
        </div>
      </div>
      {/*Footer*/}
      <footer className="LuckyC-footer">
        <span className="LuckyC-logo">JerseyJam</span>
      </footer>
    </div>
  );
}
