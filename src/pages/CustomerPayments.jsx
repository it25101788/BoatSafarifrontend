import { useEffect, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Receipt,
  WalletCards,
} from "lucide-react";

import api from "../services/api";
import CustomerLayout from "../layouts/CustomerLayout";
import MakePaymentModal from "../components/MakePaymentModal";

import "./CustomerPayments.css";

function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);
  const [receiptError, setReceiptError] = useState("");
  const [bookings, setBookings] = useState([]);

const [showMakePayment, setShowMakePayment] =
  useState(false);

const [makePaymentLoading, setMakePaymentLoading] =
  useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

 useEffect(() => {
  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        paymentsResponse,
        bookingsResponse,
      ] = await Promise.all([
        api.get(
          `/payments/customer/${user.id}`
        ),
        api.get("/bookings"),
      ]);

      setPayments(paymentsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load your payment information."
      );
    } finally {
      setLoading(false);
    }
  };

  loadPaymentData();
}, [user.id]);

const unavailableBookingIds = new Set(
  payments
    .filter(
      (payment) =>
        payment.status === "SUCCESS" ||
        payment.status === "PENDING"
    )
    .map(
      (payment) =>
        payment.booking?.id
    )
);

const eligibleBookings = bookings.filter(
  (booking) =>
    booking.status === "CONFIRMED" &&
    !unavailableBookingIds.has(booking.id)
);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS"
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "Not available";
    }

    return new Date(dateTime).toLocaleString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const getPaymentIcon = (method) => {
    if (method === "CARD") {
      return <CreditCard size={20} />;
    }

    if (method === "CASH") {
      return <Banknote size={20} />;
    }

    return <WalletCards size={20} />;
  };
  const handleViewReceipt = async (paymentId) => {
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
const handleCreatePayment = async (
  paymentData
) => {
  try {
    setMakePaymentLoading(true);
    setError("");

    const response = await api.post(
      "/payments",
      paymentData
    );

    setPayments((currentPayments) => [
      ...currentPayments,
      response.data,
    ]);

    setShowMakePayment(false);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to submit payment."
    );
  } finally {
    setMakePaymentLoading(false);
  }
};


  return (
    <CustomerLayout>
      <div className="payments-page">
        <section className="payments-header">
          <div>
            <div className="payments-eyebrow">
              <Receipt size={15} />
              PAYMENT CENTER
            </div>

            <h1>My payments</h1>

            <p>
              Track your safari payments, transaction
              status and payment receipts in one place.
            </p>
          </div>
           <button
    type="button"
    className="payments-make-button"
    onClick={() =>
      setShowMakePayment(true)
    }
  >
    <CreditCard size={17} />
    Make payment
  </button>
        </section>

        {error && (
  <div className="payments-error">
    {error}
  </div>
)}

{receiptError && (
  <div className="payments-error">
    {receiptError}
  </div>
)}

        <section className="payment-stats">
          <div className="payment-stat-card">
            <div className="payment-stat-icon total">
              <WalletCards size={21} />
            </div>

            <div>
              <span>Total payments</span>

              <strong>
                {loading ? "—" : payments.length}
              </strong>

              <small>
                All transactions
              </small>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="payment-stat-icon success">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Successful</span>

              <strong>
                {loading
                  ? "—"
                  : successfulPayments}
              </strong>

              <small>
                Completed payments
              </small>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="payment-stat-icon pending">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {loading
                  ? "—"
                  : pendingPayments}
              </strong>

              <small>
                Awaiting completion
              </small>
            </div>
          </div>

          <div className="payment-stat-card amount">
            <div className="payment-stat-icon amount">
              <Banknote size={21} />
            </div>

            <div>
              <span>Total value</span>

              <strong className="payment-total-money">
                {loading
                  ? "—"
                  : formatMoney(totalAmount)}
              </strong>

              <small>
                Recorded transactions
              </small>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="payments-loading">
            Loading your payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="payments-empty">
            <Receipt size={38} />

            <h2>No payments yet</h2>

            <p>
              Your safari payment history will appear
              here.
            </p>
          </div>
        ) : (
          <section className="payment-list">
            {payments.map((payment) => (
              <article
                className="payment-card"
                key={payment.id}
              >
                <div className="payment-card-top">
                  <div className="payment-method-icon">
                    {getPaymentIcon(
                      payment.paymentMethod
                    )}
                  </div>

                  <div className="payment-title">
                    <span>
                      PAYMENT #{payment.id}
                    </span>

                    <h2>
                      {formatMoney(
                        payment.amount
                      )}
                    </h2>

                    <p>
                      {payment.paymentMethod.replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>

                  <span
                    className={`payment-status ${payment.status.toLowerCase()}`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="payment-information">
                  <div className="payment-info-item">
                    <CalendarDays size={18} />

                    <div>
                      <span>Payment date</span>

                      <strong>
                        {formatDateTime(
                          payment.paymentDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="payment-info-item">
                    <Receipt size={18} />

                    <div>
                      <span>Booking</span>

                      <strong>
                        Booking #
                        {payment.booking.id}
                      </strong>
                    </div>
                  </div>

                  <div className="payment-info-item">
                    <CreditCard size={18} />

                    <div>
                      <span>
                        Transaction reference
                      </span>

                      <strong>
                        {
                          payment.transactionReference
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="payment-info-item">
                    <WalletCards size={18} />

                    <div>
                      <span>Booking status</span>

                      <strong>
                        {
                          payment.booking.status
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="payment-card-footer">
                  <div>
                    <span>Safari</span>

                    <strong>
                      {
                        payment.booking.tripSchedule
                          .boat.boatName
                      }
                    </strong>
                  </div>

                  <button
  className="payment-receipt-button"
  onClick={() =>
    handleViewReceipt(payment.id)
  }
  disabled={
    receiptLoadingId === payment.id
  }
>
  <FileText size={17} />

  {receiptLoadingId === payment.id
    ? "Opening..."
    : "View receipt"}
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      {showMakePayment && (
  <MakePaymentModal
    bookings={eligibleBookings}
    loading={makePaymentLoading}
    onClose={() => {
      if (!makePaymentLoading) {
        setShowMakePayment(false);
        setError("");
      }
    }}
    onSubmit={handleCreatePayment}
  />
)}
    </CustomerLayout>
  );
}

export default CustomerPayments;
//