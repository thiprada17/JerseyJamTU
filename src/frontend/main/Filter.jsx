import { useState } from "react";
import "./Filter.css";
import checkIcon from "../../assets/checkIcon.png";  

export default function Filter({ onClose, onApply }) {
  const faculties = [
    "วิศวกรรมศาสตร์", "วิทยาศาสตร์", "แพทยศาสตร์", "พาณิชยศาสตร์",
    "นิติศาสตร์", "รัฐศาสตร์", "สถาปัตยกรรมศาสตร์", "ศิลปศาสตร์",
    "สังคมสงเคราะห์ศาสตร์", "สังคมวิทยาและมานุษยวิทยา", "วารสารศาสตร์",
    "เศรษฐศาสตร์", "ศึกษาศาสตร์", "ศิลปกรรมศาสตร์", "ทันตแพทยศาสตร์",
    "สหเวชศาสตร์", "พยาบาลศาสตร์", "เภสัชศาสตร์", "วิทยาศาสตร์และเทคโนโลยี",
    "แพทย์แผนไทย", "สิ่งแวดล้อม", "นวัตกรรม", "นานาชาติ", "สถาบันเทคโนโลยีนานาชาติ",
    "วิทยาลัยโลกคดีศึกษา", "วิทยาลัยสหวิทยาการ"
  ];

  const priceRanges = [
    "0 - 100 บาท",
    "100 - 200 บาท",
    "200 - 300 บาท",
    "300 - 400 บาท",
    "500 บาท ขึ้นไป"
  ];

  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const toggleFaculty = (faculty) => {
    setSelectedFaculties((prev) =>
      prev.includes(faculty)
        ? prev.filter((f) => f !== faculty)
        : [...prev, faculty]
    );
  };

  const handleClearAll = () => {
    setSelectedFaculties([]);
    setSelectedPrice(null);
  };

  const handleViewItems = () => {
    onApply({ faculties: selectedFaculties, price: selectedPrice });
    onClose();
  };

  return (
    <div className="filter-panel open">
      {/* คณะ */}
      <div className="filter-section">
        <h3 className="filter-title">คณะ</h3>
        <div className="faculty-grid">
          {faculties.map((faculty) => (
            <div
              key={faculty}
              onClick={() => toggleFaculty(faculty)}
              className={`faculty-item ${
                selectedFaculties.includes(faculty) ? "selected" : ""
              }`}
            >
              {faculty}
            </div>
          ))}
        </div>
      </div>

      {/* ราคา */}
      <div className="filter-section">
        <h3 className="filter-title">ราคา</h3>
        <div className="price-list">
          {priceRanges.map((range) => (
            <label
              key={range}
              className="price-item"
              onClick={() => setSelectedPrice(range)}
            >
              <div
                className={`price-box ${
                  selectedPrice === range ? "active" : ""
                }`}
              >
                {selectedPrice === range && (
                  <img src={checkIcon} alt="checked" className="check-icon" />
                )}
              </div>
              <span>{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ปุ่ม */}
      <div className="filter-buttons">
        <button onClick={handleClearAll} className="btn-clear">
          Clear all
        </button>
        <button onClick={handleViewItems} className="btn-view">
          View items
        </button>
      </div>
    </div>
  );
}