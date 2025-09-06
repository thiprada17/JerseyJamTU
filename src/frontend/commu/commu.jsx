import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./commu.css";
import viewBg from "../../assets/view-bg.png";
import popup from "../../assets/popup-commu.png";

export default function Commu() {
    const [posts, setPosts] = useState([]);
    console.log(posts)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/commu/get');
                setPosts(response.data);

                console.log(setPosts)
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

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
              <div className="commu-post-topic"> {post.title} </div>
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
