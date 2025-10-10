import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./user-profile.css";
import usericon from "../../assets/profile-icon2.png";
import home_icon from "../../assets/home_icon.png";
import { useLocation } from "react-router-dom";
import Toast from "../component/Toast.jsx";

export default function UserProfile() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("username")
  const faculty = localStorage.getItem("faculty")
  const year = localStorage.getItem("year")

  const [activeTab, setActiveTab] = useState(1);
  let tab1Class = "up-tab";
  if (activeTab === 1) {
    tab1Class += " active-tabs";
  }
  let tab2Class = "up-tab";
  if (activeTab === 2) {
    tab2Class += " active-tabs";
  }

  const [favs, setFavs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //get post **get by userid**
  useEffect(() => {
    const run = async () => {
      //อย่าเพิ่งเกิด ไปเกิดใหม่ใน sprint 4 น้าาา
      if (!user_id) {
        setError("กรุณาเข้าสู่ระบบ");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:8000/commu/get/by-user/${user_id}`
        );
        setPosts(res.data || []);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("ดึงข้อมูลไม่สำเร็จ");
        setLoading(false);
      }
    };
    run();
  }, [user_id]);

  //delete post
  const handleDeletePost = async (post_id) => {
    const ok = window.confirm("ต้องการลบโพสต์นี้หรือไม่?");
    if (!ok) return;
    try {
      await axios.delete(`http://localhost:8000/commu/delete/${post_id}`, {
        data: { user_id },
      });
      setPosts((prev) => prev.filter((p) => p.post_id !== post_id));
    } catch (e) {
      console.error(e);
      alert("ลบโพสต์ไม่สำเร็จ!");
    }
  };

  // edit post + back to commu
  const handleEditPost = (post) => {
    navigate("/commu/form", { state: { mode: "edit", post } });
  };

  return (
    <div className="up-body">
      <div className="up-top">
        <div className="up-top-container">
          <Link to="/main">
            <img src={home_icon} alt="home" className="up-home-icon" />
          </Link>

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
        <div className={tab1Class} onClick={() => setActiveTab(1)}>Your fav</div>
        <div className={tab2Class} onClick={() => setActiveTab(2)}>Your post</div>
      </div>
      {loading && <div className="up-loading">กำลังโหลด...</div>}
      {!loading && error && <div className="up-error">{error}</div>}

      <div className="up-content-tabs">
        {/* Your fav */}
        <div className={activeTab === 1 ? "up-content active-content" : "up-content"}>
          <div className="up-fav-grid">
            {favs.length === 0 && <div className="up-empty">ยังไม่มีรายการถูกใจ</div>}
            {favs.map((item) => (
              <Link
                key={item.shirt_id}
                to="/display"
                state={{ id: item.shirt_id }}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="up-fav-post">
                  <div className="up-post-photo">
                    <img src={item.shirt_pic} alt={item.shirt_name} />
                  </div>
                  <div className="up-fav-detail">
                    <div className="up-fav-detail-name">{item.shirt_name}</div>
                    <button className="up-fav-cmore">
                      see more <br /> Detail
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Your post (เฉพาะของตัวเอง) */}
        <div className={activeTab === 2 ? "up-content active-content" : "up-content"}>
          <div className="commu-grid">
            {posts.length === 0 && <div className="up-empty">ยังไม่มีโพสต์</div>}

            {posts.map((post) => (
              <div className="commu-post bg-slate-50" key={post.post_id}>
                <div className="commu-post-topic">{post.title ?? "No Title"}</div>
                <div className="commu-post-detail">{post.detail ?? "No detail"}</div>
                <div className="commu-post-contact">
                  ช่องทางการติดต่อ :{" "}
                  {post.contact ? (
                    <a href={post.contact} target="_blank" rel="noreferrer">
                      {post.contact}
                    </a>
                  ) : (
                    "No Contact"
                  )}
                </div>

                {/* edit+delete button */}
                <div className="up-post-actions">
                  <button
                    type="button"
                    className="up-btn up-post-edit"
                    onClick={() => handleEditPost(post)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="up-btn up-post-delete"
                    onClick={() => handleDeletePost(post.post_id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}