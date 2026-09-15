import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Ship,
  Users,
  X,
} from "lucide-react";

import api from "../services/api";

import "./BookingModal.css";

function BookingModal({
  trip,
  onClose,
}) {
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!trip) {
    return null;
  }

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleBooking = async () => {
    setError("");

    const passengerCount = Number(passengers);

    if (
      !passengerCount ||
      passengerCount < 1
    ) {
      setError(
        "Please select at least 1 passenger."
      );
      return;
    }

    if (
      passengerCount >
      trip.boat.capacity
    ) {
      setError(
        `Maximum boat capacity is ${trip.boat.capacity} passengers.`
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/bookings", {
        numberOfPassengers: passengerCount,

        customer: {
          id: user.id,
        },

        tripSchedule: {
          id: trip.id,
        },
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        {success ? (
          <div className="booking-success">
            <div className="booking-success-icon">
              <CheckCircle2 size={34} />
            </div>

            <span>BOOKING CREATED</span>

            <h2>Your safari is reserved!</h2>

            <p>
              Your booking has been created successfully
              and is now waiting for manager confirmation.
            </p>

            <button
              type="button"
              className="booking-confirm-button"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="booking-modal-header">
              <div>
                <span>BOOK YOUR SAFARI</span>
                <h2>{trip.boat.boatName}</h2>
              </div>

              <button
                className="modal-close-button"
                onClick={onClose}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="booking-trip-summary">
              <div className="booking-summary-icon">
                <Ship size={25} />
              </div>

              <div>
                <strong>
                  {trip.boat.boatType}
                </strong>

                <span>
                  Trip #{trip.id}
                </span>
              </div>
            </div>

            <div className="booking-modal-details">
              <div>
                <CalendarDays size={18} />

                <span>
                  <small>Date</small>

                  <strong>
                    {trip.tripDate}
                  </strong>
                </span>
              </div>

              <div>
                <Clock3 size={18} />

                <span>
                  <small>Time</small>

                  <strong>
                    {trip.startTime}
                    {" – "}
                    {trip.endTime}
                  </strong>
                </span>
              </div>

              <div>
                <Users size={18} />

                <span>
                  <small>
                    Boat capacity
                  </small>

                  <strong>
                    {trip.boat.capacity} guests
                  </strong>
                </span>
              </div>
            </div>

            <div className="booking-passenger-section">
              <label htmlFor="passengers">
                Number of passengers
              </label>

              <input
                id="passengers"
                type="number"
                min="1"
                max={trip.boat.capacity}
                value={passengers}
                onChange={(event) =>
                  setPassengers(
                    event.target.value
                  )
                }
              />

              <p>
                Select how many people will join this safari.
              </p>
            </div>

            {error && (
              <div className="booking-modal-error">
                {error}
              </div>
            )}

            <div className="booking-modal-actions">
              <button
                type="button"
                className="booking-cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="booking-confirm-button"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading
                  ? "Creating booking..."
                  : "Confirm booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;