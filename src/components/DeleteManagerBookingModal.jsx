import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteManagerBookingModal.css";

function DeleteManagerBookingModal({
  booking,
  loading,
  onClose,
  onDelete,
}) {
  if (!booking) {
    return null;
  }

  return (
    <div className="manager-delete-booking-overlay">
      <div className="manager-delete-booking-modal">
        <div className="manager-delete-booking-header">
          <div className="manager-delete-booking-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="manager-delete-booking-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="manager-delete-booking-content">
          <span>DELETE RESERVATION</span>

          <h2>Delete this booking?</h2>

          <p>
            Booking{" "}
            <strong>#{booking.id}</strong>{" "}
            for{" "}
            <strong>
              {booking.customer?.name}
            </strong>{" "}
            will be permanently removed.
          </p>

          <div className="manager-delete-booking-summary">
            <div>
              <span>Booking ID</span>
              <strong>#{booking.id}</strong>
            </div>

            <div>
              <span>Safari</span>
              <strong>
                {booking.tripSchedule?.boat
                  ?.boatName || "—"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{booking.status}</strong>
            </div>
          </div>
        </div>

        <div className="manager-delete-booking-actions">
          <button
            type="button"
            className="manager-delete-booking-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep booking
          </button>

          <button
            type="button"
            className="manager-delete-booking-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteManagerBookingModal;