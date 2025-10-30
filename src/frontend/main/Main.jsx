import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./main.css";
import profile_icon from "../../assets/profile-icon.png";
import topic from "../../assets/main-topic.png";
import MainNews from "./MainNews.jsx"
import FeatureFolder from "./FeatureFolder.jsx"
import { useLocation } from "react-router-dom";
import Toast from "../component/Toast.jsx";
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom';
=======
import filterIcon from "../../assets/sort.png";
import Filter from "./Filter.jsx";
import "./Filter.css";

>>>>>>> Stashed changes

export default function Main() {
  // const posts = [
  //     { id: 1, name: "Shirt name", price: 350, img: "https://picsum.photos/id/1011/600/400" },
  //     { id: 2, name: "Shirt name", price: 350, img: "liverpool.jpg" },
  //     { id: 3, name: "Shirt name", price: 350, img: "chelsea.jpg" },
  //     { id: 4, name: "Shirt name", price: 350, img: "barca.jpg" },
  // ];
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const toastRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const username = localStorage.getItem("username");

<<<<<<< Updated upstream

  useEffect(() => {
    const verify = async () => {
      try {
        const authToken = localStorage.getItem('token');

        if (!authToken) {
          window.alert('token not found');
          navigate('/');
          return
        }

        const authen = await fetch('http://localhost:8000/authen/users', {
          method: 'GET',
          headers: { authorization: `Bearer ${authToken}` }
        });

        if (!authen.ok) {
          console.error('authen fail', authen.status);
          window.alert('authen fail');
          navigate('/');
          return
        }

        const authenData = await authen.json();
        console.log('auth ' + authenData.success);

        if (!authenData && !authenData.data && !authenData.data.success) {
          window.alert('token not pass');
          localStorage.clear();
          navigate('/');
          return
        }

      } catch (error) {
        console.error('verify error:', error);
        window.alert('verify error');
        navigate('/');

      }
    };

    verify();
  }, [navigate]);

=======
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ faculties: [], price: null });
  const handleApplyFilter = (selectedFilters) => {
    setFilters(selectedFilters);
    console.log("Filters applied:", selectedFilters);
  };
>>>>>>> Stashed changes

  // ก้อนนี้คือเพิ่มอนิเมชั่นเล่นๆนะ ไม่ชอบเดะเอาออก มันคือ เฟดตอนเข้า
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

      <div className="main-navbar">
        <Link className="main-navbar-user" to="/userprofile">
          <img src={profile_icon} alt="" className="main-navbar-user-profile-icon" />
          <div className="main-navbar-user-username">{username}</div>
        </Link>
        <div className="main-navbar-logo">JerseyJamTU</div>
      </div>

      <div className="main-topic">
        <div className="main-popup-container">
          <img src={topic} alt="Popup" className="main-popup-img" />
        </div>
      </div>

      <MainNews />
      <FeatureFolder />

      {/* Popup Filter Panel */} 
      {showFilter && ( 
        <div className="filter-container"> 
          <Filter 
            onClose={() => setShowFilter(false)} 
            onApply={handleApplyFilter} 
          /> 
        </div> 
      )}

      <div className="main-container">
        <div className="main-header">
          <div className="main-posttext">ALL JERSEY</div>
          <button className="filters-button" onClick={() => setShowFilter(true)}>
            <img src={filterIcon} alt="Filter Icon" className="filters-icon" />
            <span className="filters-text">Filters</span>
          </button>
        </div>

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
          {/* {posts.map((post, index) => (
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
          ))} */}
        </div>
      </div>
    </div>
  );
}