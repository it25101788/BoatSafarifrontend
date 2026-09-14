import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Compass,
  Ship,
  UserRound,
  X,
} from "lucide-react";

import "./AddTripModal.css";

function AddTripModal({
  boats,
  guides,
  drivers,
  loading,
  onClose,
  onSave,
}) {
  const [tripDate, setTripDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [boatId, setBoatId] = useState("");
  const [guideId, setGuideId] = useState("");
  const [driverId, setDriverId] = useState("");

  const [status, setStatus] =
    useState("SCHEDULED");

  const handleSubmit = () => {
    if (
      !tripDate ||
      !startTime ||
      !endTime ||
      !boatId ||
      !guideId ||
      !driverId
    ) {
      return;
    }

    if (endTime <= startTime) {
      return;
    }

    onSave({
      tripDate,
      startTime,
      endTime,
      status,

      boat: {
        id: Number(boatId),
      },

      guide: {
        id: Number(guideId),
      },

      driver: {
        id: Number(driverId),
      },
    });
  };

  return (
    <div className="add-trip-overlay">
      <div className="add-trip-modal">
        <div className="add-trip-header">
          <div>
            <span>TRIP MANAGEMENT</span>
            <h2>Schedule new trip</h2>
          </div>

          <button
            type="button"
            className="add-trip-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="add-trip-summary">
          <div className="add-trip-summary-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <strong>New safari schedule</strong>
            <span>
              Assign a boat and available crew
            </span>
          </div>
        </div>

        <div className="add-trip-form">
          <div className="add-trip-field">
            <label htmlFor="trip-date">
              Trip date
            </label>

            <div className="add-trip-input">
              <CalendarDays size={18} />

              <input
                id="trip-date"
                type="date"
                value={tripDate}
                onChange={(event) =>
                  setTripDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="add-trip-time-grid">
            <div className="add-trip-field">
              <label htmlFor="trip-start">
                Start time
              </label>

              <div className="add-trip-input">
                <Clock3 size={18} />

                <input
                  id="trip-start"
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="add-trip-field">
              <label htmlFor="trip-end">
                End time
              </label>

              <div className="add-trip-input">
                <Clock3 size={18} />

                <input
                  id="trip-end"
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="add-trip-field">
            <label htmlFor="trip-boat">
              Boat
            </label>

            <div className="add-trip-select-wrapper">
              <Ship size={18} />

              <select
                id="trip-boat"
                value={boatId}
                onChange={(event) =>
                  setBoatId(event.target.value)
                }
              >
                <option value="">
                  Select available boat
                </option>

                {boats.map((boat) => (
                  <option
                    key={boat.id}
                    value={boat.id}
                  >
                    {boat.boatName} —{" "}
                    {boat.capacity} seats
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-trip-field">
            <label htmlFor="trip-guide">
              Guide
            </label>

            <div className="add-trip-select-wrapper">
              <Compass size={18} />

              <select
                id="trip-guide"
                value={guideId}
                onChange={(event) =>
                  setGuideId(event.target.value)
                }
              >
                <option value="">
                  Select available guide
                </option>

                {guides.map((guide) => (
                  <option
                    key={guide.id}
                    value={guide.id}
                  >
                    {guide.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-trip-field">
            <label htmlFor="trip-driver">
              Driver
            </label>

            <div className="add-trip-select-wrapper">
              <UserRound size={18} />

              <select
                id="trip-driver"
                value={driverId}
                onChange={(event) =>
                  setDriverId(event.target.value)
                }
              >
                <option value="">
                  Select available driver
                </option>

                {drivers.map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-trip-field">
            <label htmlFor="trip-status">
              Status
            </label>

            <select
              id="trip-status"
              className="add-trip-status-select"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="SCHEDULED">
                Scheduled
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        <div className="add-trip-actions">
          <button
            type="button"
            className="add-trip-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="add-trip-save"
            onClick={handleSubmit}
            disabled={
              loading ||
              !tripDate ||
              !startTime ||
              !endTime ||
              !boatId ||
              !guideId ||
              !driverId ||
              endTime <= startTime
            }
          >
            {loading
              ? "Scheduling..."
              : "Schedule trip"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTripModal;