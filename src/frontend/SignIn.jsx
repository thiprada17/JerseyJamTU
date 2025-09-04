import { useState } from 'react';

import img from "../assets/animal.png";
import profile from "../assets/profile-icon.png";
import fingerprint from "../assets/fingerprint-icon.png";
import "./signin.css";
import arrowIcon from "../assets/arrow.png";


export default function Login({ scrollToHome, scrollToSignup }) {
  const [userData, setuserData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ข้อมูลผู้เข้าใช้:', userData);

    try {
      const user_response = await axios.post('http://localhost:8000/create/login', userData);
      console.log("login success");
      alert('Login Success.');
      localStorage.setItem('username', user_response.data.user.username);
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Login Fail.');
    }
  };

  return (
    <div className="container">
      <div className='header-login'>
        <img src={img} alt="Logo" className="logo-login" />
        <h2 className='font-light'>LOGIN</h2>
      </div>

      <form style={{ width: "50%", margin: "0 auto" }} onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">
            <img src={profile} alt="" className='icon-login' />
            Username
          </label>
          <input
            name="username"
            type="text"
            id="username"
            placeholder="Enter username"
            value={userData.username}
            onChange={handleChange}
            required />
        </div>

        <div className="input-group">
          <label htmlFor="password">
            <img src={fingerprint} alt="" className='icon-login' />
            Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Enter password"
            value={userData.password}
            onChange={handleChange}
            required />
        </div>

        <div className="btn-wrapper">
          <button type="submit" className="btn-login">LOGIN</button>
          <span className="signup" onClick={scrollToSignup}>Signup</span>
        </div>
      </form>

      <button className="back-to-home-btn left" onClick={scrollToHome}>
  <img src={arrowIcon} alt="Back" className="arrow-icon" />
</button>


    </div>
  );
}
