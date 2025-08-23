import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signup.css";
import img from "../assets/animal.png";
import profile from "../assets/profile-icon.png";
import mail from "../assets/mail-icon.png";
import fingerprint from "../assets/fingerprint-icon.png";

export default function SignIn() {
  const [userData, setuserData] = useState({
    username: '',
    email: '',
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
    console.log('ข้อมูลผู้ลงทะเบียน:', userData);

    try {
      const user_response = await axios.post('http://localhost:8000/add-user/register', userData)
      console.log("insert sucsess")

    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="container">
      <div className='header-signup'>
        <img src={img} alt="Logo" className="logo" />
        <h2 className='font-light'>SignUp</h2>
      </div>

      <form className='w-50%' onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">
            <img src={profile} alt="" className='icon-signup' />
            <i className="bi bi-person-circle"></i> Username
          </label>
          <input
            name="username"
            type="text"
            id="username"
            placeholder="Enter username"
            value={userData.username}
            onChange={handleChange} required/>
        </div>

        <div className="input-group">
          <label htmlFor="email">
            <img src={mail} alt="" className='icon-signup' />
            <i className="bi bi-envelope"></i> Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter email"
            value={userData.email}
            onChange={handleChange} required/>
        </div>

        <div className="input-group">
          <label htmlFor="password">
            <img src={fingerprint} alt="" className='icon-signup' />
            <i className="bi bi-fingerprint"></i> Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Enter password"
            value={userData.password}
            onChange={handleChange} required/>
        </div>

        <button type="submit" className="btn-signup">
          SIGNUP
        </button>
      </form>
    </div>
  );
}
