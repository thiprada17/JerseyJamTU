import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./commu.css";
// import viewBg from "../../assets/view-bg.png";
import popup from "../../../../assets/popup-commu.png";
import home_icon from "../../../../assets/home_icon.png";
import profile_icon from "../../../../assets/profile-icon.png";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../../../component/Toast.jsx";

export default function Commu() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  // console.log(posts)
  const username = localStorage.getItem("username");
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (location.state?.postSuccess) {
      setShowToast(true);
      // ล้าง state กัน toast เด้งซ้ำ
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
        const response = await axios.get("http://localhost:8000/commu/get");
        setPosts(response.data);

        // console.log(setPosts)
        console.log("fetching posts success");
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleBack = () => {
    navigate("/main");
  };

  return (
    <div className="commu-body">
      {/* {showToast && (
        <Toast
          message="✅ Post Success!"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )} */}

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

        <div className="commu-grid">
          {posts.map((post, index) => (
            <div className="commu-post bg-slate-50" key={post.post_id}>
              <div className="commu-post-topic">
                {" "}
                {post.title ?? "No Title"}{" "}
              </div>
              <div className="commu-post-detail">
                {post.detail ?? "No detail"}
              </div>
              <div className="commu-post-contact">
                <a
                  href={post.contact}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
