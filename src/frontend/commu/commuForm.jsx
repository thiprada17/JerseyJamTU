import "./commuForm.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LIMITS = { title: 100, detail: 500, contact: 200 };

// ไว้กัน error อย่างงนะ
const escapeHTML = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// เปนไฮไลต์ มันแอ๊บดีอะ
function DetailOverlay({ value }) {
  const html = useMemo(() => {
    const safe = escapeHTML(value);
    return {
      __html:
        safe.slice(0, LIMITS.detail) +
        (safe.length > LIMITS.detail
          ? `<mark class="overflow">${safe.slice(LIMITS.detail)}</mark>`
          : ""),
    };
  }, [value]);

  return <div className="mirror" aria-hidden dangerouslySetInnerHTML={html} />;
}

export default function CommuForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isEdit = state?.mode === "edit";
  const editingPost = state?.post || null;
  const user_id = Number(localStorage.getItem("user_id"));

  const [formData, setFormData] = useState({ title: "", detail: "", contact: "" });
  useEffect(() => {
    if (isEdit && editingPost)
      setFormData({
        title: editingPost.title || "",
        detail: editingPost.detail || "",
        contact: editingPost.contact || "",
      });
  }, [isEdit, editingPost]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const remainDetail = LIMITS.detail - formData.detail.length;
  const submitDisabled = remainDetail < 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user_id) return alert("กรุณาเข้าสู่ระบบก่อนโพสต์/แก้ไข");
    if (submitDisabled) return alert("ข้อความยาวเกินตัวอักษรที่กำหนด");

    try {
      if (isEdit && editingPost?.post_id) {
        await axios.put(`http://localhost:8000/commu/post/${editingPost.post_id}`, { ...formData, user_id });
        alert("แก้ไขโพสต์สำเร็จ!");
      } else {
        await axios.post("http://localhost:8000/commu/post", { ...formData, user_id });
        alert("โพสต์สำเร็จ!");
      }
      setTimeout(() => navigate("/userprofile"), 400);
    } catch (err) {
      console.error(err);
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
              value={formData.title}
              onChange={onChange}
              required
              maxLength={LIMITS.title}
            />
          </div>

          <div className="form field-rel">
            <label className="form-label">รายละเอียดโพสต์</label>
            <div className={`overlay-wrap ${submitDisabled ? "has-over" : ""}`}>
              <DetailOverlay value={formData.detail} />
              <textarea
                name="detail"
                className="form-input with-overlay"
                placeholder="เสื้อเจอร์ซีย์สำหรับคนคูล ๆ เย็นสบาย…"
                rows="3"
                value={formData.detail}
                onChange={onChange}
                required
              />
              <small className={`char-counter ${submitDisabled ? "danger" : remainDetail <= 20 ? "warn" : "ok"}`}>
                {remainDetail}
              </small>
            </div>
          </div>

          <div className="form">
            <label className="form-label">ช่องทางการติดต่อ</label>
            <input
              name="contact"
              className="form-input"
              type="url"
              placeholder="https://www.facebook.com/"
              value={formData.contact}
              onChange={onChange}
              required
              maxLength={LIMITS.contact}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="submit-btn" type="submit" disabled={submitDisabled}>
              {isEdit ? "UPDATE" : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}