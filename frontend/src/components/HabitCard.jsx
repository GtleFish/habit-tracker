export function HabitCard({ habit, logs, onDelete, onMarkComplete }) {
  // Lấy 7 ngày gần nhất
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const isCompleted = (dateStr) => {
    return logs.some(
      (l) => l.completed_date?.split('T')[0] === dateStr && l.habit_id === habit.id
    );
  };

  const isFuture = (dateStr) => new Date(dateStr) > new Date();

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' });
  };

  const handleDayClick = (date) => {
    if (!isFuture(date)) {
      onMarkComplete(habit.id, date);
    }
  };

  const last7Days = getLast7Days();
  const completedCount = last7Days.filter((d) => isCompleted(d)).length;

  return (
    <div className="habit-card">
      <div className="habit-card-header">
        <div className="habit-info">
          <h3 className="habit-name">{habit.name}</h3>
          {habit.description && (
            <p className="habit-description">{habit.description}</p>
          )}
          <span className="habit-streak">
            ✅ {completedCount}/7 ngày tuần này
          </span>
        </div>
        <button
          className="btn-delete"
          onClick={() => onDelete(habit.id)}
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
          let statusClass = 'day-missed';
          if (completed) statusClass = 'day-completed';
          else if (future) statusClass = 'day-future';

          return (
            <button
              key={date}
              className={`day-btn ${statusClass}`}
              onClick={() => handleDayClick(date)}
              disabled={future}
              title={date}
              aria-label={`${date}: ${completed ? 'Đã hoàn thành' : future ? 'Chưa đến' : 'Chưa hoàn thành'}`}
            >
              <span className="day-label">{formatDay(date)}</span>
              <span className="day-icon">
                {completed ? '✓' : future ? '·' : '✕'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
