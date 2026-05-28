import { useState } from 'react';

const emptyHabit = () => ({ name: '', description: '' });

export function AddHabit({ onSubmit, isLoading, error }) {
  const [habits, setHabits] = useState([emptyHabit()]);

  const updateHabit = (index, field, value) => {
    setHabits(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  };

  const addRow = () => {
    setHabits(prev => [...prev, emptyHabit()]);
  };

  const removeRow = (index) => {
    if (habits.length === 1) return;
    setHabits(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = habits.filter(h => h.name.trim());
    if (valid.length === 0) return;

    for (const habit of valid) {
      await onSubmit(habit.name.trim(), habit.description.trim());
    }
    setHabits([emptyHabit()]);
  };

  const hasValid = habits.some(h => h.name.trim());

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tạo Habit Mới</h2>
        {habits.length > 1 && (
          <span className="habit-count">{habits.filter(h => h.name.trim()).length} habit</span>
        )}
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-habit-form">
        <div className="habit-rows">
          {habits.map((habit, index) => (
            <div key={index} className="habit-row">
              <div className="habit-row-number">{index + 1}</div>
              <div className="habit-row-fields">
                <input
                  type="text"
                  placeholder="Tên habit (VD: Tập thể dục, Đọc sách...)"
                  value={habit.name}
                  onChange={(e) => updateHabit(index, 'name', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  maxLength={255}
                  required={index === 0}
                />
                <input
                  type="text"
                  placeholder="Mô tả (tùy chọn)"
                  value={habit.description}
                  onChange={(e) => updateHabit(index, 'description', e.target.value)}
                  className="form-input form-input-desc"
                  disabled={isLoading}
                  maxLength={500}
                />
              </div>
              {habits.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-row"
                  onClick={() => removeRow(index)}
                  aria-label="Xóa dòng này"
                  disabled={isLoading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="add-habit-actions">
          <button
            type="button"
            className="btn-add-row"
            onClick={addRow}
            disabled={isLoading}
          >
            + Thêm habit khác
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !hasValid}
          >
            {isLoading ? (
              <>
                <span className="spinner-sm"></span> Đang tạo...
              </>
            ) : (
              <>Tạo {habits.filter(h => h.name.trim()).length > 1 ? `${habits.filter(h => h.name.trim()).length} Habits` : 'Habit'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
