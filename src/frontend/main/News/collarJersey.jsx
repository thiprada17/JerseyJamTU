import React, { useState } from "react";
import "./collarJersey.css";
import microwaveImg from "../../../assets/microwave-collarJersey.png";
import homeIcon from "../../../assets/news_houseIcon.png";
import rPic from "../../../assets/collar_r-face.png";
import oPic from "../../../assets/collar_o-face.png";
import sPic from "../../../assets/collar_s-face.png";
import hPic from "../../../assets/collar_h-face.png";
import recPic from "../../../assets/collar_rec-face.png";
import dPic from "../../../assets/collar_d-face.png";
import rJ from "../../../assets/collar_r-jersey.png";
import oJ from "../../../assets/collar_o-jersey.png";
import sJ from "../../../assets/collar_s-jersey.png";
import hJ from "../../../assets/collar_h-jersey.png";
import recJ from "../../../assets/collar_rec-jersey.png";
import dJ from "../../../assets/collar_d-jersey.png";
import { useNavigate } from "react-router-dom";

export default function CollarJersey() {
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
    <div className="blog-container">
      {/*top bar*/}
      <div className="top-bar">
        <div className="bar">
          <span className="post-on">Post on</span>
          <span className="expost-on">8 ตุลาคม 2568</span>
          <div className="bar-by">
            <span className="by">By</span>
            <span className="exby">สมใจ ใจลอย</span>
          </div>
        </div>
        <button
          type="button"
          className={`home-btn ${clicked ? "animate" : ""}`}
          onClick={handleClick}
          title="กลับหน้าหลัก"
        >
          <span className="btn-icon">
            <img src={homeIcon} alt="styles" className="home-icon" />
          </span>
        </button>
      </div>

      {/*Body*/}
      <div className="content">
        <img src={microwaveImg} alt="header" className="header-img" />
        <h1 className="blog-title1">How To</h1>
        <h1 className="blog-title2">เลือกคอเสื้อให้เข้ากับรูปหน้า</h1>
        <div className="block">
          <div className="faceRow">
            <div className="r-face">
              <div className="r-description">
                <div className="r-num-block">
                  <span className="r-num">1</span>
                </div>
                <div className="r-thai-block">
                  <span className="r-thainame">หน้ากลม</span>
                </div>
              </div>
              <div className="r-pictures">
                <img src={rPic} alt="styles" className="r-pic" />
                <img src={rJ} alt="styles" className="r-j" />
              </div>
            </div>

            <div className="o-face">
              <div className="o-description">
                <div className="o-num-block">
                  <span className="o-num">2</span>
                </div>
                <div className="o-thai-block">
                  <span className="o-thainame">หน้ายาว หรือ หน้ารูปไข่</span>
                </div>
              </div>
              <div className="o-pictures">
                <img src={oPic} alt="styles" className="o-pic" />
                <img src={oJ} alt="styles" className="o-j" />
              </div>
            </div>
          </div>

          <div className="faceRow">
            <div className="s-face">
              <div className="s-description">
                <div className="s-num-block">
                  <span className="s-num">3</span>
                </div>
                <div className="s-thai-block">
                  <span className="s-thainame">หน้าเหลี่ยม</span>
                </div>
              </div>
              <div className="s-pictures">
                <img src={sPic} alt="styles" className="s-pic" />
                <img src={sJ} alt="styles" className="s-j" />
              </div>
            </div>

            <div className="h-face">
              <div className="h-description">
                <div className="h-num-block">
                  <span className="h-num">4</span>
                </div>
                <div className="h-thai-block">
                  <span className="h-thainame">หน้ารูปหัวใจ</span>
                </div>
              </div>
              <div className="h-pictures">
                <img src={hPic} alt="styles" className="h-pic" />
                <img src={hJ} alt="styles" className="h-j" />
              </div>
            </div>
          </div>

          <div className="faceRow">
            <div className="rec-face">
              <div className="rec-description">
                <div className="rec-num-block">
                  <span className="rec-num">5</span>
                </div>
                <div className="rec-thai-block">
                  <span className="rec-thainame">หน้าสี่เหลี่ยมผืนผ้า</span>
                </div>
              </div>
              <div className="rec-pictures">
                <img src={recPic} alt="styles" className="rec-pic" />
                <img src={recJ} alt="styles" className="rec-j" />
              </div>
            </div>

            <div className="d-face">
              <div className="d-description">
                <div className="d-num-block">
                  <span className="d-num">6</span>
                </div>
                <div className="d-thai-block">
                  <span className="d-thainame">หน้ารูปเพชร</span>
                </div>
              </div>
              <div className="d-pictures">
                <img src={dPic} alt="styles" className="d-pic" />
                <img src={dJ} alt="styles" className="d-j" />
              </div>
            </div>
          </div>
        </div>

        <div className="from">
          <span className="from1">แหล่งที่มา</span>
          <br />
          <span className="from2">
            "The Face Shape Guide" – by TheHairStyler.com
          </span>
          <br />
          <span className="from3">
            Paul Mitchell Education – Face Shape Styling Principles
          </span>
        </div>
        {/*Footer*/}
      </div>
      
      <footer className="footer">
        <span className="logo">JerseyJam</span>
      </footer>
    </div>
  );
}