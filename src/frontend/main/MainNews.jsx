import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./main.css";


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
  };

  const slides = [
    { id: 1, img: "https://picsum.photos/id/1011/600/400" },
    { id: 2, img: "https://picsum.photos/id/1012/600/400" },
    { id: 3, img: "https://picsum.photos/id/1013/600/400" },
    { id: 4, img: "https://picsum.photos/id/1014/600/400" },
    { id: 5, img: "https://picsum.photos/id/1015/600/400" },
  ];

  return (
    <div className="main-news">
      <Slider {...settings}>
        {slides.map((s) => (
          <div key={s.id} style={{ padding: "0 10px" }}>
            <div className="main-news slick-slide-item">
              <img src={s.img} className="main-news-img" alt={`Slide ${s.id}`}/>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
