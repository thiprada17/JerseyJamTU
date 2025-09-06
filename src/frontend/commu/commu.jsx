import { useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./commu.css";
import viewBg from "../../assets/view-bg.png";
import popup from "../../assets/popup-commu.png";

export default function Commu() {
  const posts = [
    {
      id: 1,
      topic: "111111111122222222233333333334444444444",
      detail: "รายละเอียดโพสต์ที่rgzgggggggggggggggggggggggggggg gssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      contact: "https://line.me/ti/p/Jz20eGXz8v",
    },
    {
      id: 2,
      topic: "โพสต์ที่ 2",
      detail: "รายละเอียดโพสต์ที",
      contact: "https://line.me/ti/p/Jz20eGXz8v",
    },
    {
      id: 3,
      topic: "โพสต์ที่ 3",
      detail: "รายละเอียดโพสต์",
      contact: "https://line.me/ti/p/Jz20eGXz8v",
    },        {
      id: 3,
      topic: "โพสต์ที่ 3",
      detail: "รายละเอียดโพสต์",
      contact: "https://line.me/ti/p/Jz20eGXz8v",
    },        {
      id: 3,
      topic: "โพสต์ที่ 3",
      detail: "รายละเอียดโพสต์",
      contact: "https://line.me/ti/p/Jz20eGXz8v",
    },
  ];

  return (
    <div className="commu-body">
      <div className="commu-navbar">JerseyJamTU</div>

      <div className="commu-topic">
        <div className="commu-popup-container">
          <img src={popup} alt="Popup" className="popup-img" />
          <Link className="popup-button" to="/commu/form"></Link>
        </div>
      </div>

      <div className="commu-container">
        <div className="commu-posttext">Community</div>

        <div className="commu-grid">
          {posts.map((post) => (
            <div className="commu-post bg-slate-50" key={post.id}>
              <div className="commu-post-topic"> {post.topic} </div>
              <div className="commu-post-detail">{post.detail}</div>
              <div className="commu-post-contact">
                ช่องทางการติดต่อ :{" "}
                <a href={post.contact} target="_blank" rel="noopener noreferrer">
                  {post.contact}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
