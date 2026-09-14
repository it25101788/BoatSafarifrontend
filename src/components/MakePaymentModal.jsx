import { useState } from "react";
import {
  Banknote,
  CalendarDays,
  CreditCard,
  LockKeyhole,
  Receipt,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import "./MakePaymentModal.css";

function MakePaymentModal({
  bookings,
  loading,
  onClose,
  onSubmit,
}) {
  const [bookingId, setBookingId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("CARD");

  /* CARD DETAILS */

  const [cardholderName, setCardholderName] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [validationError, setValidationError] =
    useState("");

  /* FORMAT CARD NUMBER */

  const handleCardNumberChange = (event) => {
    const digits = event.target.value
      .replace(/\D/g, "")
      .slice(0, 16);

    const formatted = digits.replace(
      /(\d{4})(?=\d)/g,
      "$1 "
    );

    setCardNumber(formatted);
  };

  /* FORMAT EXPIRY MM/YY */

  const handleExpiryChange = (event) => {
    let value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(
        0,
        2
      )}/${value.slice(2)}`;
    }

    setExpiryDate(value);
  };

  /* VALIDATE EXPIRY */

  const isExpiryValid = () => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return false;
    }

    const [month, year] =
      expiryDate.split("/");

    const monthNumber = Number(month);
    const yearNumber =
      2000 + Number(year);

    if (
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      return false;
    }

    const now = new Date();

    const currentMonth =
      now.getMonth() + 1;

    const currentYear =
      now.getFullYear();

    if (yearNumber < currentYear) {
      return false;
    }

    if (
      yearNumber === currentYear &&
      monthNumber < currentMonth
    ) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    setValidationError("");

    if (!bookingId) {
      setValidationError(
        "Please select a booking."
      );

      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setValidationError(
        "Enter a valid payment amount."
      );

      return;
    }

    /* CARD VALIDATION */

    if (paymentMethod === "CARD") {
      if (
        cardholderName.trim().length < 2
      ) {
        setValidationError(
          "Enter the cardholder name."
        );

        return;
      }

      const cardDigits =
        cardNumber.replace(/\s/g, "");

      if (
        !/^\d{16}$/.test(cardDigits)
      ) {
        setValidationError(
          "Card number must contain 16 digits."
        );

        return;
      }

      if (!isExpiryValid()) {
        setValidationError(
          "Enter a valid card expiry date."
        );

        return;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        setValidationError(
          "Enter a valid CVV."
        );

        return;
      }
    }

    const generatedReference =
      `TXN-${bookingId}-${Date.now()}`;

    onSubmit({
      amount: Number(amount),

      status: "PENDING",

      paymentMethod,

      transactionReference:
        generatedReference,

      paymentDate: (() => {
        const now = new Date();

        const pad = (value) =>
          String(value).padStart(
            2,
            "0"
          );

        return `${now.getFullYear()}-${pad(
          now.getMonth() + 1
        )}-${pad(
          now.getDate()
        )}T${pad(
          now.getHours()
        )}:${pad(
          now.getMinutes()
        )}:${pad(
          now.getSeconds()
        )}`;
      })(),

      booking: {
        id: Number(bookingId),
      },
    });
  };

  return (
    <div className="make-payment-overlay">
      <div className="make-payment-modal">
        <div className="make-payment-header">
          <div>
            <span>PAYMENT CENTER</span>

            <h2>Make a payment</h2>
          </div>

          <button
            type="button"
            className="make-payment-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close payment form"
          >
            <X size={20} />
          </button>
        </div>

        <div className="make-payment-summary">
          <div className="make-payment-summary-icon">
            <WalletCards size={22} />
          </div>

          <div>
            <strong>
              Safari payment
            </strong>

            <span>
              Submit payment details for one
              of your confirmed bookings.
            </span>
          </div>
        </div>

        {validationError && (
          <div className="make-payment-error">
            {validationError}
          </div>
        )}

        <div className="make-payment-form">
          {/* BOOKING */}

          <div className="make-payment-field">
            <label htmlFor="payment-booking">
              Booking
            </label>

            <div className="make-payment-select">
              <Receipt size={18} />

              <select
                id="payment-booking"
                value={bookingId}
                onChange={(event) =>
                  setBookingId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select booking
                </option>

                {bookings.map(
                  (booking) => (
                    <option
                      key={booking.id}
                      value={booking.id}
                    >
                      Booking #{booking.id}
                      {" — "}
                      {booking
                        .tripSchedule
                        ?.boat?.boatName ||
                        "Safari"}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* AMOUNT */}

          <div className="make-payment-field">
            <label htmlFor="payment-amount">
              Amount (LKR)
            </label>

            <div className="make-payment-input">
              <Banknote size={18} />

              <input
                id="payment-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          {/* PAYMENT METHOD */}

          <div className="make-payment-field">
            <label htmlFor="payment-method">
              Payment method
            </label>

            <div className="make-payment-select">
              <CreditCard size={18} />

              <select
                id="payment-method"
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

                <option value="BANK_TRANSFER">
                  Bank transfer
                </option>

                <option value="CASH">
                  Cash
                </option>
              </select>
            </div>
          </div>

          {/* CARD DETAILS */}

          {paymentMethod === "CARD" && (
            <div className="card-payment-section">
              <div className="card-payment-heading">
                <div>
                  <CreditCard size={20} />
                </div>

               <div className="card-payment-heading-text">
  <strong>Card details</strong>

  <span>
    Enter your card information securely.
  </span>
</div>
              </div>

              {/* CARDHOLDER */}

              <div className="make-payment-field">
                <label htmlFor="cardholder-name">
                  Cardholder name
                </label>

                <div className="make-payment-input">
                  <UserRound size={18} />

                  <input
                    id="cardholder-name"
                    type="text"
                    placeholder="Name on card"
                    value={cardholderName}
                    onChange={(event) =>
                      setCardholderName(
                        event.target.value
                      )
                    }
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* CARD NUMBER */}

              <div className="make-payment-field">
                <label htmlFor="card-number">
                  Card number
                </label>

                <div className="make-payment-input">
                  <CreditCard size={18} />

                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={
                      handleCardNumberChange
                    }
                    maxLength={19}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* EXPIRY + CVV */}

              <div className="card-payment-row">
                <div className="make-payment-field">
                  <label htmlFor="card-expiry">
                    Expiry date
                  </label>

                  <div className="make-payment-input">
                    <CalendarDays size={18} />

                    <input
                      id="card-expiry"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={
                        handleExpiryChange
                      }
                      maxLength={5}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="make-payment-field">
                  <label htmlFor="card-cvv">
                    CVV
                  </label>

                  <div className="make-payment-input">
                    <LockKeyhole size={18} />

                    <input
                      id="card-cvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={cvv}
                      onChange={(event) =>
                        setCvv(
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(0, 4)
                        )
                      }
                      maxLength={4}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <p className="card-security-note">
                Card number and CVV are
                validated for this demo and
                are not stored in the
                database.
              </p>
            </div>
          )}

          {/* STATUS */}

          <div className="make-payment-status-note">
            <span>Payment status</span>

            <strong>Pending</strong>

            <p>
              Your payment will remain
              pending until it is verified
              by management.
            </p>
          </div>
        </div>

        <div className="make-payment-actions">
          <button
            type="button"
            className="make-payment-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="make-payment-submit"
            onClick={handleSubmit}
            disabled={
              loading ||
              bookings.length === 0
            }
          >
            {loading
              ? "Submitting..."
              : "Submit payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MakePaymentModal;