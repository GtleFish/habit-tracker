import { HabitCard } from '../components/HabitCard';

export function HabitsList({ habits, logs, onDelete, onMarkComplete, onDeleteLog, isLoading, error }) {
  // Tính stats
  const today = new Date().toISOString().split('T')[0];
  const completedToday = logs.filter(l => l.completed_date?.split('T')[0] === today).length;
  const totalLogs = logs.length;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLogs = logs.filter(l => new Date(l.completed_date) >= weekAgo).length;

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

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Tổng Habits</span>
          <span className="stat-value">{habits.length}</span>
          <span className="stat-sub">đang theo dõi</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Hôm Nay</span>
          <span className="stat-value">{completedToday}</span>
          <span className="stat-sub">hoàn thành</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tuần Này</span>
          <span className="stat-value">{weekLogs}</span>
          <span className="stat-sub">lần hoàn thành</span>
        </div>
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
              onDeleteLog={onDeleteLog}
            />
          ))}
        </div>
      )}
    </div>
  );
}
