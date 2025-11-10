import React, { useRef, useEffect } from "react";
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
  <div className="custom-prev" onClick={onClick}>
    ❮
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-next" onClick={onClick}>
    ❯
  </div>
);

export default function MainNews() {
    const sliderRef = useRef(null);
    
  const settings = {
centerMode: true,
centerPadding: "0px",
slidesToShow: 3,
slidesToScroll: 1,
infinite: true,
    speed: 300,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 3000, 
    pauseOnHover: true,
    
  };

  const slides = [
    { id: 1, img: news1, link: "/blog/luckycolor" },
    { id: 2, img: news2, link: "/blog/collarJersey" },
    { id: 3, img: news3, link: "/blog/personalColor" },
    { id: 4, img: news4, link: "/blog/jerseyWith" },
    { id: 5, img: news5, link: "/blog/sevenDayMatch" },
  ];


  return (
    <div className="main-news">
      <Slider {...settings}>
        {slides.map((s) => (
          <div key={s.id} className="slide-wrapper">
            <div className="slick-slide-item">
              <div className="main-news-frame">
                <Link to={s.link}>
                  <img src={s.img} className="main-news-img" alt={`Slide ${s.id}`} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
