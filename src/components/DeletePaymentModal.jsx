import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeletePaymentModal.css";

function DeletePaymentModal({
  payment,
  loading,
  onClose,
  onDelete,
}) {
  if (!payment) {
    return null;
  }

  return (
    <div className="delete-payment-overlay">
      <div className="delete-payment-modal">
        <div className="delete-payment-header">
          <div className="delete-payment-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-payment-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-payment-content">
          <span>DELETE PAYMENT</span>

          <h2>Delete this payment?</h2>

          <p>
            Payment{" "}
            <strong>#{payment.id}</strong>{" "}
            for{" "}
            <strong>
              {payment.booking?.customer?.name ||
                "this customer"}
            </strong>{" "}
            will be permanently removed.
          </p>

          <div className="delete-payment-summary">
            <div>
              <span>Payment ID</span>
              <strong>#{payment.id}</strong>
            </div>

            <div>
              <span>Booking</span>
              <strong>
                #{payment.booking?.id || "—"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{payment.status}</strong>
            </div>
          </div>
        </div>

        <div className="delete-payment-actions">
          <button
            type="button"
            className="delete-payment-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep payment
          </button>

          <button
            type="button"
            className="delete-payment-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePaymentModal;