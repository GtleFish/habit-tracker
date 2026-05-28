export function History({ habits, logs, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải lịch sử...</p>
        </div>
      </div>
    );
  }

  // Nhóm logs theo ngày
  const logsByDate = logs.reduce((acc, log) => {
    const date = log.completed_date?.split('T')[0] || log.completed_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(logsByDate).sort((a, b) => new Date(b) - new Date(a));
  const habitNamesById = new Map((habits || []).map((habit) => [habit.id, habit.name]));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Lịch Sử Thực Hiện</h2>
        <span className="habit-count">{logs.length} lần hoàn thành</span>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
           {error}
        </div>
      )}

      {logs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>Chưa có lịch sử</h3>
          <p>Bắt đầu đánh dấu hoàn thành habit để xem lịch sử tại đây!</p>
        </div>
      ) : (
        <div className="history-list">
          {sortedDates.map((date) => (
            <div key={date} className="history-day">
              <div className="history-date">
                <span className="date-icon"> </span>
                <span>{formatDate(date)}</span>
                <span className="date-count">{logsByDate[date].length} habit</span>
              </div>
              <div className="history-items">
                {logsByDate[date].map((log) => (
                  <div key={log.id} className="history-item">
                    <span className="check-icon">✅</span>
                    <div className="history-item-info">
                      <span className="history-habit-name">
                        {log.habit_name || habitNamesById.get(log.habit_id) || 'Habit'}
                      </span>
                      {log.note && (
                        <span className="history-note"> {log.note}</span>
                      )}
                    </div>
                    <span className="history-time">
                      {new Date(log.created_at).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
