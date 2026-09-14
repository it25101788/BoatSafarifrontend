import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteCrewModal.css";

function DeleteCrewModal({
  member,
  onClose,
  onDelete,
  loading,
}) {
  if (!member) {
    return null;
  }

  return (
    <div className="delete-crew-overlay">
      <div className="delete-crew-modal">
        <div className="delete-crew-header">
          <div className="delete-crew-warning-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-crew-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-crew-content">
          <span>DELETE CREW MEMBER</span>

          <h2>Remove this crew member?</h2>

          <p>
            <strong>{member.name}</strong>{" "}
            will be permanently removed from the
            crew records.
          </p>

          <div className="delete-crew-summary">
            <div>
              <span>ID</span>
              <strong>#{member.id}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{member.role}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {member.availabilityStatus}
              </strong>
            </div>
          </div>
        </div>

        <div className="delete-crew-actions">
          <button
            type="button"
            className="delete-crew-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Keep member
          </button>

          <button
            type="button"
            className="delete-crew-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete member"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCrewModal;