import React, { useState } from "react";
import "./sellerform.css";
// import greenLayer from "../assets/green.png";
// import creamLayer from "../assets/cream.png";
import blueLayer from "../assets/bg.png"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "./supabaseClient";
import greyArrow from "../assets/grey_arrow.png"

export default function SellerForm() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    shirt_name: "",
    shirt_price: "",
    shirt_open_date: "",
    shirt_close_date: "",
    shirt_detail: "",
    shirt_url: "",
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // ใช้ URL preview
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `shirt/${fileName}`;

    console.log("File selected:", file);

    //อัปโหลดรูปไป Supabase Bucket
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("shirt_images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      toast.error("Upload failed: " + uploadError.message);
      return;
    }

    //ดึง URL ของรูป
    const { data: publicData } = supabase
      .storage
      .from("shirt_images")
      .getPublicUrl(filePath);

    //ใส่ URL ของรูปใน Image
    if (publicData?.publicUrl) {
      setImage(publicData.publicUrl);
      console.log("Image uploaded & public URL:", publicData.publicUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      shirt_pic: image || "", // คุณอาจใส่ URL ภาพ (หลังอัปโหลดจริง)
    };

    try {
      const response = await fetch("http://localhost:8000/shirt/info/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Sent laew!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          pauseOnFocusLoss: false,
        });
        console.log("Server response:", result);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error("Warning Mistakes: " + result.error);
      }
    } catch (err) {
      toast.error("Connection Error");
      console.error(err);
    }
  };

  return (
    <>

      <div className="sellerform-app">
        <div className="sellerform-layers">
          {/* <img src={greenLayer} alt="green" className="sellerform-layer green" />
  <img src={creamLayer} alt="cream" className="sellerform-layer cream" /> */}
          <img src={blueLayer} alt="blue" className="sellerform-layer blue" />
        </div>
        <h1 className="sellerform-title">Add Your Jersey</h1>

        <div className="sellerform-container">
          {/* ---------- ซ้ายมือ: โพลารอยด์ + Upload ---------- */}
          <div className="sellerform-left">
            <div className="sellerform-polaroid">
              {image ? (
                <img src={image} alt="Uploaded Jersey" />
              ) : (
                <div className="sellerform-placeholder"></div>
              )}
            </div>
            <label className="sellerform-uploadBtn">
              Upload
              <input type="file" accept="image/*" onChange={handleUpload} hidden />
            </label>
          </div>

          {/* ---------- ขวามือ: ฟอร์ม ---------- */}
          <form className="sellerform-form" onSubmit={handleSubmit}>
            <label className="sellerform-row">
              <span className="sellerform-label">ชื่อเสื้อ</span>
              <input
                name="shirt_name"
                type="text"
                value={formData.shirt_name}
                onChange={handleChange}
                className="sellerform-input"
                placeholder="Rockstar Jersey, TU Jersey..."
              />
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">ราคาเสื้อ</span>
              <input
                name="shirt_price"
                value={formData.shirt_price}
                onChange={handleChange}
                type="number"
                className="sellerform-input"
                placeholder="350"
              />
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">วันเปิดขาย</span>
              <input
                type="date"
                name="shirt_open_date"
                value={formData.shirt_open_date}
                onChange={handleChange}
                className="sellerform-input"
              />
            </label>

            <label className="sellerform-row">
              <span className="sellerform-label">วันปิดขาย</span>
              <input
                type="date"
                name="shirt_close_date"
                value={formData.shirt_close_date}
                onChange={handleChange}
                className="sellerform-input"
              />
            </label>

            <div className="sellerform-block">
              <span className="sellerform-labelTop">รายละเอียดเสื้อ</span>
              <textarea
                name="shirt_detail"
                value={formData.shirt_detail}
                onChange={handleChange}
                className="sellerform-input"
                placeholder={`ราคาเสื้อตัวละ xxx บาท
ไซส์เสื้อบวกเพิ่ม`}
                required
              ></textarea>
            </div>

            <div className="sellerform-block">
              <span className="sellerform-labelTop">ลิงก์ฟอร์มซื้อเสื้อ</span>
              <input
                name="shirt_url"
                value={formData.shirt_url}
                onChange={handleChange}
                type="url"
                className="sellerform-input sellerform-inputLink"
                placeholder="https://example.com/order-form"
                required
              />

              <div className="sellerform-submitWrapper">
                <button type="submit" className="sellerform-submitBtn">
                  Submit
                </button>
              </div>
            </div>
          </form>
          <ToastContainer />
        </div>
        <img
          src={greyArrow}
          alt="back button"
          className="sellerform-floatingButton"
          onClick={() => navigate('/')}
        />
      </div>
    </>
  );
}
