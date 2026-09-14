import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  Ship,
  UserRound,
  Users,
} from "lucide-react";
import BookingModal from "../components/BookingModal";

import api from "../services/api";
import CustomerLayout from "../layouts/CustomerLayout";

import "./CustomerTrips.css";

function CustomerTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/trip-schedules");

        setTrips(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load safari trips."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");

    const value = new Date();

    value.setHours(hours);
    value.setMinutes(minutes);

    return value.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
/* Show only future scheduled trips */
const availableTrips = trips.filter((trip) => {
  if (trip.status !== "SCHEDULED") {
    return false;
  }

  const tripStart = new Date(
    `${trip.tripDate}T${trip.startTime}`
  );

  return tripStart > new Date();
});
  return (
    <CustomerLayout>
      <div className="trips-page">
        <section className="trips-header">
          <div>
            <div className="trips-eyebrow">
              <Compass size={15} />
              DISCOVER
            </div>

            <h1>Explore safari trips</h1>

            <p>
              Choose from available boat safari experiences
              and find the perfect journey for you.
            </p>
          </div>

          <div className="trip-count">
           <strong>{availableTrips.length}</strong>
            <span>Available trips</span>
          </div>
        </section>

        {error && (
          <div className="trips-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="trips-loading">
            Loading safari experiences...
          </div>
        ) : (
          <section className="trips-grid">
           {availableTrips.map((trip) => (
              <article
                className="trip-card"
                key={trip.id}
              >
                <div className="trip-card-top">
                  <div className="trip-card-icon">
                    <Ship size={24} />
                  </div>

                  <span
                    className={`trip-status ${trip.status.toLowerCase()}`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="trip-card-title">
                  <span>
                    TRIP #{trip.id}
                  </span>

                  <h2>
                    {trip.boat.boatName}
                  </h2>

                  <p>
                    {trip.boat.boatType}
                  </p>
                </div>

                <div className="trip-info-list">
                  <div className="trip-info-item">
                    <CalendarDays size={18} />

                    <div>
                      <span>Date</span>
                      <strong>
                        {formatDate(
                          trip.tripDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="trip-info-item">
                    <Clock3 size={18} />

                    <div>
                      <span>Safari time</span>
                      <strong>
                        {formatTime(
                          trip.startTime
                        )}{" "}
                        –{" "}
                        {formatTime(
                          trip.endTime
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="trip-info-item">
                    <Users size={18} />

                    <div>
                      <span>Boat capacity</span>
                      <strong>
                        {trip.boat.capacity} guests
                      </strong>
                    </div>
                  </div>

                  <div className="trip-info-item">
                    <UserRound size={18} />

                    <div>
                      <span>Safari guide</span>
                      <strong>
                        {trip.guide.name}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="trip-team">
                  <div>
                    <span>Guide</span>
                    <strong>
                      {trip.guide.name}
                    </strong>
                  </div>

                  <div className="team-divider" />

                  <div>
                    <span>Driver</span>
                    <strong>
                      {trip.driver.name}
                    </strong>
                  </div>
                </div>

               <button
                      className="book-trip-button"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      View & book safari
                      <ArrowRight size={18} />
                    </button>
              </article>
            ))}
          </section>
        )}
      </div>
      {selectedTrip && (
  <BookingModal
    trip={selectedTrip}
    onClose={() => setSelectedTrip(null)}
  />
)}
    </CustomerLayout>
  );
}

export default CustomerTrips;