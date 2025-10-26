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

          setTimeout(() => {
            navigate('/main', { state: { showLoginToast: true } });
          }, 1500);
        } else {
          alert(data.message || "Login failed.");
        }
      } else {
        const text = await response.text();
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

          <p className="signup-text">
            Don’t have an account? <span className="signup-link">Sign Up</span>
          </p>
        </form>
      </div>

      <button className="login-back-btn" onClick={scrollToHome}>
        <img src={arrowIcon} alt="Back" className="signup-arrow-icon" />
      </button>
    </div>
  );
}