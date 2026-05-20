export function DeleteConfirmModal({ habitName, isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onCancel}></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Delete Habit?</h3>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete <strong>"{habitName}"</strong>?</p>
            <p className="modal-warning">⚠ This action cannot be undone.</p>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn-confirm-delete" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
