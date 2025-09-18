import { useState } from 'react';
import axios from 'axios';
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
    console.log('ข้อมูลผู้เข้าใช้:', userData);

    try {
      fetch('http://localhost:8000/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      console.log("login success");
      alert('Login Success.');

      navigate('/main');
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Login Fail.');
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
