import { useState, useEffect } from 'react';
import '../styles/modal.css';

export function TimeInputModal({ isOpen, date, onSave, onCancel }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStartTime('');
      setEndTime('');
      setError('');
    }
  }, [isOpen]);

  const formatTo12Hour = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const min = m;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${hour12}:${min} ${ampm}`;
  };

  const handleSave = () => {
    if (!startTime && !endTime) {
      setError('');
      onSave(startTime, endTime);
      return;
    }

    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (endMinutes <= startMinutes) {
        setError('⚠️ Thời gian kết thúc phải sau thời gian bắt đầu!');
        return;
      }
    }

    if ((startTime && !endTime) || (!startTime && endTime)) {
      setError('⚠️ Vui lòng nhập cả thời gian bắt đầu và kết thúc');
      return;
    }

    setError('');
    onSave(startTime, endTime);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Đánh dấu hoàn thành - {date}</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <div className="time-inputs">
            <div className="time-group">
              <label htmlFor="startTime">Thời gian bắt đầu (tùy chọn)</label>
              <div className="time-input-wrapper">
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setError('');
                  }}
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
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setError('');
                  }}
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
          <button className="btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="btn-save" onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
