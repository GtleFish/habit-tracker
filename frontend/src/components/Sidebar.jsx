export function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Habit Tracker</h1>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentPage === 'habits' ? 'active' : ''}`}
          onClick={() => onNavigate('habits')}
        >
          <span className="icon">☰</span>
          <span>My Habits</span>
        </button>
        <button
          className={`nav-item ${currentPage === 'add' ? 'active' : ''}`}
          onClick={() => onNavigate('add')}
        >
          <span className="icon">+</span>
          <span>Add Habit</span>
        </button>
      </nav>
    </aside>
  );
}
