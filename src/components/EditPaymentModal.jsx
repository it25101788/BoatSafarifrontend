import { useState } from "react";
import {
  Banknote,
  CreditCard,
  FileText,
  X,
} from "lucide-react";

import "./EditPaymentModal.css";

function EditPaymentModal({
  payment,
  loading,
  onClose,
  onSave,
}) {
  const [amount, setAmount] = useState(
    payment?.amount || ""
  );

  const [paymentMethod, setPaymentMethod] =
    useState(
      payment?.paymentMethod || "CARD"
    );

  const [status, setStatus] = useState(
    payment?.status || "PENDING"
  );

  const [
    transactionReference,
    setTransactionReference,
  ] = useState(
    payment?.transactionReference || ""
  );

  if (!payment) {
    return null;
  }

  const bookingCancelled =
    payment.booking?.status === "CANCELLED";

  const handleSubmit = () => {
    if (
      !amount ||
      Number(amount) <= 0 ||
      !paymentMethod ||
      !status ||
      !transactionReference.trim()
    ) {
      return;
    }

    onSave({
      amount: Number(amount),

      paymentMethod,

      status,

      transactionReference:
        transactionReference.trim(),

      paymentDate: payment.paymentDate,

      booking: {
        id: payment.booking.id,
      },
    });
  };

  return (
    <div className="edit-payment-overlay">
      <div className="edit-payment-modal">
        <div className="edit-payment-header">
          <div>
            <span>PAYMENT MANAGEMENT</span>

            <h2>Update payment</h2>
          </div>

          <button
            type="button"
            className="edit-payment-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-payment-summary">
          <div className="edit-payment-summary-icon">
            <CreditCard size={21} />
          </div>

          <div>
            <strong>
              Payment #{payment.id}
            </strong>

            <span>
              Booking #{payment.booking?.id}
            </span>
          </div>
        </div>

        {bookingCancelled && (
          <div className="edit-payment-warning">
            This booking is cancelled. Its payment
            can only be changed to REFUNDED.
          </div>
        )}

        <div className="edit-payment-form">
          <div className="edit-payment-field">
            <label htmlFor="edit-payment-amount">
              Amount
            </label>

            <div className="edit-payment-input">
              <Banknote size={18} />

              <input
                id="edit-payment-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-payment-field">
            <label htmlFor="edit-payment-method">
              Payment method
            </label>

            <div className="edit-payment-select-wrapper">
              <CreditCard size={18} />

              <select
                id="edit-payment-method"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
              >
                <option value="CARD">
                  Card
                </option>

                <option value="CASH">
                  Cash
                </option>

                <option value="BANK_TRANSFER">
                  Bank transfer
                </option>
              </select>
            </div>
          </div>

          <div className="edit-payment-field">
            <label htmlFor="edit-payment-status">
              Payment status
            </label>

            <select
              id="edit-payment-status"
              className="edit-payment-status-select"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              {bookingCancelled ? (
                <option value="REFUNDED">
                  Refunded
                </option>
              ) : (
                <>
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="SUCCESS">
                    Success
                  </option>

                  <option value="FAILED">
                    Failed
                  </option>

                  <option value="REFUNDED">
                    Refunded
                  </option>
                </>
              )}
            </select>
          </div>

          <div className="edit-payment-field">
            <label htmlFor="edit-payment-reference">
              Transaction reference
            </label>

            <div className="edit-payment-input">
              <FileText size={18} />

              <input
                id="edit-payment-reference"
                type="text"
                value={transactionReference}
                onChange={(event) =>
                  setTransactionReference(
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="edit-payment-actions">
          <button
            type="button"
            className="edit-payment-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-payment-save"
            onClick={handleSubmit}
            disabled={
              loading ||
              !amount ||
              Number(amount) <= 0 ||
              !transactionReference.trim()
            }
          >
            {loading
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPaymentModal;