import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./main.css";
import news1 from "../../assets/news1.png";
import news2 from "../../assets/news2.png";
import news3 from "../../assets/news3.png";
import news4 from "../../assets/news4.png";
import news5 from "../../assets/news5.png";
import { Link } from "react-router-dom";

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: "absolute",
      left: "31.5%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      cursor: "pointer",
      fontSize: "2rem",
      color: "#3d3d3dff",
    }}
  >
    ❮
  </div>
);


const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: "absolute",
      right: "31.5%",
      top: "50%",
      transform: "translate(50%, -50%)",
      zIndex: 2,
      cursor: "pointer",
      fontSize: "2rem",
      color: "#3d3d3dff",
    }}
  >
    ❯
  </div>
);

export default function MainNews() {
const settings = {
  centerMode: true,
  centerPadding: "0px",
  slidesToShow: 3,
  infinite: true,
  speed: 500,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  focusOnSelect: true,
  autoplay: true,
  autoplaySpeed: 3000,  
  pauseOnHover: true,
};

  const slides = [
    { id: 1, img: news1, link: "/blog/luckycolor"},
    { id: 2, img: news2, link: "/blog/collarJersey" },
    { id: 3, img: news3, link: "/blog/personalColor" },
    { id: 4, img: news4, link: "/blog/jerseyWith" },
    { id: 5, img: news5, link: "/blog/sevenDayMatch" },
  ];

  return (
<div className="main-news">
  <Slider {...settings}>
    {slides.map((s) => (
      <div key={s.id} style={{ padding: "0 10px" }}>
        <div className="slick-slide-item">
          <div className="main-news-frame">
            <img src={s.img} className="main-news-img" alt={`Slide ${s.id}`} />
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>
  );
}
