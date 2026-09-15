import {
  AlertTriangle,
  X,
} from "lucide-react";

import "./CancelManagerBookingModal.css";

function CancelManagerBookingModal({
  booking,
  loading,
  onClose,
  onCancel,
}) {
  if (!booking) {
    return null;
  }

  return (
    <div className="manager-cancel-booking-overlay">
      <div className="manager-cancel-booking-modal">
        <div className="manager-cancel-booking-header">
          <div className="manager-cancel-booking-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="manager-cancel-booking-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="manager-cancel-booking-content">
          <span>CANCEL RESERVATION</span>

          <h2>Cancel this booking?</h2>

          <p>
            Booking{" "}
            <strong>#{booking.id}</strong>{" "}
            for{" "}
            <strong>
              {booking.customer?.name}
            </strong>{" "}
            will be marked as cancelled.
          </p>

          <div className="manager-cancel-booking-summary">
            <div>
              <span>Passengers</span>
              <strong>
                {booking.numberOfPassengers}
              </strong>
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
              <strong>
                {booking.status}
              </strong>
            </div>
          </div>
        </div>

        <div className="manager-cancel-booking-actions">
          <button
            type="button"
            className="manager-cancel-booking-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep booking
          </button>

          <button
            type="button"
            className="manager-cancel-booking-confirm"
            onClick={onCancel}
            disabled={loading}
          >
            {loading
              ? "Cancelling..."
              : "Cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelManagerBookingModal;