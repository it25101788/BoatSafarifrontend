import {
  AlertTriangle,
  X,
} from "lucide-react";

import "./CancelBookingModal.css";

function CancelBookingModal({
  booking,
  onClose,
  onConfirm,
  loading,
}) {
  if (!booking) {
    return null;
  }

  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-modal">
        <div className="cancel-modal-top">
          <div className="cancel-warning-icon">
            <AlertTriangle size={27} />
          </div>

          <button
            type="button"
            className="cancel-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={19} />
          </button>
        </div>

        <span className="cancel-eyebrow">
          CANCEL BOOKING
        </span>

        <h2>
          Cancel this safari?
        </h2>

        <p>
          You are about to cancel Booking #
          {booking.id} for{" "}
          <strong>
            {
              booking.tripSchedule.boat
                .boatName
            }
          </strong>
          . This booking will remain in your history
          but its status will change to CANCELLED.
        </p>

        <div className="cancel-booking-summary">
          <div>
            <span>Booking</span>
            <strong>
              #{booking.id}
            </strong>
          </div>

          <div>
            <span>Passengers</span>
            <strong>
              {booking.numberOfPassengers}
            </strong>
          </div>

          <div>
            <span>Current status</span>
            <strong>
              {booking.status}
            </strong>
          </div>
        </div>

        <div className="cancel-modal-actions">
          <button
            type="button"
            className="keep-booking-button"
            onClick={onClose}
            disabled={loading}
          >
            Keep booking
          </button>

          <button
            type="button"
            className="confirm-cancel-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Cancelling..."
              : "Yes, cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelBookingModal;