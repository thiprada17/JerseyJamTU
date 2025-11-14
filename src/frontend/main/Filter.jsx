import "./Filter.css";
import checkIcon from "../../assets/checkIcon.png";
import backIcon from "../../assets/filter_back.png";

export default function Filter({ onClose, onApply, onClear, value, onChange }) {
  const faculties = [
    "วิศวกรรมศาสตร์", "วิทยาศาสตร์", "แพทยศาสตร์", "พาณิชยศาสตร์",
    "นิติศาสตร์", "รัฐศาสตร์", "สถาปัตยกรรมศาสตร์", "ศิลปศาสตร์",
    "สังคมสงเคราะห์ศาสตร์", "สังคมวิทยาและมานุษยวิทยา", "วารสารศาสตร์",
    "เศรษฐศาสตร์", "ศึกษาศาสตร์", "ศิลปกรรมศาสตร์", "ทันตแพทยศาสตร์",
    "สหเวชศาสตร์", "พยาบาลศาสตร์", "เภสัชศาสตร์", "วิทยาศาสตร์และเทคโนโลยี",
    "แพทย์แผนไทย", "สิ่งแวดล้อม", "นวัตกรรม", "นานาชาติ", "สถาบันเทคโนโลยีนานาชาติ",
    "วิทยาลัยโลกคดีศึกษา", "วิทยาลัยสหวิทยาการ", "วิทยาลัยพัฒนาศาสตร์"
  ];

  const priceRanges = [
    "ต่ำกว่า 300 บาท",
    "300 - 400 บาท",
    "400 - 500 บาท",
    "500 - 600 บาท",
    "600 บาท ขึ้นไป"
  ];

  const selectedFaculties = value?.faculties || [];
  const selectedPrice = value?.price || "";

  const toggleFaculty = (faculty) => {
    const next = selectedFaculties.includes(faculty)
      ? selectedFaculties.filter((f) => f !== faculty)
      : [...selectedFaculties, faculty];
    onChange({ ...value, faculties: next });
  };

  const handleSelectPrice = (range) => {
    onChange({ ...value, price: range });
  };

  const handleClearAll = () => {
    onChange({ faculties: [], price: "" });
    if (onClear) onClear();
    onClose();
  };

  const handleViewItems = () => {
    onApply(value);
    onClose();
  };

  return (
    <div className="filter-panel open">
      <div className="filter-section">
        <h3 className="filter-title">คณะ</h3>
        <div className="faculty-grid">
          {faculties.map((faculty) => (
            <div
              key={faculty}
              onClick={() => toggleFaculty(faculty)}
              className={`faculty-item ${selectedFaculties.includes(faculty) ? "selected" : ""}`}
            >
              {faculty}
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">ราคา</h3>
        <div className="price-list">
          {priceRanges.map((range) => (
            <label
              key={range}
              className="price-item"
              onClick={() => handleSelectPrice(range)}
            >
              <div className={`price-box ${selectedPrice === range ? "active" : ""}`}>
                {selectedPrice === range && (
                  <img src={checkIcon} alt="checked" className="check-icon" />
                )}
              </div>
              <span>{range}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-buttons">
        <button onClick={handleClearAll} className="btn-clear">Clear all</button>
        <button onClick={handleViewItems} className="btn-view">View items</button>
      </div>
    </div>
  );
}