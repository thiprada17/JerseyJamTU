import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./user-profile.css";
import usericon from "../../assets/profile-icon2.png";
import topic from "../../assets/main-topic.png";
import { useLocation } from "react-router-dom";
import Toast from "../component/Toast.jsx";

export default function UserProflie() {
    const [activeTab, setActiveTab] = useState(1);
    const username = localStorage.getItem("username")
    const faculty = localStorage.getItem("faculty")
       const year = localStorage.getItem("year")

    let tab1Class = "up-tab";
    if (activeTab == 1) {
        tab1Class += " active-tabs";
    }

    let tab2Class = "up-tab";
    if (activeTab == 2) {
        tab2Class += " active-tabs";
    }
    const posts = [
        { id: 1, name: "Shirt name", price: 350, shirt_pic: "https://picsum.photos/id/1011/600/400" },
        { id: 2, name: "Shirt name", price: 350, shirt_pic: "liverpool.jpg" },
        { id: 3, name: "Shirt name", price: 350, shirt_pic: "chelsea.jpg" },
        { id: 4, name: "Shirt name", price: 350, shirt_pic: "barca.jpg" },
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
                        <div className="up-username-name">{username}</div>

                    </div>

                    <div className="up-top-box">
                        <div className="up-year">
                            <div className="up-year-topic">year</div>
                            <div className="up-year-num">{year}</div>
                        </div>

                        <div className="up-faculty">
                            <div className="up-faculty-topic">faculty</div>
                            <div className="up-faculty-name">{faculty}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="up-tabs">
                <div className={tab1Class} onClick={() => setActiveTab(1)}> Your fav </div>
                <div className={tab2Class} onClick={() => setActiveTab(2)}>Your post</div>
            </div>

            <div className="up-content-tabs">
                <div className={activeTab === 1 ? "up-content active-content" : "up-content"}>
        
                    <div className="up-fav-grid">
                        {posts.map((post) => (
                            <Link to="/display" state={{ id: post.id }} style={{ textDecoration: 'none', color: 'black' }}>
                                <div key={post.id} className="up-fav-post">
                                    <div className="up-post-photo">
                                        <img src={post.shirt_pic} alt={post.shirt_name} />
                                    </div>
                                    <div className="up-fav-detail">
                                        <div className="up-fav-detail-name">{post.name}</div>
                                         <button className="up-fav-cmore">
                                        see more <br /> Detail
                                    </button>
                                    </div>
                                   
                                </div>

                            </Link>

                        ))}
                    </div>
                </div>
                <div className={activeTab === 2 ? "up-content active-content" : "up-content"}>
                    <div className="commu-grid">
          {posts.map((post, index) => (
            <div className="commu-post bg-slate-50" key={index}>
              <div className="commu-post-topic"> {post.title ?? "No Title"} </div>
              <div className="commu-post-detail">{post.detail ?? "No detail"}</div>
              <div className="commu-post-contact">
                ช่องทางการติดต่อ :{" "}
                <a href={post.contact } target="_blank">
                  {post.contact ?? "No Contact"}
                </a>
              </div>
            </div>
          ))}
        </div>
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
