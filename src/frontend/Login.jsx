import { useState } from 'react';
import "./login.css";
import arrowIcon from "../assets/arrow.png";
import pinkshape from "../assets/pink-shape.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Notification from './component/Notification';

export default function Login({ scrollToHome, scrollToSignup }) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "error" });

  const [userData, setuserData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/create/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });


      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error("Server responded with status: " + response.status);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        console.log(data)

        if (data.success) {
          const user = data.user;


          localStorage.setItem("user_id", user.user_id);
          localStorage.setItem("username", user.username);
          localStorage.setItem("faculty", user.faculty);
          localStorage.setItem("year", user.year);
          localStorage.setItem("token", user.token);

          const authToken = localStorage.getItem('token')


          const authen = await fetch('http://localhost:8000/authen/users', {
        method: 'GET',
        headers: { 'authorization': `Bearer ${authToken}` }
      });

      const authenData = await authen.json();
console.log(authenData);

          //  setNotification({
          //   // message: "ล็อกอินสำเร็จ! ยินดีต้อนรับกลับมาค่ะ 🌸",
          //   // type: "success"
          // });
          

          // setTimeout(() => {
          //   navigate('/main', { state: { showLoginToast: true } });
          // }, 1200);
          localStorage.setItem("showLoginToast", "true");
sessionStorage.setItem("showLoginToast", "true");  // เก็บใน sessionStorage
navigate('/main');



        } else {
          console.log("Login failed:", data.message);
          setNotification({
  message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์\nกรุณาลองใหม่อีกครั้งค่ะ",
  type: "error"
});

        }
      } else {
        console.log("Unexpected server response");
        setNotification({
          message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์\nกรุณาลองใหม่อีกครั้งค่ะ",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setNotification({
  message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้\nกรุณาลองใหม่อีกครั้งค่ะ",
  type: "error"
});
    }
  };

          //       setTimeout(() => {
          //         navigate('/main', { state: { showLoginToast: true } });
          //       }, 1500);
          //     } else {
          //       alert(data.message || "Login failed.");
          //     }
          //   } else {
          //     const text = await response.text();
          //     alert("Login failed: Unexpected server response.");
          //   }
          // } catch (error) {
          //   alert('Login Fail: ' + error.message);
          //   }
          // };


  return (
    <div className="login-page">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ message: "", type: "error" })}
      />
      <div className="background-text">Login</div>

      <div className="signin-container">
        <img src={pinkshape} alt="Pink Shape" className="pink-shape" />

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
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

          <button type="submit" className="btn-login">Log in</button>

          <p className="signup-text" >
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