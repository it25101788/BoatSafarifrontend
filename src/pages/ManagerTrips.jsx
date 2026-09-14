import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Compass,
  Plus,
  Ship,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import AddTripModal from "../components/AddTripModal";
import EditTripModal from "../components/EditTripModal";
import DeleteTripModal from "../components/DeleteTripModal";

import "./ManagerTrips.css";

function ManagerTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boats, setBoats] = useState([]);
  const [guides, setGuides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [addTripLoading, setAddTripLoading] =useState(false);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editTripLoading, setEditTripLoading] = useState(false);
  const [deletingTrip, setDeletingTrip] = useState(null);
  const [deleteTripLoading, setDeleteTripLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  const loadTripData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        tripsResponse,
        boatsResponse,
        crewResponse,
      ] = await Promise.all([
        api.get("/trip-schedules"),
        api.get("/boats"),
        api.get("/guide-drivers"),
      ]);

      setTrips(tripsResponse.data);

      const availableBoats =
        boatsResponse.data.filter(
          (boat) =>
            boat.status === "AVAILABLE"
        );

      const availableGuides =
        crewResponse.data.filter(
          (member) =>
            member.role === "GUIDE" &&
            member.availabilityStatus ===
              "AVAILABLE"
        );

      const availableDrivers =
        crewResponse.data.filter(
          (member) =>
            member.role === "DRIVER" &&
            member.availabilityStatus ===
              "AVAILABLE"
        );

      setBoats(availableBoats);
      setGuides(availableGuides);
      setDrivers(availableDrivers);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load trip information."
      );
    } finally {
      setLoading(false);
    }
  };

  loadTripData();
}, []);

  const scheduledTrips = trips.filter(
    (trip) => trip.status === "SCHEDULED"
  ).length;

  const completedTrips = trips.filter(
    (trip) => trip.status === "COMPLETED"
  ).length;

  const cancelledTrips = trips.filter(
    (trip) => trip.status === "CANCELLED"
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
  const handleAddTrip = async (tripData) => {
  try {
    setAddTripLoading(true);
    setError("");

    const response = await api.post(
      "/trip-schedules",
      tripData
    );

    setTrips((currentTrips) => [
      ...currentTrips,
      response.data,
    ]);

    setShowAddTrip(false);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to schedule trip."
    );
  } finally {
    setAddTripLoading(false);
  }
};
const handleUpdateTrip = async (tripData) => {
  if (!editingTrip) {
    return;
  }

  try {
    setEditTripLoading(true);
    setError("");

    const response = await api.put(
      `/trip-schedules/${editingTrip.id}`,
      tripData
    );

    setTrips((currentTrips) =>
      currentTrips.map((trip) =>
        trip.id === editingTrip.id
          ? response.data
          : trip
      )
    );

    setEditingTrip(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update trip schedule."
    );
  } finally {
    setEditTripLoading(false);
  }
};
const handleDeleteTrip = async () => {
  if (!deletingTrip) {
    return;
  }

  try {
    setDeleteTripLoading(true);
    setError("");

    await api.delete(
      `/trip-schedules/${deletingTrip.id}`
    );

    setTrips((currentTrips) =>
      currentTrips.filter(
        (trip) =>
          trip.id !== deletingTrip.id
      )
    );

    setDeletingTrip(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete trip schedule."
    );
  } finally {
    setDeleteTripLoading(false);
  }
};

  return (
    <ManagerLayout>
      <div className="manager-trips-page">
        <section className="manager-trips-header">
          <div>
            <div className="manager-trips-eyebrow">
              <CalendarDays size={15} />
              TRIP MANAGEMENT
            </div>

            <h1>Trip schedules</h1>

            <p>
              Plan safari departures, assign boats and
              crew, and manage trip status.
            </p>
          </div>

         <button
  type="button"
  className="manager-add-trip-button"
  onClick={() => setShowAddTrip(true)}
>
  <Plus size={17} />
  Schedule trip
</button>
        </section>

        {error && (
          <div className="manager-trips-error">
            {error}
          </div>
        )}

        <section className="manager-trip-stats">
          <article className="manager-trip-stat">
            <div className="manager-trip-stat-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Total trips</span>

              <strong>
                {loading ? "—" : trips.length}
              </strong>

              <small>
                All trip schedules
              </small>
            </div>
          </article>

          <article className="manager-trip-stat">
            <div className="manager-trip-stat-icon scheduled">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Scheduled</span>

              <strong>
                {loading
                  ? "—"
                  : scheduledTrips}
              </strong>

              <small>
                Upcoming or scheduled trips
              </small>
            </div>
          </article>

          <article className="manager-trip-stat">
            <div className="manager-trip-stat-icon completed">
              <Compass size={21} />
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {loading
                  ? "—"
                  : completedTrips}
              </strong>

              <small>
                Finished safari trips
              </small>
            </div>
          </article>

          <article className="manager-trip-stat">
            <div className="manager-trip-stat-icon cancelled">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Cancelled</span>

              <strong>
                {loading
                  ? "—"
                  : cancelledTrips}
              </strong>

              <small>
                Cancelled schedules
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-trips-loading">
            Loading trip schedules...
          </div>
        ) : trips.length === 0 ? (
          <div className="manager-trips-empty">
            <CalendarDays size={38} />

            <h2>No trip schedules</h2>

            <p>
              Create the first safari schedule to
              begin managing departures.
            </p>
          </div>
        ) : (
          <section className="manager-trips-grid">
            {trips.map((trip) => (
              <article
                className="manager-trip-card"
                key={trip.id}
              >
                <div className="manager-trip-card-top">
                  <div>
                    <span>
                      TRIP #{trip.id}
                    </span>

                    <h2>
                      {trip.boat?.boatName ||
                        "Boat not assigned"}
                    </h2>
                  </div>

                  <span
                    className={`manager-trip-status ${trip.status.toLowerCase()}`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="manager-trip-date">
                  <CalendarDays size={18} />

                  <div>
                    <span>Trip date</span>

                    <strong>
                      {formatDate(trip.tripDate)}
                    </strong>
                  </div>
                </div>

                <div className="manager-trip-details-grid">
                  <div>
                    <Clock3 size={17} />

                    <span>Time</span>

                    <strong>
                      {formatTime(trip.startTime)}
                      {" – "}
                      {formatTime(trip.endTime)}
                    </strong>
                  </div>

                  <div>
                    <Ship size={17} />

                    <span>Boat</span>

                    <strong>
                      {trip.boat?.boatName || "—"}
                    </strong>
                  </div>

                  <div>
                    <Compass size={17} />

                    <span>Guide</span>

                    <strong>
                      {trip.guide?.name || "—"}
                    </strong>
                  </div>

                  <div>
                    <UserRound size={17} />

                    <span>Driver</span>

                    <strong>
                      {trip.driver?.name || "—"}
                    </strong>
                  </div>
                </div>

                <div className="manager-trip-actions">
                 <button
  type="button"
  className="manager-trip-edit"
  onClick={() => setEditingTrip(trip)}
>
  Edit
</button>

                 <button
  type="button"
  className="manager-trip-delete"
  onClick={() => setDeletingTrip(trip)}
>
  Delete
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
     {showAddTrip && (
  <AddTripModal
    boats={boats}
    guides={guides}
    drivers={drivers}
    loading={addTripLoading}
    onClose={() => {
      if (!addTripLoading) {
        setShowAddTrip(false);
        setError("");
      }
    }}
    onSave={handleAddTrip}
  />
)}
{editingTrip && (
  <EditTripModal
    trip={editingTrip}
    boats={boats}
    guides={guides}
    drivers={drivers}
    loading={editTripLoading}
    onClose={() => {
      if (!editTripLoading) {
        setEditingTrip(null);
        setError("");
      }
    }}
   onSave={handleUpdateTrip}
  />
)}
{deletingTrip && (
  <DeleteTripModal
    trip={deletingTrip}
    loading={deleteTripLoading}
    onClose={() => {
      if (!deleteTripLoading) {
        setDeletingTrip(null);
        setError("");
      }
    }}
    onDelete={handleDeleteTrip}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerTrips;