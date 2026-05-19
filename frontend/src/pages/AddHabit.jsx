import { useState } from 'react';

export function AddHabit({ onSubmit, isLoading, error }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2>Create a new Habit</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Habit Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Habit Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="5"
              disabled={isLoading}
            ></textarea>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'SUBMITTING...' : 'SUBMIT'}
            <span className="arrow">{'\u003E'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
