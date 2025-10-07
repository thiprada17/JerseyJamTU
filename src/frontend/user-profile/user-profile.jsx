import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./user-profile.css";
import usericon from "../../assets/profile-icon2.png";
import topic from "../../assets/main-topic.png";
import { useLocation } from "react-router-dom";
import Toast from "../component/Toast.jsx";

export default function UserProflie() {
    const posts = [
        { id: 1, name: "Shirt name", price: 350, img: "https://picsum.photos/id/1011/600/400" },
        { id: 2, name: "Shirt name", price: 350, img: "liverpool.jpg" },
        { id: 3, name: "Shirt name", price: 350, img: "chelsea.jpg" },
        { id: 4, name: "Shirt name", price: 350, img: "barca.jpg" },
    ];
    //      const [posts, setPosts] = useState([]);
    //   const location = useLocation();
    //   const toastRef = useRef(null);
    //   const [showToast, setShowToast] = useState(false);

    //   // Fetch posts on component mount
    //   useEffect(() => {
    //     async function fetchPosts() {
    //       try {
    //         const response = await fetch('http://localhost:8000/shirt/info/get', {
    //           method: 'GET',
    //         });

    //         if (!response.ok) {
    //           throw new Error("Failed to fetch posts");
    //         }

    //         const data = await response.json();
    //         setPosts(data);
    //       } catch (error) {
    //         console.error("Error fetching posts:", error);
    //       }
    //     }

    //     fetchPosts();
    //   }, []);

    //   useEffect(() => {
    //     if (location.state?.showLoginToast) {
    //       setShowToast(true);
    //     }
    //   }, [location.state]);

    return (
        <div className="up-body">
            {/* {showToast && (
        <Toast
          message="✅ Login Success!"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )} */}

            <div className="up-top">
                <div className="up-top-container">

                    <div className="up-username">
                        <img src={usericon} className="up-usericon" />
                        <div className="up-username-name">USERNAME</div>

                    </div>

                    <div className="up-top-box">
                        <div className="up-year">
                            <div className="up-year-topic">year</div>
                            <div className="up-year-num">1</div>
                        </div>

                        <div className="up-faculty">
                            <div className="up-faculty-topic">faculty</div>
                            <div className="up-faculty-name">วิดวะ</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="up-tabs">
                <div className="up-tab active-tabs">Your fav</div>
                <div className="up-tab">Your post</div>
            </div>

            <div className="up-content-tabs">
                <div className="up-content active-content">
                    your fav post jaaa
                </div>
                <div className="up-content">
                    your post jaaaa
                </div>

            </div>

            {/* <div className="main-container">
                <div className="main-posttext">ALL JERSEY</div>
                <div className="main-grid">
                    {posts.map((post) => (
                        <Link to="/display" state={{ id: post.id }} style={{ textDecoration: 'none', color: 'black' }}>
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

                    ))}
                </div>
            </div> */}
        </div>
    );
}
