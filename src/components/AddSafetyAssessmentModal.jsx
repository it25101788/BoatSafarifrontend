import { useState } from "react";
import {
  CalendarClock,
  CloudSun,
  ShieldCheck,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

import "./AddSafetyAssessmentModal.css";

function AddSafetyAssessmentModal({
  trips,
  loading,
  onClose,
  onSave,
}) {
  const [tripId, setTripId] = useState("");
  const [weatherCondition, setWeatherCondition] =
    useState("");

  const [temperature, setTemperature] =
    useState("");

  const [windSpeed, setWindSpeed] =
    useState("");

  const [safetyStatus, setSafetyStatus] =
    useState("SAFE");

  const [safetyNotes, setSafetyNotes] =
    useState("");

  const [checkedAt, setCheckedAt] =
    useState("");

  const [validationError, setValidationError] =
    useState("");

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
    <div className="add-safety-overlay">
      <div className="add-safety-modal">
        <div className="add-safety-header">
          <div>
            <span>SAFETY MONITORING</span>

            <h2>Add assessment</h2>
          </div>

          <button
            type="button"
            className="add-safety-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="add-safety-summary">
          <div className="add-safety-summary-icon">
            <CloudSun size={22} />
          </div>

          <div>
            <strong>
              New weather & safety check
            </strong>

            <span>
              Record conditions for a safari trip
            </span>
          </div>
        </div>

        {validationError && (
          <div className="add-safety-error">
            {validationError}
          </div>
        )}

        <div className="add-safety-form">
          <div className="add-safety-field">
            <label htmlFor="safety-trip">
              Trip schedule
            </label>

            <div className="add-safety-select-wrapper">
              <CalendarClock size={18} />

              <select
                id="safety-trip"
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

          <div className="add-safety-field">
            <label htmlFor="weather-condition">
              Weather condition
            </label>

            <div className="add-safety-input">
              <CloudSun size={18} />

              <input
                id="weather-condition"
                type="text"
                placeholder="e.g. Clear"
                value={weatherCondition}
                onChange={(event) =>
                  setWeatherCondition(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="add-safety-row">
            <div className="add-safety-field">
              <label htmlFor="temperature">
                Temperature (°C)
              </label>

              <div className="add-safety-input">
                <Thermometer size={18} />

                <input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="29.5"
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="add-safety-field">
              <label htmlFor="wind-speed">
                Wind speed (km/h)
              </label>

              <div className="add-safety-input">
                <Wind size={18} />

                <input
                  id="wind-speed"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="12"
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

          <div className="add-safety-field">
            <label htmlFor="safety-status">
              Safety status
            </label>

            <div className="add-safety-select-wrapper">
              <ShieldCheck size={18} />

              <select
                id="safety-status"
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

          <div className="add-safety-field">
            <label htmlFor="checked-at">
              Checked date & time
            </label>

            <div className="add-safety-input">
              <CalendarClock size={18} />

              <input
                id="checked-at"
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

          <div className="add-safety-field">
            <label htmlFor="safety-notes">
              Safety notes
            </label>

            <textarea
              id="safety-notes"
              rows="4"
              placeholder={
                safetyStatus === "SAFE"
                  ? "Optional notes..."
                  : "Required for this safety status..."
              }
              value={safetyNotes}
              onChange={(event) =>
                setSafetyNotes(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        <div className="add-safety-actions">
          <button
            type="button"
            className="add-safety-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="add-safety-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Add assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSafetyAssessmentModal;