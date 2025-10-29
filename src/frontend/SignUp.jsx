import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signup.css";
import arrowIcon from "../assets/arrow.png";
import BackgroundSignup from "../assets/background-signup.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from './component/Toast';
import Notification from './component/Notification';

export default function SignUp({ scrollToHome,scrollToLogIn }) {
  const nevigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setuserData] = useState({
    username: '',
    email: '',
    password: '',
    faculty: '',
    year: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setuserData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // console.log({ name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ข้อมูลผู้ลงทะเบียน:', userData);

    try {
      const response = await fetch('http://localhost:8000/add-user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
          const result = await response.json();


      if (response.ok) {
        console.log("Insert success");
        setShowToast(true);
        setuserData({ username: '', email: '', password: '', faculty: '', year: '' });

        setTimeout(() => {
          scrollToHome();
        }, 1000);

        setTimeout(() => {
          setShowToast(false);
        }, 2500);
      } else {
        console.error('Failed to register user');
        setNotification({
        message: result.error || "Registration failed. Please try again.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error sending data:", error);
    setNotification({
      message: "Error to connect to the server. Please try again later.",
      type: "error",
    });
  }
};
  const [notification, setNotification] = useState({
  message: "",
  type: "error", 
});


  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${BackgroundSignup})` }}
    >
      <div className="signup-header">
        <button className="signup-back-btn" onClick={scrollToHome}>
          <img src={arrowIcon} alt="Back" className="signup-arrow-icon" />
        </button>
      </div>

      <form className="signup-form-wrapper" onSubmit={handleSubmit}>
        <div className="signup-form-row ">
          <div className="input-group" >
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
        </div>

        <div className="signup-form-row">
          <div className="input-group">
            <label>Faculty:</label>
            <input
              type="text"
              name="faculty"
              value={userData.faculty}
              onChange={handleChange}
              placeholder="Enter faculty"
              required
            />
          </div>
          <div className="input-group">
            <label>Year:</label>
            <input
              type="number"
              name="year"
              value={userData.year}
              onChange={handleChange}
              placeholder="Enter year"
              required
            />
          </div>
        </div>

        <div className="signup-form-row last-row">
          <div className="input-group password-group">
            <label>Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
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

          <div className="signup-actions">
            <button type="submit" className="btn-login">Sign up</button>
            <p className="signup-text">
              Already have an account? <span className="signup-link" onClick={scrollToLogIn}>Log in</span>
            </p>
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </div>
        </div>
      </form>
      {showToast && (
        <Toast
          message="🎉 Sign up success!"
          duration={2500}
          onClose={() => setShowToast(false)}
        />
      )}

      {notification.message && (
  <Notification
    type={notification.type}
    message={notification.message}
    onClose={() => setNotification({ message: "", type: "error" })}
  />
)}

    </div>
  );
}
