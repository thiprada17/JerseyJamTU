import "./commuForm.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Notification from "../../../component/Notification";
import greyArrow from "../../../../assets/grey_arrow.png";

const LIMITS = { title: 25, detail: 250, contact: 150 };
const WARN_AT = Math.max(10, Math.ceil(LIMITS.detail * 0.1));

export default function CommuForm() {
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const { state } = useLocation();
  const isEdit = state?.mode === "edit";
  const editingPost = state?.post || null;
  const user_id = Number(localStorage.getItem("user_id"));

  const [formData, setFormData] = useState({ title: "", detail: "", contact: "" });

  useEffect(() => {
    const verify = async () => {
      try {
        const authToken = localStorage.getItem('token');

        if (!authToken) {
          // window.alert('token not found');
          setNotification({
            message: "Token not found, กรุณาเข้าสู่ระบบใหม่",
            type: "error",
          });
          navigate('/');
          return
        }

        const authen = await fetch('http://localhost:8000/authen/users', {
          method: 'GET',
          headers: { authorization: `Bearer ${authToken}` }
        });

        if (!authen.ok) {
          console.error('authen fail', authen.status);
          // window.alert('authen fail');
          setNotification({
            message: "Authentication ล้มเหลว กรุณาเข้าสู่ระบบใหม่",
            type: "warning",
          });
          navigate('/');
          return
        }

        const authenData = await authen.json();
        console.log('auth ' + authenData.success);

        if (!authenData && !authenData.data && !authenData.data.success) {
          // window.alert('token not pass');
            setNotification({
            message: "Token หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง",
            type: "error",
          });
          localStorage.clear();
          navigate('/');
          return
        }

      } catch (error) {
        console.error('verify error:', error);
        // window.alert('verify error');
        setNotification({
          message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
          type: "error",
        });
        navigate('/');

      }
    };

    verify();
  }, [navigate]);


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
      const handleBack = () => {
        navigate(-1); // ย้อนกลับไปอันก่อน
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!user_id) return alert("กรุณาเข้าสู่ระบบก่อนโพสต์/แก้ไข");
    if (!user_id) {
      setNotification({
        message: "⚠️ กรุณาเข้าสู่ระบบก่อนโพสต์หรือแก้ไข",
        type: "warning",
      });
      return;
    }

    const t = (formData.title || "").trim();
    const d = (formData.detail || "").trim();
    const c = (formData.contact || "").trim();
    // if (!t || !d || !c) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    if (!t || !d || !c) {
      setNotification({
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        type: "warning",
      });
      return;
    }
    // if (LIMITS.detail - d.length < 0) return alert("รายละเอียดเกินลิมิต กรุณาลดจำนวนอักษร");
    if (LIMITS.detail - d.length < 0) {
      setNotification({
        message: "รายละเอียดเกินลิมิต กรุณาลดจำนวนอักษร",type: "error",});
      return;
    }

    try {
      if (isEdit && editingPost?.post_id) {
        await axios.put(`http://localhost:8000/commu/post/${editingPost.post_id}`, {
          title: t,
          detail: d,
          contact: c,
          user_id,
        });
        // alert("แก้ไขโพสต์สำเร็จ!");
        setNotification({
          message: "แก้ไขโพสต์สำเร็จ!",
          type: "success",
        });
      } else {
        await axios.post("http://localhost:8000/commu/post", {
          title: t,
          detail: d,
          contact: c,
          user_id,
        });
        // alert("โพสต์สำเร็จ!");
        setNotification({
          message: "โพสต์สำเร็จ!",
          type: "success",
        });
      }
      // setTimeout(() => navigate("/userprofile"), 400);
      setTimeout(() => { navigate("/commu", { state: { postSuccess: true } }); }, 1000);

    } catch (err) {
      console.error(err);
      // alert("ERROR!!\nโพสต์ไม่สำเร็จ");
      setNotification({
        message: "ERROR: โพสต์ไม่สำเร็จ\nกรุณาลองใหม่อีกครั้ง",
        type: "error",
      });
    }
  };

  useEffect(() => {
  if (notification.message) {
    const timer = setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 2000); 
    return () => clearTimeout(timer); // เคีย timer ถ้าcompoถูกปัดทิ้ง หรือ noti เปลี่ยน
  }
}, [notification.message]);

  return (
    <div className="form-body">
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

 
                <button className="commuForm-backButton" onClick={handleBack}>
                    &lt; back
                </button>
              
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

          <div className="form">
            <label className="form-label">รายละเอียดโพสต์</label>
            <textarea
              name="detail"
              className="form-input"
              placeholder="เสื้อเจอร์ซีย์สำหรับคนคูล ๆ เย็นสบาย…"
              rows={4}
              value={formData.detail}
              onChange={onChange}
              required
            />
            <small
              className={`jj-counter ${remainDetail < 0 ? "jj-danger" : remainDetail <= WARN_AT ? "jj-warn" : "jj-ok"
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