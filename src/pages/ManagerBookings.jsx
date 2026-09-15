import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hourglass,
  Ship,
  TicketCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import ConfirmBookingModal from "../components/ConfirmBookingModal";
import CancelManagerBookingModal from "../components/CancelManagerBookingModal";
import DeleteManagerBookingModal from "../components/DeleteManagerBookingModal";

import "./ManagerBookings.css";

function ManagerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingBooking, setConfirmingBooking] =useState(null);
  const [cancellingBooking, setCancellingBooking] =useState(null);
  const [cancelBookingLoading, setCancelBookingLoading] =useState(false);
  const [confirmBookingLoading, setConfirmBookingLoading] =useState(false);
  const [deletingBooking, setDeletingBooking] =useState(null);
  const [deleteBookingLoading, setDeleteBookingLoading] =useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/bookings"
        );

        setBookings(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "PENDING"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status === "CANCELLED"
  ).length;

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const [hour, minute] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hour),
      Number(minute),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const formatBookingDate = (dateTime) => {
    if (!dateTime) {
      return "Not available";
    }

    const normalizedDate = dateTime.replace(
      /(\.\d{3})\d+/,
      "$1"
    );

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };
const handleConfirmBooking = async () => {
  if (!confirmingBooking) {
    return;
  }

  try {
    setConfirmBookingLoading(true);
    setError("");

    const response = await api.put(
      `/bookings/${confirmingBooking.id}`,
      {
        numberOfPassengers:
          confirmingBooking.numberOfPassengers,

        status: "CONFIRMED",

        customer: {
          id: confirmingBooking.customer.id,
        },

        tripSchedule: {
          id: confirmingBooking.tripSchedule.id,
        },
      }
    );

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === confirmingBooking.id
          ? response.data
          : booking
      )
    );

    setConfirmingBooking(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to confirm booking."
    );

    setConfirmingBooking(null);
  } finally {
    setConfirmBookingLoading(false);
  }
};
const handleCancelBooking = async () => {
  if (!cancellingBooking) {
    return;
  }

  try {
    setCancelBookingLoading(true);
    setError("");

    const response = await api.put(
      `/bookings/${cancellingBooking.id}`,
      {
        numberOfPassengers:
          cancellingBooking.numberOfPassengers,

        status: "CANCELLED",

        customer: {
          id: cancellingBooking.customer.id,
        },

        tripSchedule: {
          id: cancellingBooking.tripSchedule.id,
        },
      }
    );

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === cancellingBooking.id
          ? response.data
          : booking
      )
    );

    setCancellingBooking(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to cancel booking."
    );

    setCancellingBooking(null);
  } finally {
    setCancelBookingLoading(false);
  }
};
const handleDeleteBooking = async () => {
  if (!deletingBooking) {
    return;
  }

  try {
    setDeleteBookingLoading(true);
    setError("");

    await api.delete(
      `/bookings/${deletingBooking.id}`
    );

    setBookings((currentBookings) =>
      currentBookings.filter(
        (booking) =>
          booking.id !== deletingBooking.id
      )
    );

    setDeletingBooking(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete booking."
    );

    setDeletingBooking(null);
  } finally {
    setDeleteBookingLoading(false);
  }
};
  return (
    <ManagerLayout>
      <div className="manager-bookings-page">
        <section className="manager-bookings-header">
          <div>
            <div className="manager-bookings-eyebrow">
              <TicketCheck size={15} />
              RESERVATION MANAGEMENT
            </div>

            <h1>Bookings</h1>

            <p>
              Review customer reservations,
              passenger details and booking status.
            </p>
          </div>
        </section>

        {error && (
          <div className="manager-bookings-error">
            {error}
          </div>
        )}

        <section className="manager-booking-stats">
          <article className="manager-booking-stat">
            <div className="manager-booking-stat-icon">
              <TicketCheck size={21} />
            </div>

            <div>
              <span>Total bookings</span>

              <strong>
                {loading
                  ? "—"
                  : bookings.length}
              </strong>

              <small>
                All reservations
              </small>
            </div>
          </article>

          <article className="manager-booking-stat">
            <div className="manager-booking-stat-icon confirmed">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Confirmed</span>

              <strong>
                {loading
                  ? "—"
                  : confirmedBookings}
              </strong>

              <small>
                Approved reservations
              </small>
            </div>
          </article>

          <article className="manager-booking-stat">
            <div className="manager-booking-stat-icon pending">
              <Hourglass size={21} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {loading
                  ? "—"
                  : pendingBookings}
              </strong>

              <small>
                Awaiting confirmation
              </small>
            </div>
          </article>

          <article className="manager-booking-stat">
            <div className="manager-booking-stat-icon cancelled">
              <XCircle size={21} />
            </div>

            <div>
              <span>Cancelled</span>

              <strong>
                {loading
                  ? "—"
                  : cancelledBookings}
              </strong>

              <small>
                Cancelled reservations
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-bookings-loading">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="manager-bookings-empty">
            <TicketCheck size={38} />

            <h2>No bookings found</h2>

            <p>
              Customer reservations will appear
              here once bookings are created.
            </p>
          </div>
        ) : (
          <section className="manager-bookings-grid">
            {bookings.map((booking) => (
              <article
                className="manager-booking-card"
                key={booking.id}
              >
                <div className="manager-booking-card-top">
                  <div>
                    <span>
                      BOOKING #{booking.id}
                    </span>

                    <h2>
                      {booking.customer?.name ||
                        "Customer"}
                    </h2>

                    <p>
                      {booking.customer?.email || "—"}
                    </p>
                  </div>

                  <span
                    className={`manager-booking-status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="manager-booking-trip">
                  <Ship size={18} />

                  <div>
                    <span>Safari</span>

                    <strong>
                      {
                        booking.tripSchedule?.boat
                          ?.boatName || "—"
                      }
                    </strong>
                  </div>
                </div>

                <div className="manager-booking-details">
                  <div>
                    <CalendarDays size={17} />

                    <span>Trip date</span>

                    <strong>
                      {formatDate(
                        booking.tripSchedule
                          ?.tripDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <Clock3 size={17} />

                    <span>Departure</span>

                    <strong>
                      {formatTime(
                        booking.tripSchedule
                          ?.startTime
                      )}
                    </strong>
                  </div>

                  <div>
                    <Users size={17} />

                    <span>Passengers</span>

                    <strong>
                      {booking.numberOfPassengers}
                    </strong>
                  </div>

                  <div>
                    <UserRound size={17} />

                    <span>Customer ID</span>

                    <strong>
                      #{booking.customer?.id}
                    </strong>
                  </div>
                </div>

                <div className="manager-booking-created">
                  <span>Booked</span>

                  <strong>
                    {formatBookingDate(
                      booking.bookingDate
                    )}
                  </strong>
                </div>

                <div className="manager-booking-actions">
                 {booking.status === "PENDING" && (
  <button
    type="button"
    className="manager-booking-confirm"
    onClick={() =>
      setConfirmingBooking(booking)
    }
  >
    Confirm
  </button>
)}

                 {booking.status !== "CANCELLED" && (
  <button
    type="button"
    className="manager-booking-cancel"
    onClick={() =>
      setCancellingBooking(booking)
    }
  >
    Cancel
  </button>
)}

                 <button
  type="button"
  className="manager-booking-delete"
  onClick={() =>
    setDeletingBooking(booking)
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
      {confirmingBooking && (
  <ConfirmBookingModal
    booking={confirmingBooking}
    loading={confirmBookingLoading}
    onClose={() => {
      if (!confirmBookingLoading) {
        setConfirmingBooking(null);
        setError("");
      }
    }}
    onConfirm={handleConfirmBooking}
  />
)}
{cancellingBooking && (
  <CancelManagerBookingModal
    booking={cancellingBooking}
    loading={cancelBookingLoading}
    onClose={() => {
      if (!cancelBookingLoading) {
        setCancellingBooking(null);
        setError("");
      }
    }}
   onCancel={handleCancelBooking}
  />
)}
{deletingBooking && (
  <DeleteManagerBookingModal
    booking={deletingBooking}
    loading={deleteBookingLoading}
    onClose={() => {
      if (!deleteBookingLoading) {
        setDeletingBooking(null);
        setError("");
      }
    }}
   onDelete={handleDeleteBooking}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerBookings;