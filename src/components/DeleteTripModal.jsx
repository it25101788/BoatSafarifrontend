import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteTripModal.css";

function DeleteTripModal({
  trip,
  onClose,
  onDelete,
  loading,
}) {
  if (!trip) {
    return null;
  }

  return (
    <div className="delete-trip-overlay">
      <div className="delete-trip-modal">
        <div className="delete-trip-header">
          <div className="delete-trip-warning-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-trip-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-trip-content">
          <span>DELETE TRIP</span>

          <h2>Remove this trip schedule?</h2>

          <p>
            Trip <strong>#{trip.id}</strong>{" "}
            for{" "}
            <strong>
              {trip.boat?.boatName || "this boat"}
            </strong>{" "}
            will be permanently deleted.
          </p>

          <div className="delete-trip-summary">
            <div>
              <span>Trip ID</span>
              <strong>#{trip.id}</strong>
            </div>

            <div>
              <span>Date</span>
              <strong>{trip.tripDate}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{trip.status}</strong>
            </div>
          </div>
        </div>

        <div className="delete-trip-actions">
          <button
            type="button"
            className="delete-trip-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Keep trip
          </button>

          <button
            type="button"
            className="delete-trip-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete trip"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTripModal;