import { useState } from 'react';
import { TimeInputModal } from './TimeInputModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { formatTimeRange } from '../utils/timeConverter';

export function HabitCard({ habit, logs, onDelete, onMarkComplete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const getStatusForDate = (dateStr) => {
    const log = logs.find(l => l.date === dateStr && l.habit_id === habit.id);
    if (log) return 'completed';
    if (new Date(dateStr) > new Date()) return 'future';
    return 'missed';
  };

  const getLogForDate = (dateStr) => {
    return logs.find(l => l.date === dateStr && l.habit_id === habit.id);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'missed':
        return '✕';
      default:
        return '⊘';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'day-completed';
      case 'missed':
        return 'day-missed';
      default:
        return 'day-future';
    }
  };

  const handleDayClick = (date) => {
    const status = getStatusForDate(date);
    if (status === 'future') return;
    setSelectedDate(date);
    setSelectedLog(getLogForDate(date));
    setModalOpen(true);
  };

  const handleModalSave = (startTime, endTime) => {
    onMarkComplete(habit.id, selectedDate, startTime, endTime, selectedLog?.id);
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedLog(null);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedLog(null);
  };

  const handleLogDelete = (logId) => {
    onMarkComplete(null, null, null, null, logId, true);
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedLog(null);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    onDelete(habit.id);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  const getTooltip = (date) => {
    const log = getLogForDate(date);
    if (!log) return date;
    return formatTimeRange(log.start_time, log.end_time);
  };

  const last7Days = getLast7Days();

  return (
    <div className="habit-card">
      <div className="habit-card-header">
        <div>
          <h3>{habit.name}</h3>
          {habit.description && <p className="habit-description">{habit.description}</p>}
        </div>
        <button className="btn-delete" onClick={handleDeleteClick}>
          ✕
        </button>
      </div>

      <div className="habit-tracker">
        {last7Days.map((date, idx) => {
          const dayNum = idx + 1;
          const status = getStatusForDate(date);
          return (
            <div key={date} className="day-column">
              <div className="day-label">Day {dayNum}</div>
              <button
                className={`day-status ${getStatusClass(status)}`}
                onClick={() => handleDayClick(date)}
                title={getTooltip(date)}
                disabled={status === 'future'}
              >
                {getStatusIcon(status)}
              </button>
            </div>
          );
        })}
      </div>

      <TimeInputModal
        isOpen={modalOpen}
        date={selectedDate}
        log={selectedLog}
        onSave={handleModalSave}
        onCancel={handleModalCancel}
        onDelete={handleLogDelete}
      />
      <DeleteConfirmModal
        habitName={habit.name}
        isOpen={deleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
