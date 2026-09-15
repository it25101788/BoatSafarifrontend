import {
  CheckCircle2,
  X,
} from "lucide-react";

import "./ConfirmBookingModal.css";

function ConfirmBookingModal({
  booking,
  loading,
  onClose,
  onConfirm,
}) {
  if (!booking) {
    return null;
  }

  return (
    <div className="confirm-booking-overlay">
      <div className="confirm-booking-modal">
        <div className="confirm-booking-header">
          <div className="confirm-booking-icon">
            <CheckCircle2 size={24} />
          </div>

          <button
            type="button"
            className="confirm-booking-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="confirm-booking-content">
          <span>CONFIRM RESERVATION</span>

          <h2>Confirm this booking?</h2>

          <p>
            Booking{" "}
            <strong>#{booking.id}</strong>{" "}
            for{" "}
            <strong>
              {booking.customer?.name}
            </strong>{" "}
            will be marked as confirmed.
          </p>

          <div className="confirm-booking-summary">
            <div>
              <span>Passengers</span>

              <strong>
                {booking.numberOfPassengers}
              </strong>
            </div>

            <div>
              <span>Safari</span>

              <strong>
                {
                  booking.tripSchedule?.boat
                    ?.boatName || "—"
                }
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

        <div className="confirm-booking-actions">
          <button
            type="button"
            className="confirm-booking-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Go back
          </button>

          <button
            type="button"
            className="confirm-booking-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            <CheckCircle2 size={16} />

            {loading
              ? "Confirming..."
              : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingModal;