import { useState } from "react";
import {
  Ship,
  Users,
  X,
} from "lucide-react";

import "./AddBoatModal.css";

function AddBoatModal({
  onClose,
  onSave,
  loading,
}) {
  const [boatName, setBoatName] = useState("");
  const [boatType, setBoatType] =
    useState("Safari Boat");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] =
    useState("AVAILABLE");

  const handleSubmit = () => {
    if (
      !boatName.trim() ||
      !boatType.trim() ||
      !capacity
    ) {
      return;
    }

    onSave({
      boatName: boatName.trim(),
      boatType: boatType.trim(),
      capacity: Number(capacity),
      status,
    });
  };

  return (
    <div className="add-boat-overlay">
      <div className="add-boat-modal">
        <div className="add-boat-header">
          <div>
            <span>FLEET MANAGEMENT</span>
            <h2>Add new boat</h2>
          </div>

          <button
            type="button"
            className="add-boat-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="add-boat-summary">
          <div className="add-boat-summary-icon">
            <Ship size={21} />
          </div>

          <div>
            <strong>New safari vessel</strong>

            <span>
              Register a boat in the fleet
            </span>
          </div>
        </div>

        <div className="add-boat-form">
          <div className="add-boat-field">
            <label htmlFor="boat-name">
              Boat name
            </label>

            <input
              id="boat-name"
              type="text"
              placeholder="e.g. Ocean Explorer"
              value={boatName}
              onChange={(event) =>
                setBoatName(event.target.value)
              }
            />
          </div>

          <div className="add-boat-field">
            <label htmlFor="boat-type">
              Boat type
            </label>

            <input
              id="boat-type"
              type="text"
              value={boatType}
              onChange={(event) =>
                setBoatType(event.target.value)
              }
            />
          </div>

          <div className="add-boat-field">
            <label htmlFor="boat-capacity">
              Passenger capacity
            </label>

            <div className="add-boat-capacity-input">
              <Users size={18} />

              <input
                id="boat-capacity"
                type="number"
                min="1"
                placeholder="Enter capacity"
                value={capacity}
                onChange={(event) =>
                  setCapacity(event.target.value)
                }
              />
            </div>
          </div>

          <div className="add-boat-field">
            <label htmlFor="boat-status">
              Status
            </label>

            <select
              id="boat-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="AVAILABLE">
                Available
              </option>

              <option value="MAINTENANCE">
                Maintenance
              </option>

              <option value="UNAVAILABLE">
                Unavailable
              </option>
            </select>
          </div>
        </div>

        <div className="add-boat-actions">
          <button
            type="button"
            className="add-boat-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="add-boat-save"
            onClick={handleSubmit}
            disabled={
              loading ||
              !boatName.trim() ||
              !boatType.trim() ||
              !capacity ||
              Number(capacity) < 1
            }
          >
            {loading
              ? "Adding..."
              : "Add boat"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBoatModal;