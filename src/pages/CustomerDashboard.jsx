import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  MapPin,
  ShipWheel,
  Sparkles,
  TicketCheck,
  Waves,
} from "lucide-react";

import api from "../services/api";
import CustomerLayout from "../layouts/CustomerLayout";

import "./CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

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

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED"
  );

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "PENDING"
  );

 const upcomingBookings = bookings
  .filter((booking) => {
    if (booking.status === "CANCELLED") {
      return false;
    }

    const tripStart = new Date(
      `${booking.tripSchedule.tripDate}T${booking.tripSchedule.startTime}`
    );

    return tripStart > new Date();
  })
  .sort((a, b) => {
    const firstDate = new Date(
      `${a.tripSchedule.tripDate}T${a.tripSchedule.startTime}`
    );

    const secondDate = new Date(
      `${b.tripSchedule.tripDate}T${b.tripSchedule.startTime}`
    );

    return firstDate - secondDate;
  });

  const nextBooking =
    upcomingBookings.length > 0
      ? upcomingBookings[0]
      : null;

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <CustomerLayout>
      <div className="dashboard-page">
        <section className="dashboard-welcome">
          <div>
            <div className="welcome-label">
              <Sparkles size={15} />
              CUSTOMER DASHBOARD
            </div>

            <h1>
              Welcome back,
              <span>
                {" "}
                {user.name?.split(" ")[0] ||
                  "Explorer"}
              </span>
              .
            </h1>

            <p>
              Your next water adventure is only a few
              clicks away. Explore trips, manage your
              bookings and stay ready for the journey.
            </p>
          </div>

          <button
            className="explore-button"
            onClick={() =>
              navigate("/customer/trips")
            }
          >
            Explore trips
            <ArrowRight size={18} />
          </button>
        </section>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon stat-icon-teal">
              <TicketCheck size={21} />
            </div>

            <div className="stat-card-content">
              <span>Total bookings</span>

              <strong>
                {loading
                  ? "—"
                  : bookings.length}
              </strong>

              <small>
                All safari reservations
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <CheckCircle2 size={21} />
            </div>

            <div className="stat-card-content">
              <span>Confirmed</span>

              <strong>
                {loading
                  ? "—"
                  : confirmedBookings.length}
              </strong>

              <small>
                Ready for adventure
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-amber">
              <Clock3 size={21} />
            </div>

            <div className="stat-card-content">
              <span>Pending</span>

              <strong>
                {loading
                  ? "—"
                  : pendingBookings.length}
              </strong>

              <small>
                Awaiting confirmation
              </small>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="next-trip-card">
            <div className="card-heading-row">
              <div>
                <span className="section-eyebrow">
                  NEXT ADVENTURE
                </span>

                <h2>Your upcoming safari</h2>
              </div>

              <div className="water-icon">
                <Waves size={22} />
              </div>
            </div>

            {loading ? (
              <div className="dashboard-empty">
                Loading your next trip...
              </div>
            ) : nextBooking ? (
              <div className="next-trip-content">
                <div className="trip-primary">
                  <div className="trip-date-box">
                    <span>
                      {new Date(
                        `${nextBooking.tripSchedule.tripDate}T00:00:00`
                      )
                        .toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                          }
                        )
                        .toUpperCase()}
                    </span>

                    <strong>
                      {new Date(
                        `${nextBooking.tripSchedule.tripDate}T00:00:00`
                      ).getDate()}
                    </strong>
                  </div>

                  <div>
                    <span
                      className={`booking-status ${
                        nextBooking.status.toLowerCase()
                      }`}
                    >
                      {nextBooking.status}
                    </span>

                    <h3>
                      {
                        nextBooking.tripSchedule
                          .boat.boatName
                      }
                    </h3>

                    <p>
                      {
                        nextBooking.tripSchedule
                          .boat.boatType
                      }
                    </p>
                  </div>
                </div>

                <div className="trip-details-grid">
                  <div className="trip-detail">
                    <CalendarDays size={18} />

                    <div>
                      <span>Date</span>
                      <strong>
                        {formatDate(
                          nextBooking.tripSchedule
                            .tripDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="trip-detail">
                    <Clock3 size={18} />

                    <div>
                      <span>Departure</span>
                      <strong>
                        {formatTime(
                          nextBooking.tripSchedule
                            .startTime
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="trip-detail">
                    <ShipWheel size={18} />

                    <div>
                      <span>Guests</span>
                      <strong>
                        {
                          nextBooking.numberOfPassengers
                        }{" "}
                        passengers
                      </strong>
                    </div>
                  </div>

                  <div className="trip-detail">
                    <Compass size={18} />

                    <div>
                      <span>Guide</span>
                      <strong>
                        {
                          nextBooking.tripSchedule
                            .guide.name
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  className="trip-details-button"
                  onClick={() =>
                    navigate(
                      "/customer/bookings"
                    )
                  }
                >
                  View booking
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div className="dashboard-empty">
                <Compass size={31} />

                <h3>No upcoming safari yet</h3>

                <p>
                  Discover available boat safari trips and
                  reserve your first adventure.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      "/customer/trips"
                    )
                  }
                >
                  Explore trips
                </button>
              </div>
            )}
          </div>

          <div className="quick-actions-card">
            <span className="section-eyebrow">
              QUICK ACCESS
            </span>

            <h2>Where would you like to go?</h2>

            <div className="quick-actions">
              <button
                onClick={() =>
                  navigate(
                    "/customer/trips"
                  )
                }
              >
                <div className="quick-icon">
                  <Compass size={20} />
                </div>

                <div>
                  <strong>
                    Discover trips
                  </strong>

                  <span>
                    Find your next safari
                  </span>
                </div>

                <ArrowRight size={17} />
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/customer/bookings"
                  )
                }
              >
                <div className="quick-icon">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <strong>
                    My bookings
                  </strong>

                  <span>
                    Manage reservations
                  </span>
                </div>

                <ArrowRight size={17} />
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/customer/payments"
                  )
                }
              >
                <div className="quick-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <strong>
                    Payments
                  </strong>

                  <span>
                    View payment details
                  </span>
                </div>

                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}

export default CustomerDashboard;