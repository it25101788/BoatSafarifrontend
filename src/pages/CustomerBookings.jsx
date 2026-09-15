import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Eye,
  Ship,
  TicketCheck,
  Users,
  XCircle,
} from "lucide-react";
import CancelBookingModal from "../components/CancelBookingModal";
import api from "../services/api";
import CustomerLayout from "../layouts/CustomerLayout";
import BookingDetailsModal from "../components/BookingDetailsModal";

import "./CustomerBookings.css";

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
const [cancelLoading, setCancelLoading] = useState(false);
const [, setCancelError] = useState("");
const [detailsBooking, setDetailsBooking] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings");

        setBookings(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Not available";

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

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const value = new Date();

    value.setHours(hours);
    value.setMinutes(minutes);

    return value.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleCancelBooking = async () => {
  if (!selectedBooking) {
    return;
  }

  try {
    setCancelLoading(true);
    setCancelError("");

    const response = await api.put(
      `/bookings/${selectedBooking.id}`,
      {
        numberOfPassengers:
          selectedBooking.numberOfPassengers,

        status: "CANCELLED",

        customer: {
          id: selectedBooking.customer.id,
        },

        tripSchedule: {
          id: selectedBooking.tripSchedule.id,
        },
      }
    );

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? response.data
          : booking
      )
    );

    setSelectedBooking(null);
  } catch (err) {
    setCancelError(
      err.response?.data?.error ||
        "Unable to cancel booking."
    );
  } finally {
    setCancelLoading(false);
  }
};

  return (
    <CustomerLayout>
      <div className="bookings-page">
        <section className="bookings-header">
          <div>
            <div className="bookings-eyebrow">
              <TicketCheck size={15} />
              MY JOURNEYS
            </div>

            <h1>My bookings</h1>

            <p>
              View your upcoming safari reservations,
              booking status and trip information.
            </p>
          </div>
        </section>

        {error && (
          <div className="bookings-error">
            {error}
          </div>
        )}

        <section className="booking-stats">
          <div className="booking-stat">
            <div className="booking-stat-icon total">
              <TicketCheck size={20} />
            </div>

            <div>
              <span>Total bookings</span>
              <strong>
                {loading ? "—" : bookings.length}
              </strong>
            </div>
          </div>

          <div className="booking-stat">
            <div className="booking-stat-icon confirmed">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Confirmed</span>
              <strong>
                {loading ? "—" : confirmedCount}
              </strong>
            </div>
          </div>

          <div className="booking-stat">
            <div className="booking-stat-icon pending">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {loading ? "—" : pendingCount}
              </strong>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="bookings-loading">
            Loading your safari bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">
            <Compass size={36} />

            <h2>No bookings yet</h2>

            <p>
              Your future safari reservations will appear
              here.
            </p>
          </div>
        ) : (
          <section className="booking-list">
            {bookings.map((booking) => (
              <article
                className="booking-card"
                key={booking.id}
              >
                <div className="booking-card-main">
                  <div className="booking-card-top">
                    <div className="booking-boat-icon">
                      <Ship size={23} />
                    </div>

                    <div className="booking-title">
                      <span>
                        BOOKING #{booking.id}
                      </span>

                      <h2>
                        {
                          booking.tripSchedule.boat
                            .boatName
                        }
                      </h2>

                      <p>
                        {
                          booking.tripSchedule.boat
                            .boatType
                        }
                      </p>
                    </div>

                    <span
                      className={`customer-booking-status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-info-grid">
                    <div className="booking-info">
                      <CalendarDays size={18} />

                      <div>
                        <span>Safari date</span>

                        <strong>
                          {formatDate(
                            booking.tripSchedule
                              .tripDate
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-info">
                      <Clock3 size={18} />

                      <div>
                        <span>Safari time</span>

                        <strong>
                          {formatTime(
                            booking.tripSchedule
                              .startTime
                          )}
                          {" – "}
                          {formatTime(
                            booking.tripSchedule
                              .endTime
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-info">
                      <Users size={18} />

                      <div>
                        <span>Passengers</span>

                        <strong>
                          {
                            booking.numberOfPassengers
                          }{" "}
                          guests
                        </strong>
                      </div>
                    </div>

                    <div className="booking-info">
                      <Compass size={18} />

                      <div>
                        <span>Guide</span>

                        <strong>
                          {
                            booking.tripSchedule.guide
                              .name
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="booking-created">
                    <span>Booked on</span>

                    <strong>
                      {formatDateTime(
                        booking.bookingDate
                      )}
                    </strong>
                  </div>
                </div>

                <div className="booking-card-actions">
                  <button
  className="booking-view-button"
  onClick={() => setDetailsBooking(booking)}
>
  <Eye size={17} />
  View details
</button>
                  {booking.status !== "CANCELLED" && (
                   <button
  className="booking-cancel-action"
  onClick={() => {
    setCancelError("");
    setSelectedBooking(booking);
  }}
>
  <XCircle size={17} />
  Cancel booking
</button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      {selectedBooking && (
  <CancelBookingModal
    booking={selectedBooking}
    loading={cancelLoading}
    onClose={() => {
      if (!cancelLoading) {
        setSelectedBooking(null);
        setCancelError("");
      }
    }}
    onConfirm={handleCancelBooking}
  />
)}
{detailsBooking && (
  <BookingDetailsModal
    booking={detailsBooking}
    onClose={() => setDetailsBooking(null)}
  />
)}
    </CustomerLayout>
  );
}

export default CustomerBookings;