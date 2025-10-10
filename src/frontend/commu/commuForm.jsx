import "./commuForm.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

export default function CommuForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.mode === "edit";
  const editingPost = location.state?.post || null;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = Number(user?.user_id);

  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    contact: ''
  });

  useEffect(() => {
    if (isEdit && editingPost) {
      setFormData({
        title: editingPost.title || '',
        detail: editingPost.detail || '',
        contact: editingPost.contact || ''
      });
    }
  }, [isEdit, editingPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!user_id) {
      alert("กรุณาเข้าสู่ระบบก่อนโพสต์/แก้ไข");
      return;
    }

    try {
      if (isEdit && editingPost?.post_id) {
        await axios.put(`http://localhost:8000/commu/post/${editingPost.post_id}`, {
          ...formData,
          user_id
        });
        alert("แก้ไขโพสต์สำเร็จ!");
      } else {
        await axios.post('http://localhost:8000/commu/post', {
          ...formData,
          user_id
        });
        alert("โพสต์สำเร็จ!");
      }

      setTimeout(() => {
        navigate('/userprofile');
      }, 400);

    } catch (error) {
      console.error(error);
      alert("ERROR!!\nโพสต์ไม่สำเร็จ");
    }
  };

  return (
    <div className="form-body">
      <div className="form-box">
        <h2 className="form-header">{isEdit ? "Edit Post" : "Create Post"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form">
            <label className="form-label">หัวข้อโพสต์</label>
            <input
              name="title"
              className="form-input"
              type="text"
              placeholder="Rockstar Jersey, TU Jersey…"
              onChange={handleChange}
              value={formData.title}
              required
            />
          </div>

          <div className="form">
            <label className="form-label">รายละเอียดโพสต์</label>
            <textarea
              name="detail"
              className="form-input"
              placeholder="เสื้อเจอร์ซีย์สำหรับคนคูล ๆ เย็นสบาย…"
              rows="3"
              onChange={handleChange}
              value={formData.detail}
              required
            />
          </div>

          <div className="form">
            <label className="form-label">ช่องทางการติดต่อ</label>
            <input
              name="contact"
              className="form-input"
              type="url"
              placeholder="https://www.facebook.com/"
              onChange={handleChange}
              value={formData.contact}
              required
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="submit-btn" type="submit">
              {isEdit ? "UPDATE" : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}