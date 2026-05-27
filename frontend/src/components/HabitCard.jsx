import { useState } from 'react';
import { TimeInputModal } from './TimeInputModal';
import { ConfirmModal } from './ConfirmModal';

export function HabitCard({ habit, logs, onDelete, onMarkComplete, onDeleteLog }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [existingLog, setExistingLog] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const getLog = (dateStr) => {
    return logs.find(
      (l) => l.completed_date?.split('T')[0] === dateStr && l.habit_id === habit.id
    ) || null;
  };

  const isCompleted = (dateStr) => !!getLog(dateStr);

  const isFuture = (dateStr) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return new Date(dateStr + 'T00:00:00') > today;
  };

  const formatDay = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return {
      day: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      num: date.getDate(),
    };
  };

  const handleDayClick = (date) => {
    if (isFuture(date)) return;
    const log = getLog(date);
    setSelectedDate(date);
    setExistingLog(log); // null = tạo mới, object = edit
    setModalOpen(true);
  };

  const handleModalSave = (startTime, endTime) => {
    setModalOpen(false);
    onMarkComplete(habit.id, selectedDate, startTime, endTime);
    setSelectedDate(null);
    setExistingLog(null);
  };

  const handleModalDelete = () => {
    setModalOpen(false);
    onDeleteLog(habit.id, selectedDate);
    setSelectedDate(null);
    setExistingLog(null);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setExistingLog(null);
  };

  const getLogTime = (dateStr) => {
    const log = getLog(dateStr);
    if (!log?.start_time || !log?.end_time) return null;
    return `${log.start_time.slice(0, 5)}–${log.end_time.slice(0, 5)}`;
  };

  const last7Days = getLast7Days();
  const completedCount = last7Days.filter((d) => isCompleted(d)).length;
  const percentage = Math.round((completedCount / 7) * 100);

  return (
    <>
      <div className="habit-card">
        <div className="habit-card-header">
          <div className="habit-info">
            <h3 className="habit-name">{habit.name}</h3>
            {habit.description && (
              <p className="habit-description">{habit.description}</p>
            )}
            <span className="habit-streak">
              ✅ {completedCount}/7 ngày — {percentage}% tuần này
            </span>
          </div>
          <button
            className="btn-delete"
            onClick={() => setConfirmOpen(true)}
            title="Xóa habit"
            aria-label={`Xóa habit ${habit.name}`}
          >
            🗑️
          </button>
        </div>

        <div className="habit-days">
          {last7Days.map((date) => {
            const completed = isCompleted(date);
            const future = isFuture(date);
            const logTime = getLogTime(date);

            let statusClass = 'day-missed';
            if (completed) statusClass = 'day-completed';
            else if (future) statusClass = 'day-future';

            const { day, num } = formatDay(date);

            return (
              <button
                key={date}
                className={`day-btn ${statusClass}`}
                onClick={() => handleDayClick(date)}
                disabled={future}
                title={logTime ? `${date} · ${logTime}` : date}
                aria-label={`${date}: ${completed ? 'Đã hoàn thành - bấm để chỉnh sửa' : future ? 'Chưa đến' : 'Chưa hoàn thành'}`}
              >
                <span className="day-label">{day}</span>
                <span className="day-num">{num}</span>
                <span className="day-icon">
                  {completed ? '✓' : future ? '·' : '○'}
                </span>
                {logTime && (
                  <span className="day-time">{logTime}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <TimeInputModal
        isOpen={modalOpen}
        date={selectedDate}
        habitName={habit.name}
        existingLog={existingLog}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        onCancel={handleModalCancel}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="🗑️ Xóa Habit"
        message={`Bạn có chắc muốn xóa habit "${habit.name}" không? Tất cả lịch sử sẽ bị xóa và không thể khôi phục.`}
        confirmLabel="Xóa"
        onConfirm={() => { setConfirmOpen(false); onDelete(habit.id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
