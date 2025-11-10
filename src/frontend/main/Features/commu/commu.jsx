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

  return (
    <div className="commu-body">
      {showToast && (
        <Toast
          message="✅ Post Success!"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="commu-navbar w-full py-4 px-4 text-center flex items-center relative">
        <div className="flex flex-1 justify-start items-center gap-2 min-w-0 sm:items-center">
          <Link className="commu-navbar-user" to="/userprofile">
            <img
              src={profile_icon}
              alt="profile"
              className="commu-navbar-user-icon w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0"
            />
            <div className="commu-navbar-username text-lg sm:text-3xl">
              {username}
            </div>
          </Link>
        </div>

        <div className="commu-navbar-logo pt-2 text-2xl sm:text-5xl">
          JerseyJamTU
        </div>

        <Link to="/main" className="commu-navbar-home flex flex-1 justify-end">
          <img
            src={home_icon}
            alt="home"
            className="commu-navbar-home-icon w-10 h-10 sm:w-14 sm:h-14"
          />
        </Link>
      </div>

      <div className="commu-topic w-full h-96 sm:w-full sm:h-[60rem]">
        <div className="flex justify-center">
          <div className="commu-popup-container relative w-11/12 max-w-mdd sm:w-2/3 sm:max-w-6xl md:w-1/2 md:max-w-5xl">
            <img
              src={popup}
              alt="Popup"
              className="commu-popup w-full h-auto block rounded-2xl"
            />
            <Link
              className="commu-popup-button absolute bottom-0 left-0 w-full h-[30%] bg-transparent rounded-b-2xl"
              to="/commu/form"
            ></Link>
          </div>
        </div>
      </div>

      <div className="commu-container p-10 bg-contain sm:p-24 sm:bg-auto sm:bg-repeat-y sm:bg-top">
        <div className="commu-posttext text-4xl mt-3 mb-5 sm:text-6xl sm:mt-16 sm:mb-14 lg:text-8xl">
          Community
        </div>

        <div className="commu-grid grid grid-cols-1 !gap-4 sm:grid-cols-2 sm:!gap-10 lg:grid-cols-2 lg:!gap-12">
          {posts.map((post, index) => (
            <div
              className="commu-post bg-slate-50 h-auto min-h-0 rounded-4xl border-2 p-3 sm:h-auto sm:min-h-[30rem] sm:rounded-[20px] sm:border-2 sm:p-8"
              key={post.post_id}
            >
              <div className="commu-post-topic h-auto text-3xl sm:min-w-[16] sm:text-4xl lg:text-5xl">
                {" "}
                {post.title ?? "No Title"}{" "}
              </div>
              <div className="commu-post-detail text-xl sm:text-2xl lg:text-3xl">
                {post.detail ?? "No detail"}
              </div>
              <div className="commu-post-contact sm:text-xl lg:text-2xl">
                ช่องทางการติดต่อ :{" "}
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
