import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteManagerUserModal.css";

function DeleteManagerUserModal({
  user,
  loading,
  onClose,
  onDelete,
}) {
  if (!user) {
    return null;
  }

  return (
    <div className="delete-manager-user-overlay">
      <div className="delete-manager-user-modal">
        <div className="delete-manager-user-header">
          <div className="delete-manager-user-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-manager-user-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-manager-user-content">
          <span>DELETE ACCOUNT</span>

          <h2>Delete this user?</h2>

          <p>
            Account{" "}
            <strong>#{user.id}</strong>{" "}
            belonging to{" "}
            <strong>{user.name}</strong>{" "}
            will be permanently removed.
          </p>

          <div className="delete-manager-user-summary">
            <div>
              <span>User ID</span>
              <strong>#{user.id}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{user.role}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
          </div>
        </div>

        <div className="delete-manager-user-actions">
          <button
            type="button"
            className="delete-manager-user-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep user
          </button>

          <button
            type="button"
            className="delete-manager-user-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteManagerUserModal;