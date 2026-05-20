import { useState } from 'react';

export function AddHabit({ onSubmit, isLoading, error }) {
  const [habits, setHabits] = useState([{ title: '', description: '' }]);

  const handleAddField = () => {
    setHabits([...habits, { title: '', description: '' }]);
  };

  const handleRemoveField = (index) => {
    if (habits.length > 1) {
      setHabits(habits.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const updatedHabits = [...habits];
    updatedHabits[index][field] = value;
    setHabits(updatedHabits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validHabits = habits.filter(h => h.title.trim());

    if (validHabits.length > 0) {
      for (const habit of validHabits) {
        await onSubmit(habit.title, habit.description);
      }
      setHabits([{ title: '', description: '' }]);
    }
  };

  return (
    <div className="page">
      <div className="form-container-bulk">
        <div className="form-header">
          <h2>Create Habits</h2>
          <p className="form-subtitle">Add one or multiple habits at once</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="habit-form-bulk">
          <div className="habits-list">
            {habits.map((habit, index) => (
              <div key={index} className="habit-input-group">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Habit Title *"
                    value={habit.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <textarea
                    placeholder="Description (optional)"
                    value={habit.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="form-textarea"
                    rows="3"
                    disabled={isLoading}
                  ></textarea>
                </div>

                {habits.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-habit"
                    onClick={() => handleRemoveField(index)}
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}

                {index < habits.length - 1 && <div className="habit-divider"></div>}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-add-more"
              onClick={handleAddField}
              disabled={isLoading}
            >
              + Add Another Habit
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'SUBMITTING...' : 'CREATE HABITS'}
              <span className="arrow">{'\u003E'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

