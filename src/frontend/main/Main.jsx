import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./main.css";
import profile_icon from "../../assets/profile-icon.png";
import topic from "../../assets/main-topic.png";
import tagIcon from "../../assets/tags-fill.png";
import MainNews from "./MainNews.jsx"
import FeatureFolder from "./FeatureFolder.jsx"
import { useLocation } from "react-router-dom";
import Toast from "../component/Toast.jsx";
import { useNavigate } from 'react-router-dom';
import filterIcon from "../../assets/sort.png";
import Filter from "./Filter.jsx";
import "./Filter.css";


export default function Main() {
  // const posts = [
  //     { id: 1, name: "Shirt name", price: 350, img: "https://picsum.photos/id/1011/600/400" },
  //     { id: 2, name: "Shirt name", price: 350, img: "liverpool.jpg" },
  //     { id: 3, name: "Shirt name", price: 350, img: "chelsea.jpg" },
  //     { id: 4, name: "Shirt name", price: 350, img: "barca.jpg" },
  // ];
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fillterposts, setfillterPosts] = useState([]);
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const username = localStorage.getItem("username");


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
        setfillterPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  // useEffect(() => {
  //   if (location.state?.showLoginToast) {
  //     setShowToast(true);
  //   }
  // }, [location.state]);

  useEffect(() => {
  const showToastFlag = localStorage.getItem("showLoginToast");
  if (showToastFlag === "true") {
    setShowToast(true);
    localStorage.removeItem("showLoginToast");
  }
}, []);


  /// fillterrrrrrrrrrrr
  const [showFilter, setShowFilter] = useState(false);
  const handleApplyFilter = async (selectedFilters) => {

    const TagID = []
    const { faculties, price } = selectedFilters; // array ของชื่อแท็ก

    console.log(faculties)

    let minPrice = 0;
    let maxPrice = 10000;
    if (price) {
      const [min, max] = price.split('-').map(p => parseInt(p));
      minPrice = min;
      maxPrice = max;
    }

    for (let i = 0; i < faculties.length; i++) {
      if (faculties[i] === "วิทยาศาสตร์") {
        TagID.push(1);
      } else if (faculties[i] === "รัฐศาสตร์") {
        TagID.push(2);
      } else if (faculties[i] === "วิศวกรรมศาสตร์") {
        TagID.push(3);
      } else if (faculties[i] === "สถาปัตยกรรมศาสตร์") {
        TagID.push(4);
      } else if (faculties[i] === "เศรษฐศาสตร์") {
        TagID.push(5);
      } else if (faculties[i] === "ศิลปศาสตร์") {
        TagID.push(6);
      }
    }

    try {
      const res = await fetch('http://localhost:8000/shirt/fillter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTagIds: TagID, minPrice, maxPrice })
      });

      const data = await res.json();

      setfillterPosts(data);
    } catch (err) {
      console.error('Error fetching filtered posts:', err);
    }
  };
  useEffect(() => {
    const fetchTagsForPosts = async () => {
      try {
        const postsWithTags = await Promise.all(
          fillterposts.map(async (post) => {
            try {
              const res = await fetch(`http://localhost:8000/shirt/tag/get/${post.id}`);
              if (!res.ok) throw new Error("Failed to fetch tags");
              const tags = await res.json();
              return { ...post, tags }; // เพิ่ม tags เข้า post จ้า
            } catch (err) {
              console.error(`Error fetching tags for post ${post.id}:`, err);
              return { ...post, tags: [] };
            }
          })
        );
        setfillterPosts(postsWithTags);
      } catch (err) {
        console.error("Error fetching tags for all posts:", err);
      }};
    if (fillterposts.length > 0) {
      fetchTagsForPosts();
    }
  }, [fillterposts]);

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
          {fillterposts.map((post) => (
            <Link
              to="/display"
              state={{ id: post.id }}
              key={post.id} // ต้องมี key
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div className="main-post">
                <div className="main-post-photo">
                  <img src={post.shirt_pic} alt={post.shirt_name} />
                </div>
                <div className="main-post-detail-card">
                  <div className="shirt-name">{post.shirt_name}</div>
                  <div className="shirt-bottom-detail">
                    <div className="tags-wrapper">
                      <img src={tagIcon} alt="tag icon" className="tag-icon" />
                      <div className="tags-container">
                        {post.tags && post.tags.length > 0 ? (
                          <span className="tag-item">{post.tags[0].tag_name}</span>
                        ) : (
                          <span className="tag-item">ไม่มีแท็ก</span>
                        )}
                      </div>
                    </div>
                    <div className="price">{post.shirt_price} ฿</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}