export function Header({ apiStatus }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">🎯 Habit Tracker</h1>
        <p className="header-subtitle">Build better habits, one day at a time</p>
      </div>
      <div className="header-right">
        <span className={`api-status ${apiStatus === 'ok' ? 'status-ok' : 'status-error'}`}>
          <span>{apiStatus === 'ok' ? '●' : '●'}</span>
          {apiStatus === 'ok' ? 'API Online' : 'API Offline'}
        </span>
      </div>
    </header>
  );
}
