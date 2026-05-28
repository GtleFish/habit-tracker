export function Sidebar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'habits', label: 'My Habits' },
    { id: 'add', label: 'Add Habit'},
    { id: 'history', label: 'History' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-name">HabitTracker</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        Build better habits
      </div>
    </aside>
  );
}
