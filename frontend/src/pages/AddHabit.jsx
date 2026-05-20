import { useState } from 'react';

export function AddHabit({ onSubmit, isLoading, error }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tạo Habit Mới</h2>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-group">
            <label htmlFor="habit-name" className="form-label">
              Tên Habit <span className="required">*</span>
            </label>
            <input
              id="habit-name"
              type="text"
              placeholder="VD: Tập thể dục, Đọc sách..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              disabled={isLoading}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="habit-desc" className="form-label">
              Mô tả
            </label>
            <textarea
              id="habit-desc"
              placeholder="Mô tả chi tiết về habit này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={4}
              disabled={isLoading}
              maxLength={500}
            />
            <span className="char-count">{description.length}/500</span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner-sm"></span> Đang tạo...
              </>
            ) : (
              '➕ Tạo Habit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
