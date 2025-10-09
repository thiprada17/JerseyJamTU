import { useState } from 'react';
import "./login.css";
import arrowIcon from "../assets/arrow.png";
import pinkshape from "../assets/pink-shape.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Login({ scrollToHome, scrollToSignup }) {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/create/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        console.log(data)

        if (data.success) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              user_id: data.user.user_id,
              username: data.user.username,
            })
          );

          setTimeout(() => {
            navigate('/main', { state: { showLoginToast: true } });
          }, 1500);
        } else {
          alert(data.message || "Login failed.");
        }
      } else {
        alert("Login failed: Unexpected server response.");
      }
    } catch (error) {
      alert('Login Fail: ' + error.message);
    }
  };

  return (
    <div className="login-page">
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
              required
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

          <button type="submit" className="btn-login">Log in</button>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span className="signup-link" onClick={scrollToSignup}>Sign Up</span>
          </p>
        </form>
      </div>

      <button className="login-back-btn" onClick={scrollToHome}>
        <img src={arrowIcon} alt="Back" className="signup-arrow-icon" />
      </button>
    </div>
  );
}
