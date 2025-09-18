import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./main.css";
import viewBg from "../../assets/view-bg.png";
import topic from "../../assets/main-topic.png";
import MainNews from "./MainNews.jsx"
import FeatureFolder from "./FeatureFolder.jsx"

export default function Main() {
    const posts = [
        { id: 1, name: "Shirt name", price: 350, img: "https://picsum.photos/id/1011/600/400" },
        { id: 2, name: "Shirt name", price: 350, img: "liverpool.jpg" },
        { id: 3, name: "Shirt name", price: 350, img: "chelsea.jpg" },
        { id: 4, name: "Shirt name", price: 350, img: "barca.jpg" },
    ];
    // const [posts, setPosts] = useState([]);
    // console.log(posts)

    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:8000/commu/get');
    //             setPosts(response.data);

    //             console.log(setPosts)
    //         } catch (error) {
    //             console.error("Error fetching posts:", error);
    //         }
    //     };

    //     fetchPosts();
    // }, []);

    return (
        <div className="main-body">
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
                    {posts.map((post) => (
                        <div key={post.id} className="main-post">
                            <div className="main-post-photo">
                 
                                <img src={post.img} alt={post.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div className="main-post-detail-card">
                                <div className="shirt-name">{post.name}</div>
                                <div className="price">{post.price} ฿</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
