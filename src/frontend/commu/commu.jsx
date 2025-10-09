import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./commu.css";
import viewBg from "../../assets/view-bg.png";
import popup from "../../assets/popup-commu.png";
import home_icon from "../../assets/home_icon.png";
import profile_icon from "../../assets/profile-icon.png";

export default function Commu() {
  const [posts, setPosts] = useState([]);
  // console.log(posts)
    const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/commu/get');
        setPosts(response.data);

        // console.log(setPosts)
        console.log("fetching posts success")
      } catch (error) {
        console.error("Error fetching posts:", error);

        
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="commu-body">
      <div className="commu-navbar">
        <Link className="commu-navbar-user" to="/userprofile">
          <img src={profile_icon} alt="profile" className="commu-navbar-user-icon" />
          <div className="commu-navbar-username">{username}</div>
        </Link>

        <div className="commu-navbar-logo">JerseyJamTU</div>

        <Link to="/main" className="commu-navbar-home">
          <img src={home_icon} alt="home" className="commu-navbar-home-icon" />
        </Link>
      </div>

      <div className="commu-topic">
        <div className="commu-popup-container">
          <img src={popup} alt="Popup" className="commu-popup-img" />
          <Link className="commu-popup-button" to="/commu/form"></Link>
        </div>
      </div>

      <div className="commu-container">
        <div className="commu-posttext">Community</div>

        <div className="commu-grid">
          {posts.map((post, index) => (
            <div className="commu-post bg-slate-50" key={post.post_id}>
              <div className="commu-post-topic"> {post.title ?? "No Title"} </div>
              <div className="commu-post-detail">{post.detail ?? "No detail"}</div>
              <div className="commu-post-contact">
                ช่องทางการติดต่อ :{" "}
                <a href={post.contact} target="_blank" rel="noopener noreferrer">
                  {post.contact ?? "No Contact"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
