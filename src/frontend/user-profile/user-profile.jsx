import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./user-profile.css";
import usericon from "../../assets/profile-icon2.png";
import ConfirmBox from "../component/ConfirmBox.jsx";
import "../main/Features/commu/commu.css";
import "../component/loading.css";

const getFacultyShort = (s) => {
  if (!s) return "";
  const str = String(s).trim();
  const mParen = str.match(/\(([^()]+)\)\s*$/);
  if (mParen) return mParen[1].trim();
  return str;
};

export default function UserProfile() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  const faculty = localStorage.getItem("faculty");
  const year = localStorage.getItem("year");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          window.alert('token not found');
          navigate('/');
          return;
        }

        const authen = await fetch('https://jerseyjamtu.onrender.com/authen/users', {
          method: 'GET',
          headers: { authorization: `Bearer ${authToken}` },
        });

        if (!authen.ok) {
          console.error('authen fail', authen.status);
          window.alert('authen fail');
          navigate('/');
          return;
        }

        const authenData = await authen.json();
        console.log('auth ' + authenData.success);

        if (!authenData && !authenData.data && !authenData.data.success) {
          window.alert('token not pass');
          localStorage.clear();
          navigate('/');
          return;
        }

      } catch (error) {
        console.error('verify error:', error);
        window.alert('verify error');
        navigate('/');
      }
    };

    verify();
  }, [navigate]);

  const handleBack = () => {
    navigate('/main');
  };

  const [activeTab, setActiveTab] = useState(1);
  let tab1Class = "up-tab";
  if (activeTab === 1) tab1Class += " active-tabs";
  let tab2Class = "up-tab";
  if (activeTab === 2) tab2Class += " active-tabs";

  const [favs, setFavs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!user_id) {
        setError("กรุณาเข้าสู่ระบบ");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `https://jerseyjamtu.onrender.com/commu/get/by-user/${user_id}`
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

  const fetchFavs = async () => {
    if (!user_id) {
      setError("กรุณาเข้าสู่ระบบ");
      return;
    }
    try {
      const res = await axios.get(
        `https://jerseyjamtu.onrender.com/shirt/fav/get/${user_id}`
      );
      setFavs(res.data || []);
    } catch (e) {
      console.error(e);
      setError("ดึงรายการถูกใจไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchFavs();
  }, [user_id]);

  useEffect(() => {
    const onFavChanged = () => fetchFavs();
    window.addEventListener("fav-updated", onFavChanged);
    return () => window.removeEventListener("fav-updated", onFavChanged);
  }, []);

  const handleAskDelete = (post_id) => {
    setSelectedPost(post_id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPost) return;
    try {
      await axios.delete(`https://jerseyjamtu.onrender.com/commu/delete/${selectedPost}`, {
        data: { user_id },
      });
      setPosts((prev) => prev.filter((p) => p.post_id !== selectedPost));
    } catch (e) {
      console.error(e);
      alert("ลบโพสต์ไม่สำเร็จ!");
    } finally {
      setShowConfirm(false);
      setSelectedPost(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedPost(null);
  };

  const handleEditPost = (post) => {
    navigate("/commu/form", { state: { mode: "edit", post } });
  };

  return (
    <div className="up-body">
      {showConfirm && (
        <ConfirmBox
          message="คุณต้องการลบโพสต์นี้ใช่หรือไม่?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <div className="up-top">
        <div className="up-top-container">
          <Link to="/main">
            <button className="commuForm-backButton user-profile " onClick={handleBack}>
              &lt; back
            </button>
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
              <div className="up-faculty-name">{getFacultyShort(faculty)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="up-tabs">
        <div
          className={tab1Class}
          onClick={() => {
            setActiveTab(1);
            fetchFavs();
          }}
        >
          Your fav
        </div>

        <div
          className={tab2Class}
          onClick={() => setActiveTab(2)}
        >
          Your post
        </div>
      </div>
{/* 
      {loading && <div className="up-empty">กำลังโหลด...</div>}
      {!loading && error && <div className="up-empty">{error}</div>} */}

      <div className="up-content-tabs">
        {loading ? (
          <div className="userpro-loader"></div>
        ) : error ? (
          <div className="up-empty">{error}</div>
        ) : (
          <>
            {/* Your fav */}
            {activeTab === 1 && (
              <div className="up-content active-content">
                {favs.length === 0 ? (
                  <div className="up-empty">ยังไม่มีรายการถูกใจ</div>
                ) : (
                  <div className="up-fav-grid">
                    {favs.map((item) => (
                      <div className="up-fav-post" key={item.shirt_id}>
                        <div className="up-post-photo">
                          <img src={item.shirt_pic} alt={item.shirt_name} />
                        </div>
                        <div className="up-fav-detail">
                          <div className="up-fav-detail-name">{item.shirt_name}</div>
                          <Link
                            className="up-fav-cmore"
                            to="/display"
                            state={{ id: item.shirt_id }}
                          >
                            <span>see more details</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Your post */}
            {activeTab === 2 && (
              <div className="up-content active-content">
                {posts.length === 0 ? (
                  <div className="up-empty">ยังไม่มีโพสต์</div>
                ) : (
                  <div className="commu-grid">
                    {posts.map((post) => (
                      <div className="commu-post bg-slate-50" key={post.post_id}>
                        <div className="commu-post-topic">{post.title ?? "No Title"}</div>
                        <div className="commu-post-detail">{post.detail ?? "No detail"}</div>
                        <div className="commu-post-contact">
                          ช่องทางการติดต่อ:{" "}
                          {post.contact ? (
                            <a href={post.contact} target="_blank" rel="noreferrer">
                              {post.contact}
                            </a>
                          ) : (
                            "No Contact"
                          )}
                        </div>
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
                            onClick={() => handleAskDelete(post.post_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}