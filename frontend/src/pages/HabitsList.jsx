import { HabitCard } from '../components/HabitCard';

export function HabitsList({ habits, logs, onDelete, onMarkComplete, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Habits</h2>
        <span className="habit-count">{habits.length} habits</span>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Chưa có habit nào</h3>
          <p>Tạo habit đầu tiên để bắt đầu theo dõi!</p>
        </div>
      ) : (
        <div className="habits-grid">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={logs}
              onDelete={onDelete}
              onMarkComplete={onMarkComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
