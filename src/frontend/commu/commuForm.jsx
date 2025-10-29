import "./commuForm.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LIMITS = { title: 25, detail: 250, contact: 150 };
const WARN_AT = Math.max(10, Math.ceil(LIMITS.detail * 0.1)); // เตือนเมื่อเหลือน้อยกว่า 10% หรืออย่างน้อย 10

export default function CommuForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isEdit = state?.mode === "edit";
  const editingPost = state?.post || null;
  const user_id = Number(localStorage.getItem("user_id"));

  const [formData, setFormData] = useState({ title: "", detail: "", contact: "" });

  useEffect(() => {
    if (isEdit && editingPost) {
      setFormData({
        title: editingPost.title || "",
        detail: editingPost.detail || "",
        contact: editingPost.contact || "",
      });
    }
  }, [isEdit, editingPost]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const remainDetail = LIMITS.detail - formData.detail.length;
  const submitDisabled = remainDetail < 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user_id) return alert("กรุณาเข้าสู่ระบบก่อนโพสต์/แก้ไข");

    // กันการกรอกช่องว่างล้วน + ตรวจลิมิต detail
    const t = (formData.title || "").trim();
    const d = (formData.detail || "").trim();
    const c = (formData.contact || "").trim();

    if (!t || !d || !c) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    if (LIMITS.detail - d.length < 0) return alert("ข้อความยาวเกินตัวอักษาที่กำหนด");

    try {
      if (isEdit && editingPost?.post_id) {
        await axios.put(`http://localhost:8000/commu/post/${editingPost.post_id}`, {
          title: t,
          detail: d,
          contact: c,
          user_id,
        });
        alert("แก้ไขโพสต์สำเร็จ!");
      } else {
        await axios.post("http://localhost:8000/commu/post", {
          title: t,
          detail: d,
          contact: c,
          user_id,
        });
        alert("โพสต์สำเร็จ!");
      }
      setTimeout(() => navigate("/userprofile"), 400);
    } catch (err) {
      console.error(err);
      alert("ERROR!!\nโพสต์ไม่สำเร็จ");
    }
  };

  // ทำ mirror เพื่อไฮไลต์ส่วนเกินของ detail
  const mirroredHTML = (() => {
    const esc = (s = "") =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safe = esc(formData.detail);
    const keep = safe.slice(0, LIMITS.detail);
    const over = safe.slice(LIMITS.detail);
    return over ? `${keep}<mark class="jj-over">${over}</mark>` : keep;
  })();

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
              maxLength={LIMITS.title}   // จำกัดตัวอักษรเฉพาะหัวข้อ
            />
          </div>

          <div className="form">
            <label className="form-label">รายละเอียดโพสต์</label>
            <div className="jj-overflow" style={{ "--jj-pad": "12px" }}>
              <div
                className="jj-mirror"
                aria-hidden
                dangerouslySetInnerHTML={{ __html: mirroredHTML }}
              />
              <textarea
                name="detail"
                className="form-input jj-textarea"
                placeholder="เสื้อเจอร์ซีย์สำหรับคนคูล ๆ เย็นสบาย…"
                rows={4}
                value={formData.detail}
                onChange={onChange}
                required
                // ไม่มี maxLength จะให้ไฮไลต์น่ะ
              />
            </div>
            <small
              className={`jj-counter ${
                remainDetail < 0 ? "jj-danger" : remainDetail <= WARN_AT ? "jj-warn" : "jj-ok"
              }`}
            >
              {remainDetail}
            </small>
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
              maxLength={LIMITS.contact}  // จำกัดตัวอักษรเฉพาะช่องทางการติดต่อ
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