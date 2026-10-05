import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteBoatModal.css";

function DeleteBoatModal({
  boat,
  onClose,
  onDelete,
  loading,
}) {
  if (!boat) {
    return null;
  }

  return (
    <div className="delete-boat-overlay">
      <div className="delete-boat-modal">
        <div className="delete-boat-header">
          <div className="delete-boat-warning-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-boat-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-boat-content">
          <span>DELETE BOAT</span>

          <h2>Remove this boat?</h2>

          <p>
            <strong>{boat.boatName}</strong>{" "}
            will be permanently removed from the fleet.
          </p>

          <div className="delete-boat-summary">
            <div>
              <span>Boat ID</span>
              <strong>#{boat.id}</strong>
            </div>

            <div>
              <span>Capacity</span>
              <strong>{boat.capacity} people</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{boat.status}</strong>
            </div>
          </div>
        </div>

        <div className="delete-boat-actions">
          <button
            type="button"
            className="delete-boat-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Keep boat
          </button>

          <button
            type="button"
            className="delete-boat-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete boat"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBoatModal;