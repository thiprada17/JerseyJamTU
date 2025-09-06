import "./commuForm.css";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function CommuForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    contact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ข้อมูลโพสต์: ", formData);

    const commu_response = await axios.post('http://localhost:8000/commu/post', formData)

    console.log('Response from server:', commu_response.data);


    alert("โพสต์สำเร็จ!");

    setTimeout(() => {
      navigate('/commu');
    }, 1000);
  };

  return (
    <div className="form-body">
      <div className="form-box">
        <h2 className="form-header">Create Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <label className="form-label">หัวข้อโพสต์</label>
            <input
              name="title"
              className="form-input"
              type="text"
              placeholder="Rockstar Jersey, TU Jersey…"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form">
            <label className="form-label">รายละเอียดโพสต์</label>
            <textarea
              name="detail"
              className="form-input"
              placeholder="เสื้อเจอร์ซีย์สำหรับคนคูล ๆ เย็นสบาย…"
              rows="3"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form">
            <label className="form-label">ช่องทางการติดต่อ</label>
            <input
              name="contact"
              className="form-input"
              type="url"
              placeholder="https://www.facebook.com/"
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="submit-btn" type="submit">SUBMIT</button>
          </div>
        </form>
      </div>
    </div>
  );
}
