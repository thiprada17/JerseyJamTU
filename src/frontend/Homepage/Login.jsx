import { useState } from 'react';
import "./login.css";
import arrowIcon from "../../assets/arrow.png";
import pinkshape from "../../assets/pink-shape.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Notification from '../component/Notification';
import Toast from "../component/Toast";

export default function Login({ scrollToHome, scrollToSignup }) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "error" });
  const [showToast, setShowToast] = useState(false);
  const [userData, setuserData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserData(prev => ({ ...prev, [name]: value }));
  };

  const mapBackendMessageToThai = (status, rawMessage = "") => {
    const msg = String(rawMessage || "").toLowerCase();
    if (msg.includes("invalid password") || msg.includes("wrong password")) {
      return "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
    }
    if (msg.includes("user not found") || msg.includes("no user")) {
      return "ไม่พบบัญชีผู้ใช้ กรุณาสมัครสมาชิก";
    }
    if (status === 401 || status === 403) {
      return "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
    }
    if (status === 404) {
      return "ไม่พบบัญชีผู้ใช้ กรุณาสมัครสมาชิก";
    }
    return "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์\nกรุณาลองใหม่อีกครั้งค่ะ";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const local = userData.username.trim();
    const password = userData.password;
    const thaiRegex = /[\u0E00-\u0E7F]/;
    const localPattern = /^[a-zA-Z0-9._%+-]+$/;

    if (!local) {
    setNotification({ message: "กรุณากรอก Email", type: "error" });
    return;
    }
    if (local.includes("@")) {
      setNotification({ message: "กรุณากรอก Email โดยไม่ต้องใส่ @dome.tu.ac.th", type: "error" });
      return;
    }
    if (thaiRegex.test(local) || !localPattern.test(local)) {
      setNotification({ message: "กรุณากรอก Email ให้ถูกต้อง", type: "error" });
      return;
    }
    if (!password) {
      setNotification({ message: "กรุณากรอกรหัสผ่าน", type: "error" });
      return;
    }
    if (password.length < 8) {
      setNotification({ message: "กรุณากรอกรหัสผ่านให้ถูกต้อง", type: "error" });
      return;
    }

    const fullEmail = `${local}@dome.tu.ac.th`;

    try {
      const response = await fetch('https://jerseyjamtu.onrender.com/create/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fullEmail, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (_) { }
      }

      if (response.ok && data?.success) {
        const user = data.user || {};
        localStorage.setItem("user_id", user.user_id || "");
        localStorage.setItem("username", user.username || "");
        localStorage.setItem("faculty", user.faculty || "");
        localStorage.setItem("year", user.year || "");
        localStorage.setItem("token", user.token || "");

        setShowToast(true);
        setTimeout(() => {
          navigate('/main');
        }, 1500);
      } else {
        const message = mapBackendMessageToThai(response.status, data?.message);
        setNotification({ message, type: "error" });
      }
    } catch (error) {
      setNotification({
        message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้\nกรุณาลองใหม่อีกครั้งค่ะ",
        type: "error"
      });
    }
  };

  return (
    <div className="login-page">
      {showToast && (
        <Toast
          message="✅ Login Success!"
          duration={1500}
          onClose={() => setShowToast(false)}
        />
      )}
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ message: "", type: "error" })}
      />
      <div className="background-text">Login</div>

      <div className="signin-container">
        <img src={pinkshape} alt="Pink Shape" className="pink-shape" />

        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          <div className="inputs-wrapper">
            <div className="input-group">
              <label htmlFor="username">Email:</label>
              <div className="login-email-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
                <span className="login-email-domain">@dome.tu.ac.th</span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="submit-group">
            <button type="submit" className="btn-login">Log in</button>
          </div>

          <p className="signup-text">
            Don’t have an account? <span className="signup-link" onClick={scrollToSignup}>Sign Up</span>
          </p>
        </form>
      </div>

      <button className="login-back-btn" onClick={scrollToHome}>
        <img src={arrowIcon} alt="Back" className="signup-arrow-icon" />
      </button>
    </div>
  );
}