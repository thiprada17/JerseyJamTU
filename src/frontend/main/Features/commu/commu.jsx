import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./commu.css";
import popup from "../../../../assets/popup-commu.png";
// import home_icon from "../../../../assets/home_icon.png";
import profile_icon from "../../../../assets/profile-icon.png";
import { useNavigate, useLocation } from "react-router-dom";
import '../../../component/loading.css';

export default function Commu() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  // console.log(posts)
  const username = localStorage.getItem("username");
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (location.state?.postSuccess) {
      setShowToast(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const verify = async () => {
      try {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
          window.alert("token not found");
          navigate("/");
          return;
        }

        const authen = await fetch("http://localhost:8000/authen/users", {
          method: "GET",
          headers: { authorization: `Bearer ${authToken}` },
        });

        if (!authen.ok) {
          console.error("authen fail", authen.status);
          window.alert("authen fail");
          navigate("/");
          return;
        }

        const authenData = await authen.json();
        console.log("auth " + authenData.success);

        if (!authenData && !authenData.data && !authenData.data.success) {
          window.alert("token not pass");
          localStorage.clear();
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("verify error:", error);
        window.alert("verify error");
        navigate("/");
      }
    };

    verify();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/commu/get");
        setPosts(response.data);

        console.log("fetching posts success");
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="commu-body">
      <div className="commu-navbar">
        <Link to="/main" className="commu-navbar-back">
          <button className="commu-navbar-backButton" onClick={handleBack}>
            &lt; back
          </button>
        </Link>

        <div className="commu-navbar-logo">JerseyJamTU</div>

        <Link className="commu-navbar-user" to="/userprofile">
          <img
            src={profile_icon}
            alt="profile"
            className="commu-navbar-user-icon"
          />
          <div className="commu-navbar-username">{username}</div>
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

  {/* ย้าย loading ออกมานอก commu-grid */}
  {loading ? (
    <div className="loading-overlay commuload">
      <div className="spinner-border text-secondary" role="status"></div>
      <div className="loading-text">Loading...</div>
    </div>
  ) : posts.length === 0 ? (
    <div className="loading-text">ยังไม่มีโพสต์</div>
  ) : (
    <div className="commu-grid">
      {posts.map((post) => (
        <div className="commu-post bg-slate-50" key={post.post_id}>
          <div className="commu-post-topic">{post.title ?? "No Title"}</div>
          <div className="commu-post-detail">{post.detail ?? "No detail"}</div>
          <div className="commu-post-contact">
            ช่องทางการติดต่อ :{" "}
            {post.contact ? (
              <a href={post.contact} target="_blank" rel="noopener noreferrer">
                {post.contact}
              </a>
            ) : (
              "No Contact"
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
{/* ขอลองใช้ Link หน่อย */}
<Link to="/commu/form" className="commu-fab" data-tooltip="เพิ่มโพสต์ใหม่">
  +
</Link>
    </div>
  );
}
