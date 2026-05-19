import { HabitCard } from '../components/HabitCard';

export function HabitsList({ habits, logs, onDelete, onMarkComplete, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="page">
      {error && <div className="error-message">{error}</div>}

      {habits.length === 0 ? (
        <div className="empty-state">
          <p>No habits yet. Create your first habit to get started!</p>
        </div>
      ) : (
        <div className="habits-grid">
          {habits.map(habit => (
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
