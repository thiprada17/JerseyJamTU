import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signup.css";
import arrowIcon from "../../assets/arrow.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from '../component/Toast';
import Notification from '../component/Notification';

export default function SignUp({ scrollToHome, scrollToLogIn }) {
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
    let value2 = value;

    if (name === "year") {
      if (value.startsWith("ปี ")) {
        value2 = value.replace("ปี ", "");
      }
    }

    setuserData(prevState => ({
      ...prevState,
      [name]: value2
    }));
  };

  const FACULTIES = [
    "วิศวกรรมศาสตร์(TSE)", "นิติศาสตร์(LAW)", "พาณิชยศาสตร์และการบัญชี(BBA)",
    "สังคมสงเคราะห์ศาสตร์(BSW)", "รัฐศาสตร์(POLSCI)", "เศรษฐศาสตร์(ECON)",
    "สังคมวิทยาและมานุษยวิทยา(SOC-ANT)", "ศิลปศาสตร์(LArts)", "วารสารศาสตร์และสื่อสารมวลชน(JC)",
    "วิทยาศาสตร์และเทคโนโลยี(SCI)", "สถาปัตยกรรมศาสตร์(TDS)", "ศิลปกรรมศาสตร์(FA)",
    "แพทยศาสตร์(MED)", "สหเวชศาสตร์(AHS)", "ทันตแพทยศาสตร์(DENT)", "พยาบาลศาสตร์(NS)",
    "สาธารณสุขศาสตร์(FPH)", "เภสัชศาสตร์(Pharmacy)", "วิทยาการเรียนรู้และศึกษาศาสตร์(LSEd)",
    "วิทยาลัยนวัตกรรม(CITU)", "วิทยาลัยสหวิทยาการ(CIS)",
    "วิทยาลัยโลกคดีศึกษา(SGS)", "สถาบันเทคโนโลยีนานาชาติสิรินธร(SIIT)",
    "วิทยาลัยนานาชาติ ปรีดี พนมยงค์(PBIC)"
  ];
  
  const YEARS = ["1", "2", "3", "4", "5", "6", "7", "8", "บุคลากร"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@dome\.tu\.ac\.th$/;
    const thaiRegex = /[\u0E00-\u0E7F]/;
    const usernamePattern = /^[A-Za-z0-9\u0E00-\u0E7F]+$/;

    const username = (userData.username || "").trim();
    const email = (userData.email || "").trim();
    const faculty = (userData.faculty || "").trim();
    const year = (userData.year || "").trim();
    const password = userData.password || "";

    if (!username) {
      setNotification({ message: "กรุณากรอก Username", type: "error" });
      return;
    }

    if (!usernamePattern.test(username)) {
      setNotification({
        message: "กรุณากรอก username ให้ถูกต้อง\n(ภาษาไทย ภาษาอังกฤษ หรือตัวเลขเท่านั้น)",
        type: "error",
      });
      return;
    }

    if (!email) {
      setNotification({ message: "กรุณากรอก email", type: "error" });
      return;
    }

    if (!emailPattern.test(email)) {
      setNotification({
        message: "กรุณากรอกอีเมลที่ลงท้ายด้วย @dome.tu.ac.th เท่านั้น",
        type: "error",
      });
      return;
    }

    if (!faculty) {
      setNotification({ message: "กรุณาเลือก Faculty", type: "error" });
      return;
    }

    if (faculty && !FACULTIES.includes(faculty)) {
      setNotification({
        message: "กรุณาเลือกคณะจากรายการที่กำหนด",
        type: "error",
      });
      return;
    }

    if (!year) {
      setNotification({ message: "กรุณาเลือก Year", type: "error" });
      return;
    }

    const YEAR_OPTIONS = ["1","2","3","4","5","6","7","8","อาจารย์","บุคลากร"];
    if (year && !YEAR_OPTIONS.includes(year)) {
      setNotification({
        message: "กรุณาเลือกชั้นปี/สถานะจากรายการที่กำหนด",
        type: "error",
      });
      return;
    }

    if (!password) {
      setNotification({ message: "กรุณากรอกรหัสผ่าน", type: "error" });
      return;
    }

    if (password.length < 8) {
      setNotification({
        message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        type: "error",
      });
      return;
    }

    if (thaiRegex.test(password)) {
      setNotification({
        message: "รหัสผ่านห้ามมีอักษรภาษาไทย",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/add-user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, username, email, faculty, year }),
      });
      const result = await response.json();

      if (response.ok) {
        setShowToast(true);
        setuserData({ username: '', email: '', password: '', faculty: '', year: '' });

        setTimeout(() => {
          scrollToHome();
        }, 1000);
      } else {
        setNotification({
          message: result.error || "Registration failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
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
    <div className="signup-page">
      <div className="signup-header">
        <button className="signup-back-btn" onClick={scrollToHome}>
          <img src={arrowIcon} alt="Back" className="signup-arrow-icon" />
        </button>
      </div>

      <form className="signup-form-wrapper" onSubmit={handleSubmit} noValidate>
        <div className="signup-form-row row-username row-email">
          <div className="input-group">
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
              placeholder="Enter email (@dome.tu.ac.th)"
              required
            />
          </div>
        </div>

        <div className="signup-form-row row-faculty row-year">
          <div className="input-group">
            <label>Faculty:</label>
            <input
              type="text"
              name="faculty"
              value={userData.faculty}
              onChange={handleChange}
              placeholder="Select faculty"
              required
              list="faculty-options"
            />
            <datalist id="faculty-options">
              {FACULTIES.map(f => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          <div className="input-group">
            <label>Year:</label>
            <input
              type="text"
              name="year"
              value={userData.year}     
              onChange={handleChange}
              placeholder="Select year/status"
              required
              list="year-options"
              readOnly
              onFocus={(e) => e.target.removeAttribute('readonly')}
              onBlur={(e) => e.target.setAttribute('readonly', true)}
            />
            <datalist id="year-options">
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option value="4" />
              <option value="5" />
              <option value="6" />
              <option value="7" />
              <option value="8" />
              <option value="อาจารย์" />
              <option value="บุคลากร" />
            </datalist>
          </div>
        </div>

        <div className="signup-form-row last-row row-password-actions">
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
              Already have an account?{" "}
              <span className="signup-link" onClick={scrollToLogIn}>Log in</span>
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