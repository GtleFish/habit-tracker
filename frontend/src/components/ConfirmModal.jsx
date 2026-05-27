import '../styles/modal.css';

export function ConfirmModal({ isOpen, title, message, confirmLabel = 'Xóa', cancelLabel = 'Hủy', onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-content modal-confirm">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel} aria-label="Đóng">✕</button>
        </div>

        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-right">
            <button className="btn-cancel" onClick={onCancel}>{cancelLabel}</button>
            <button
              className={danger ? 'btn-danger' : 'btn-save'}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
