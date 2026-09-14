import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Compass,
  Ship,
  UserRound,
  X,
} from "lucide-react";

import "./EditTripModal.css";

function EditTripModal({
  trip,
  boats,
  guides,
  drivers,
  loading,
  onClose,
  onSave,
}) {
  const [tripDate, setTripDate] = useState(
    trip?.tripDate || ""
  );

  const [startTime, setStartTime] = useState(
    trip?.startTime?.slice(0, 5) || ""
  );

  const [endTime, setEndTime] = useState(
    trip?.endTime?.slice(0, 5) || ""
  );

  const [boatId, setBoatId] = useState(
    trip?.boat?.id || ""
  );

  const [guideId, setGuideId] = useState(
    trip?.guide?.id || ""
  );

  const [driverId, setDriverId] = useState(
    trip?.driver?.id || ""
  );

  const [status, setStatus] = useState(
    trip?.status || "SCHEDULED"
  );

  if (!trip) {
    return null;
  }

  const handleSubmit = () => {
    if (
      !tripDate ||
      !startTime ||
      !endTime ||
      !boatId ||
      !guideId ||
      !driverId ||
      endTime <= startTime
    ) {
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
    <div className="edit-trip-overlay">
      <div className="edit-trip-modal">
        <div className="edit-trip-header">
          <div>
            <span>TRIP MANAGEMENT</span>

            <h2>Edit trip schedule</h2>
          </div>

          <button
            type="button"
            className="edit-trip-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-trip-summary">
          <div className="edit-trip-summary-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <strong>
              Trip #{trip.id}
            </strong>

            <span>
              Update safari schedule details
            </span>
          </div>
        </div>

        <div className="edit-trip-form">
          <div className="edit-trip-field">
            <label htmlFor="edit-trip-date">
              Trip date
            </label>

            <div className="edit-trip-input">
              <CalendarDays size={18} />

              <input
                id="edit-trip-date"
                type="date"
                value={tripDate}
                onChange={(event) =>
                  setTripDate(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-trip-time-grid">
            <div className="edit-trip-field">
              <label htmlFor="edit-trip-start">
                Start time
              </label>

              <div className="edit-trip-input">
                <Clock3 size={18} />

                <input
                  id="edit-trip-start"
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

            <div className="edit-trip-field">
              <label htmlFor="edit-trip-end">
                End time
              </label>

              <div className="edit-trip-input">
                <Clock3 size={18} />

                <input
                  id="edit-trip-end"
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

          <div className="edit-trip-field">
            <label htmlFor="edit-trip-boat">
              Boat
            </label>

            <div className="edit-trip-select-wrapper">
              <Ship size={18} />

              <select
                id="edit-trip-boat"
                value={boatId}
                onChange={(event) =>
                  setBoatId(event.target.value)
                }
              >
                {boats.map((boat) => (
                  <option
                    key={boat.id}
                    value={boat.id}
                  >
                    {boat.boatName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="edit-trip-field">
            <label htmlFor="edit-trip-guide">
              Guide
            </label>

            <div className="edit-trip-select-wrapper">
              <Compass size={18} />

              <select
                id="edit-trip-guide"
                value={guideId}
                onChange={(event) =>
                  setGuideId(event.target.value)
                }
              >
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

          <div className="edit-trip-field">
            <label htmlFor="edit-trip-driver">
              Driver
            </label>

            <div className="edit-trip-select-wrapper">
              <UserRound size={18} />

              <select
                id="edit-trip-driver"
                value={driverId}
                onChange={(event) =>
                  setDriverId(event.target.value)
                }
              >
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

          <div className="edit-trip-field">
            <label htmlFor="edit-trip-status">
              Status
            </label>

            <select
              id="edit-trip-status"
              className="edit-trip-status-select"
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

        <div className="edit-trip-actions">
          <button
            type="button"
            className="edit-trip-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-trip-save"
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
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTripModal;