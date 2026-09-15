import { useState } from "react";
import {
  CalendarClock,
  CloudSun,
  ShieldCheck,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

import "./EditSafetyAssessmentModal.css";

function EditSafetyAssessmentModal({
  record,
  trips,
  loading,
  onClose,
  onSave,
}) {
  const [tripId, setTripId] = useState(
    record?.tripSchedule?.id || ""
  );

  const [weatherCondition, setWeatherCondition] =
    useState(record?.weatherCondition || "");

  const [temperature, setTemperature] =
    useState(record?.temperature ?? "");

  const [windSpeed, setWindSpeed] =
    useState(record?.windSpeed ?? "");

  const [safetyStatus, setSafetyStatus] =
    useState(record?.safetyStatus || "SAFE");

  const [safetyNotes, setSafetyNotes] =
    useState(record?.safetyNotes || "");

  const [checkedAt, setCheckedAt] =
    useState(
      record?.checkedAt
        ? String(record.checkedAt).slice(0, 16)
        : ""
    );

  const [validationError, setValidationError] =
    useState("");

  if (!record) {
    return null;
  }

  const handleSubmit = () => {
    setValidationError("");

    if (!tripId) {
      setValidationError(
        "Please select a trip schedule."
      );
      return;
    }

    if (!weatherCondition.trim()) {
      setValidationError(
        "Weather condition is required."
      );
      return;
    }

    if (temperature === "") {
      setValidationError(
        "Temperature is required."
      );
      return;
    }

    if (
      windSpeed === "" ||
      Number(windSpeed) < 0
    ) {
      setValidationError(
        "Enter a valid wind speed."
      );
      return;
    }

    if (!checkedAt) {
      setValidationError(
        "Checked date and time is required."
      );
      return;
    }

    if (
      (safetyStatus === "CAUTION" ||
        safetyStatus === "UNSAFE") &&
      !safetyNotes.trim()
    ) {
      setValidationError(
        "Safety notes are required for CAUTION or UNSAFE status."
      );
      return;
    }

    onSave({
      weatherCondition:
        weatherCondition.trim(),

      temperature:
        Number(temperature),

      windSpeed:
        Number(windSpeed),

      safetyStatus,

      safetyNotes:
        safetyNotes.trim(),

      checkedAt:
        checkedAt.length === 16
          ? `${checkedAt}:00`
          : checkedAt,

      tripSchedule: {
        id: Number(tripId),
      },
    });
  };

  return (
    <div className="edit-safety-overlay">
      <div className="edit-safety-modal">
        <div className="edit-safety-header">
          <div>
            <span>SAFETY MONITORING</span>

            <h2>Edit assessment</h2>
          </div>

          <button
            type="button"
            className="edit-safety-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-safety-summary">
          <div className="edit-safety-summary-icon">
            <CloudSun size={22} />
          </div>

          <div>
            <strong>
              Assessment #{record.id}
            </strong>

            <span>
              Update weather and safety details
            </span>
          </div>
        </div>

        {validationError && (
          <div className="edit-safety-error">
            {validationError}
          </div>
        )}

        <div className="edit-safety-form">
          <div className="edit-safety-field">
            <label htmlFor="edit-safety-trip">
              Trip schedule
            </label>

            <div className="edit-safety-select-wrapper">
              <CalendarClock size={18} />

              <select
                id="edit-safety-trip"
                value={tripId}
                onChange={(event) =>
                  setTripId(event.target.value)
                }
              >
                <option value="">
                  Select trip
                </option>

                {trips.map((trip) => (
                  <option
                    value={trip.id}
                    key={trip.id}
                  >
                    Trip #{trip.id} —{" "}
                    {trip.boat?.boatName ||
                      "Boat"}{" "}
                    — {trip.tripDate}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="edit-safety-field">
            <label htmlFor="edit-weather-condition">
              Weather condition
            </label>

            <div className="edit-safety-input">
              <CloudSun size={18} />

              <input
                id="edit-weather-condition"
                type="text"
                value={weatherCondition}
                onChange={(event) =>
                  setWeatherCondition(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="edit-safety-row">
            <div className="edit-safety-field">
              <label htmlFor="edit-temperature">
                Temperature (°C)
              </label>

              <div className="edit-safety-input">
                <Thermometer size={18} />

                <input
                  id="edit-temperature"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="edit-safety-field">
              <label htmlFor="edit-wind-speed">
                Wind speed (km/h)
              </label>

              <div className="edit-safety-input">
                <Wind size={18} />

                <input
                  id="edit-wind-speed"
                  type="number"
                  min="0"
                  step="0.1"
                  value={windSpeed}
                  onChange={(event) =>
                    setWindSpeed(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="edit-safety-field">
            <label htmlFor="edit-safety-status">
              Safety status
            </label>

            <div className="edit-safety-select-wrapper">
              <ShieldCheck size={18} />

              <select
                id="edit-safety-status"
                value={safetyStatus}
                onChange={(event) =>
                  setSafetyStatus(
                    event.target.value
                  )
                }
              >
                <option value="SAFE">
                  Safe
                </option>

                <option value="CAUTION">
                  Caution
                </option>

                <option value="UNSAFE">
                  Unsafe
                </option>
              </select>
            </div>
          </div>

          <div className="edit-safety-field">
            <label htmlFor="edit-checked-at">
              Checked date & time
            </label>

            <div className="edit-safety-input">
              <CalendarClock size={18} />

              <input
                id="edit-checked-at"
                type="datetime-local"
                value={checkedAt}
                onChange={(event) =>
                  setCheckedAt(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="edit-safety-field">
            <label htmlFor="edit-safety-notes">
              Safety notes
            </label>

            <textarea
              id="edit-safety-notes"
              rows="4"
              value={safetyNotes}
              onChange={(event) =>
                setSafetyNotes(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        <div className="edit-safety-actions">
          <button
            type="button"
            className="edit-safety-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-safety-save"
            onClick={handleSubmit}
            disabled={loading}
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

export default EditSafetyAssessmentModal;