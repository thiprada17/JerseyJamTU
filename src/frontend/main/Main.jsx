import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./main.css";
import viewBg from "../../assets/view-bg.png";
import topic from "../../assets/main-topic.png";
import MainNews from "./MainNews.jsx"
import FeatureFolder from "./FeatureFolder.jsx"
import { useLocation } from "react-router-dom";
import Toast from "../component/Toast.jsx";

export default function Main() {
  // const posts = [
  //     { id: 1, name: "Shirt name", price: 350, img: "https://picsum.photos/id/1011/600/400" },
  //     { id: 2, name: "Shirt name", price: 350, img: "liverpool.jpg" },
  //     { id: 3, name: "Shirt name", price: 350, img: "chelsea.jpg" },
  //     { id: 4, name: "Shirt name", price: 350, img: "barca.jpg" },
  // ];
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const toastRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  // ก้อนนี้คือเพิ่มอนิเมชั่นเล่นๆนะ ไม่ชอบเดะเอาออก
  const postRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [posts]);
  // สุดตรงนี้จ้า
  // Fetch posts on component mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost:8000/shirt/info/get', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    if (location.state?.showLoginToast) {
      setShowToast(true);
    }
  }, [location.state]);

  return (
    <div className="main-body">
      {showToast && (
        <Toast
          message="✅ Login Success!"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="main-navbar">JerseyJamTU</div>

      <div className="main-topic">
        <div className="main-popup-container">
          <img src={topic} alt="Popup" className="main-popup-img" />
        </div>
      </div>

      <MainNews />
      <FeatureFolder />
      <div className="main-container">
        <div className="main-posttext">ALL JERSEY</div>
        <div className="main-grid">
          {/* {posts.map((post) => (
                        <Link to="/display" state={{id : post.id}} style={{ textDecoration: 'none', color: 'black' }}>
                        <div key={post.id} className="main-post">
                            <div className="main-post-photo">

                                <img src={post.shirt_pic} alt={post.shirt_name} />
                            </div>
                            <div className="main-post-detail-card">
                                <div className="shirt-name">{post.shirt_name}</div>
                                <div className="price">{post.shirt_price} ฿</div>
                            </div>
                        </div>

                        </Link>

                    ))} */}
          {posts.map((post, index) => (
            <Link
              to="/display"
              state={{ id: post.id }}
              key={post.id}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div
                ref={el => postRefs.current[index] = el}
                className="main-post fade-in-up"
              >
                <div className="main-post-photo">
                  <img src={post.shirt_pic} alt={post.shirt_name} />
                </div>
                <div className="main-post-detail-card">
                  <div className="shirt-name">{post.shirt_name}</div>
                  <div className="price">{post.shirt_price} ฿</div>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
