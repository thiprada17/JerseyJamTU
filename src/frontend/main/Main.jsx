import { useRef, useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import "./main.css";
import profile_icon from "../../assets/profile-icon.png";
import topic from "../../assets/main-topic.png";
import tagIcon from "../../assets/tags-fill.png";
import MainNews from "./MainNews.jsx"
import FeatureFolder from "./FeatureFolder.jsx"
import Toast from "../component/Toast.jsx";
import { useNavigate } from 'react-router-dom';
import filterIcon from "../../assets/sort.png";
import Filter from "./Filter.jsx";
import "./Filter.css";
import "../component/loading.css";


export default function Main() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fillterposts, setfillterPosts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ faculties: [], price: "" });
  const [filterApplied, setFilterApplied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const username = localStorage.getItem("username");
  const filterRef = useRef(null); //ฝ้าย ๆ ลองทำ ลบได้
  const [isLoading, setIsLoading] = useState(true);


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

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const response = await fetch('https://jerseyjamtu.onrender.com/shirt/info/get', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        const postsWithTags = await Promise.all(
          data.map(async (post) => {
            try {
              const resTag = await fetch(`https://jerseyjamtu.onrender.com/shirt/tag/get/${post.id}`);
              const tags = await resTag.json();
              return { ...post, tags };
            } catch {
              return { ...post, tags: [] };
            }
          })
        );
        setPosts(postsWithTags);
        setfillterPosts(postsWithTags);
        setFilterApplied(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  /// fillterrrrrrrrrrrr
  const [showFilter, setShowFilter] = useState(false);
  const handleApplyFilter = async (incomingFilters) => {
    try {
      setSelectedFilters(incomingFilters);
      const TagID = [];
      const { faculties, price } = incomingFilters;
      console.log(price)
      const hasAnyFilter =
        (faculties && faculties.length > 0) ||
        (typeof price === "string" && price.trim() !== "");

      if (!hasAnyFilter) {
        setfillterPosts(posts);
        setFilterApplied(false);
        return;
      }

      let minPrice = 0;
      let maxPrice = 1000;
      if (price) {
        if (price.includes("ต่ำกว่า")) {
          maxPrice = parseInt(price.match(/\d+/)[0]);
        } else if (price.includes("ขึ้นไป")) {
          minPrice = parseInt(price.match(/\d+/)[0]);
          maxPrice = 1000;
        } else if (price.includes("-")) {
          const [min, max] = price.match(/\d+/g).map(Number);
          minPrice = min;
          maxPrice = max;
        }
      }
      console.log(price)

      const prefixedFaculties = faculties.map(fac => `คณะ${fac}`);
      prefixedFaculties.forEach(faculty => {
        if (faculty === "คณะวิทยาศาสตร์") TagID.push(1);
        if (faculty === "คณะรัฐศาสตร์") TagID.push(2);
        if (faculty === "คณะวิศวกรรมศาสตร์") TagID.push(3);
        if (faculty === "คณะสถาปัตยกรรมศาสตร์") TagID.push(4);
        if (faculty === "คณะเศรษฐศาสตร์") TagID.push(5);
        if (faculty === "คณะศิลปศาสตร์") TagID.push(6);
      });

      if (faculties.length > 0 && TagID.length === 0) {
        setfillterPosts([]);
        setFilterApplied(true);
        return;
      }

      // fetch filtered shirts
      const res = await fetch('https://jerseyjamtu.onrender.com/shirt/fillter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTagIds: TagID, minPrice, maxPrice })
      });
      let data = await res.json();

      // fetch tags พร้อมกับแต่ละ post
      const postsWithTags = await Promise.all(
        data.map(async (post) => {
          try {
            const resTag = await fetch(`https://jerseyjamtu.onrender.com/shirt/tag/get/${post.id}`);
            const tags = await resTag.json();
            return { ...post, tags };
          } catch {
            return { ...post, tags: [] };
          }
        })
      );

      setfillterPosts(postsWithTags);
      setFilterApplied(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters({ faculties: [], price: "" });
    setfillterPosts(posts);
    setFilterApplied(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target) &&
        !event.target.closest(".filters-button")) {
        setShowFilter(false);
      }
    }
    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/")
  }

  return (
    <div className="main-body">
      <div className="main-navbar">
        <Link className="main-navbar-user" to="/userprofile">
          <img src={profile_icon} alt="" className="main-navbar-user-profile-icon" />
          <div className="main-navbar-user-username">{username}</div>
        </Link>
        <div className="main-navbar-logo">JerseyJamTU</div>
        <button className="main-navbar-logout" onClick={handleLogout}>
          Log out
        </button>
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
          <div ref={filterRef}> {/*ชั้นทดลองทำ ลบได้*/}
            <Filter
              onClose={() => setShowFilter(false)}
              onApply={handleApplyFilter}
              onClear={handleClearFilters}
              value={selectedFilters}
              onChange={setSelectedFilters}
            />
          </div>
        </div>
      )}

      <div className="main-container" >

        <div className="main-header">
          <div className="main-posttext">ALL JERSEY</div>
          <button
            className="filters-button"
            onClick={() => setShowFilter((prev) => !prev)} // toggle เปิด/ปิด
          >
            <img src={filterIcon} alt="Filter Icon" className="filters-icon" />
            <span className="filters-text">Filters</span>
          </button>
        </div>

        <div className="main-grid">
          {isLoading ? (
            <div className="main-loading">
              <div className="spinner-border text-secondary" role="status"></div>
              <div className="loading-text">Loading...</div>
            </div>
          ) : (
            (filterApplied && fillterposts.length === 0) ||
            (!filterApplied && posts.length === 0)
          ) ? (
            <div className="no-results">ไม่พบรายการเสื้อ</div>
          ) : (
            fillterposts.map((post) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}