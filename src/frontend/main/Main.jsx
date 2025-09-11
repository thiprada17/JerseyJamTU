import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./main.css";
import viewBg from "../../assets/view-bg.png";
import topic from "../../assets/main-topic.png";

export default function Main() {
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
    <div className="main-body">
      <div className="main-navbar">JerseyJamTU</div>

      <div className="main-topic">
        <div className="main-popup-container">
          <img src={topic} alt="Popup" className="main-popup-img" />
          <Link className="main-popup-button" to="/commu/form"></Link>
        </div>
      </div>

      <div className="main-container">
        <div className="main-posttext">Community</div>

        <div className="main-grid">
          {posts.map((post) => (
            <div className="main-post bg-slate-50" key={post.id}>
              <div className="main-post-topic"> {post.title} </div>
              <div className="main-post-detail">{post.detail}</div>
              <div className="main-post-contact">
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
