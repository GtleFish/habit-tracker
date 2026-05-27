export function Sidebar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'habits', label: 'My Habits', icon: '📋' },
    { id: 'add', label: 'Add Habit', icon: '➕' },
    { id: 'history', label: 'History', icon: '📅' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🎯</span>
        <span className="brand-name">HabitTracker</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        Build better habits ✨
      </div>
    </aside>
  );
}
