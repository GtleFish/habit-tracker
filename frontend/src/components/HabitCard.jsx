export function HabitCard({ habit, logs, onDelete, onMarkComplete }) {
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
    onMarkComplete(habit.id, date);
  };

  const last7Days = getLast7Days();

  return (
    <div className="habit-card">
      <div className="habit-card-header">
        <div>
          <h3>{habit.name}</h3>
          {habit.description && <p className="habit-description">{habit.description}</p>}
        </div>
        <button className="btn-delete" onClick={() => onDelete(habit.id)}>
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
                title={date}
              >
                {getStatusIcon(status)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
