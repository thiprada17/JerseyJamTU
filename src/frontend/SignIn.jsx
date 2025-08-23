import { useState } from 'react';
import { Link } from 'react-router-dom';
import img from "../assets/animal.png";
import profile from "../assets/profile-icon.png";
import fingerprint from "../assets/fingerprint-icon.png";

import "./signin.css";

export default function LogIn() {
    const [userData, setuserData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setuserData(prevState => ({
      ...prevState,
      [name]: value
    }));

    console.log({ name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ข้อมูลผู้เข้าใช้:', userData);

    try {
      const user_response = await axios.post('http://localhost:8000/create/login', userData)
      console.log("login sucsess")
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

      <form className='w-50%' onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">
            <img src={profile} alt="" className='icon-login' />
            <i className="bi bi-person-circle"></i> Username
          </label>
          <input
            name="username"
            type="text"
            id="username"
            placeholder="Enter username"
            value={userData.username}
            onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label htmlFor="password">
            <img src={fingerprint} alt="" className='icon-login' />
            <i className="bi bi-fingerprint"></i> Password
          </label>
          <input
            name="password"
            type="password" 
            id="password"
            placeholder="Enter password"
            value={userData.password}
            onChange={handleChange} required />
        </div>

        <div className="btn-wrapper">
          <button type="submit" className="btn-login">
            LOGIN
          </button>
          <Link to="/signup" className="signup">Signup</Link>
        </div>
      </form>
    </div>

  );
}