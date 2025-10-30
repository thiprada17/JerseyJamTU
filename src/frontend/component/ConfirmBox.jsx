import "./confirmBox.css";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3 className="confirm-title">ยืนยันการทำรายการ</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn confirm-yes" onClick={onConfirm}>
            ยืนยัน
          </button>
          <button className="confirm-btn confirm-no" onClick={onCancel}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
