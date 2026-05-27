import { useState, useEffect } from 'react';
import '../styles/modal.css';

export function TimeInputModal({ isOpen, date, habitName, existingLog, onSave, onDelete, onCancel }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  // Điền sẵn giờ nếu đang edit log cũ
  useEffect(() => {
    if (isOpen) {
      if (existingLog) {
        setStartTime(existingLog.start_time ? existingLog.start_time.slice(0, 5) : '');
        setEndTime(existingLog.end_time ? existingLog.end_time.slice(0, 5) : '');
      } else {
        setStartTime('');
        setEndTime('');
      }
      setError('');
    }
  }, [isOpen, existingLog]);

  const formatTo12Hour = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${hour12}:${m} ${ampm}`;
  };

  const handleSave = () => {
    if (!startTime && !endTime) {
      onSave(startTime, endTime);
      return;
    }
    if ((startTime && !endTime) || (!startTime && endTime)) {
      setError('⚠️ Vui lòng nhập cả thời gian bắt đầu và kết thúc');
      return;
    }
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    if (endH * 60 + endM <= startH * 60 + startM) {
      setError('⚠️ Thời gian kết thúc phải sau thời gian bắt đầu!');
      return;
    }
    setError('');
    onSave(startTime, endTime);
  };

  if (!isOpen) return null;

  const formatDateVN = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
  };

  const isEditing = !!existingLog;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>✅ {habitName} — {formatDateVN(date)}</h3>
          <button className="modal-close" onClick={onCancel} aria-label="Đóng">✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          {isEditing && (
            <div className="modal-edit-badge">✏️ Đang chỉnh sửa</div>
          )}

          <div className="time-inputs">
            <div className="time-group">
              <label htmlFor="startTime">Thời gian bắt đầu (tùy chọn)</label>
              <div className="time-input-wrapper">
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setError(''); }}
                />
                {startTime && <span className="time-display">{formatTo12Hour(startTime)}</span>}
              </div>
            </div>

            <div className="time-group">
              <label htmlFor="endTime">Thời gian kết thúc (tùy chọn)</label>
              <div className="time-input-wrapper">
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => { setEndTime(e.target.value); setError(''); }}
                />
                {endTime && <span className="time-display">{formatTo12Hour(endTime)}</span>}
              </div>
            </div>
          </div>

          <div className="time-hint">
            💡 Để trống cả hai nếu không muốn ghi giờ
          </div>
        </div>

        <div className="modal-footer">
          {isEditing && (
            <button className="btn-delete-log" onClick={onDelete} title="Xóa ngày này">
              🗑️ Xóa
            </button>
          )}
          <div className="modal-footer-right">
            <button className="btn-cancel" onClick={onCancel}>Hủy</button>
            <button className="btn-save" onClick={handleSave}>
              {isEditing ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
