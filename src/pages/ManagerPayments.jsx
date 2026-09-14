import { useEffect, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  ReceiptText,
  RefreshCcw,
  UserRound,
 
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import EditPaymentModal from "../components/EditPaymentModal";
import DeletePaymentModal from "../components/DeletePaymentModal";

import "./ManagerPayments.css";

function ManagerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [receiptLoadingId, setReceiptLoadingId] =useState(null);
  const [receiptError, setReceiptError] = useState("");
  const [editingPayment, setEditingPayment] =useState(null);
  const [editPaymentLoading, setEditPaymentLoading] =useState(false);
  const [deletingPayment, setDeletingPayment] =useState(null);
  const [deletePaymentLoading, setDeletePaymentLoading] = useState(false);
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/payments");

        setPayments(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load payments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS"
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  const refundedPayments = payments.filter(
    (payment) => payment.status === "REFUNDED"
  ).length;

  const successfulValue = payments
    .filter(
      (payment) => payment.status === "SUCCESS"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatPaymentDate = (dateTime) => {
    if (!dateTime) {
      return "Not available";
    }

    const normalizedDate = String(dateTime).replace(
      /(\.\d{3})\d+/,
      "$1"
    );

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return String(dateTime);
    }

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatMethod = (method) => {
    if (!method) {
      return "—";
    }

    return method
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };
  const handleOpenReceipt = async (paymentId) => {
  try {
    setReceiptLoadingId(paymentId);
    setReceiptError("");

    const response = await api.get(
      `/payments/${paymentId}/receipt/pdf`,
      {
        responseType: "blob",
      }
    );

    const pdfBlob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const pdfUrl =
      window.URL.createObjectURL(pdfBlob);

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setTimeout(() => {
      window.URL.revokeObjectURL(pdfUrl);
    }, 60000);
  } catch (err) {
    setReceiptError(
      err.response?.data?.error ||
        "Unable to open payment receipt."
    );
  } finally {
    setReceiptLoadingId(null);
  }
};
const handleUpdatePayment = async (paymentData) => {
  if (!editingPayment) {
    return;
  }

  try {
    setEditPaymentLoading(true);
    setError("");

    const response = await api.put(
      `/payments/${editingPayment.id}`,
      paymentData
    );

    setPayments((currentPayments) =>
      currentPayments.map((payment) =>
        payment.id === editingPayment.id
          ? response.data
          : payment
      )
    );

    setEditingPayment(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update payment."
    );
  } finally {
    setEditPaymentLoading(false);
  }
};
const handleDeletePayment = async () => {
  if (!deletingPayment) {
    return;
  }

  try {
    setDeletePaymentLoading(true);
    setError("");

    await api.delete(
      `/payments/${deletingPayment.id}`
    );

    setPayments((currentPayments) =>
      currentPayments.filter(
        (payment) =>
          payment.id !== deletingPayment.id
      )
    );

    setDeletingPayment(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete payment."
    );

    setDeletingPayment(null);
  } finally {
    setDeletePaymentLoading(false);
  }
};

  return (
    <ManagerLayout>
      <div className="manager-payments-page">
        <section className="manager-payments-header">
          <div>
            <div className="manager-payments-eyebrow">
              <CreditCard size={15} />
              PAYMENT MANAGEMENT
            </div>

            <h1>Payments</h1>

            <p>
              Track customer transactions, payment
              status, booking details and receipts.
            </p>
          </div>
        </section>

        {error && (
          <div className="manager-payments-error">
            {error}
          </div>
        )}
{receiptError && (
  <div className="manager-payments-error">
    {receiptError}
  </div>
)}
        <section className="manager-payment-stats">
          <article className="manager-payment-stat">
            <div className="manager-payment-stat-icon">
              <CreditCard size={21} />
            </div>

            <div>
              <span>Total payments</span>

              <strong>
                {loading ? "—" : payments.length}
              </strong>

              <small>All transactions</small>
            </div>
          </article>

          <article className="manager-payment-stat">
            <div className="manager-payment-stat-icon success">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Successful</span>

              <strong>
                {loading
                  ? "—"
                  : successfulPayments}
              </strong>

              <small>Completed payments</small>
            </div>
          </article>

          <article className="manager-payment-stat">
            <div className="manager-payment-stat-icon pending">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {loading
                  ? "—"
                  : pendingPayments}
              </strong>

              <small>Awaiting processing</small>
            </div>
          </article>

          <article className="manager-payment-stat">
            <div className="manager-payment-stat-icon revenue">
              <Banknote size={21} />
            </div>

            <div>
              <span>Successful value</span>

              <strong className="manager-payment-value">
                {loading
                  ? "—"
                  : formatCurrency(
                      successfulValue
                    )}
              </strong>

              <small>Confirmed revenue</small>
            </div>
          </article>
        </section>

        {refundedPayments > 0 && (
          <div className="manager-payment-refund-note">
            <RefreshCcw size={16} />

            {refundedPayments} refunded payment
            {refundedPayments !== 1 ? "s" : ""}
          </div>
        )}

        {loading ? (
          <div className="manager-payments-loading">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="manager-payments-empty">
            <CreditCard size={38} />

            <h2>No payments found</h2>

            <p>
              Customer transactions will appear here
              when payments are created.
            </p>
          </div>
        ) : (
          <section className="manager-payments-grid">
            {payments.map((payment) => (
              <article
                className="manager-payment-card"
                key={payment.id}
              >
                <div className="manager-payment-card-top">
                  <div>
                    <span>
                      PAYMENT #{payment.id}
                    </span>

                    <h2>
                      {formatCurrency(
                        payment.amount
                      )}
                    </h2>

                    <p>
                      {formatMethod(
                        payment.paymentMethod
                      )}
                    </p>
                  </div>

                  <span
                    className={`manager-payment-status ${
                      payment.status
                        ?.toLowerCase() || ""
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="manager-payment-customer">
                  <UserRound size={18} />

                  <div>
                    <span>Customer</span>

                    <strong>
                      {payment.booking?.customer
                        ?.name || "—"}
                    </strong>

                    <small>
                      {payment.booking?.customer
                        ?.email || "—"}
                    </small>
                  </div>
                </div>

                <div className="manager-payment-details">
                  <div>
                    <ReceiptText size={17} />

                    <span>Booking</span>

                    <strong>
                      #
                      {payment.booking?.id ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <CreditCard size={17} />

                    <span>Method</span>

                    <strong>
                      {formatMethod(
                        payment.paymentMethod
                      )}
                    </strong>
                  </div>

                  <div>
                    <CheckCircle2 size={17} />

                    <span>Booking status</span>

                    <strong>
                      {payment.booking?.status ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <Banknote size={17} />

                    <span>Safari</span>

                    <strong>
                      {payment.booking
                        ?.tripSchedule?.boat
                        ?.boatName || "—"}
                    </strong>
                  </div>
                </div>

                <div className="manager-payment-reference">
                  <span>
                    Transaction reference
                  </span>

                  <strong>
                    {payment.transactionReference ||
                      "—"}
                  </strong>
                </div>

                <div className="manager-payment-date">
                  <span>Payment date</span>

                  <strong>
                    {formatPaymentDate(
                      payment.paymentDate
                    )}
                  </strong>
                </div>

                <div className="manager-payment-actions">
                  <button
  type="button"
  className="manager-payment-receipt"
  onClick={() =>
    handleOpenReceipt(payment.id)
  }
  disabled={
    receiptLoadingId === payment.id
  }
>
  {receiptLoadingId === payment.id
    ? "Opening..."
    : "Receipt"}
</button>

                <button
  type="button"
  className="manager-payment-edit"
  onClick={() =>
    setEditingPayment(payment)
  }
>
  Update
</button>
                 <button
  type="button"
  className="manager-payment-delete"
  onClick={() =>
    setDeletingPayment(payment)
  }
>
  Delete
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      {editingPayment && (
  <EditPaymentModal
    payment={editingPayment}
    loading={editPaymentLoading}
    onClose={() => {
      if (!editPaymentLoading) {
        setEditingPayment(null);
        setError("");
      }
    }}
   onSave={handleUpdatePayment}
  />
)}
{deletingPayment && (
  <DeletePaymentModal
    payment={deletingPayment}
    loading={deletePaymentLoading}
    onClose={() => {
      if (!deletePaymentLoading) {
        setDeletingPayment(null);
        setError("");
      }
    }}
    onDelete={handleDeletePayment}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerPayments;