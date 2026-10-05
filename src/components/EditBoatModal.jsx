import { useState } from "react";
import {
  Pencil,
  Ship,
  Users,
  X,
} from "lucide-react";

import "./EditBoatModal.css";

function EditBoatModal({
  boat,
  onClose,
  onSave,
  loading,
}) {
  const [boatName, setBoatName] = useState(
    boat?.boatName || ""
  );

  const [boatType, setBoatType] = useState(
    boat?.boatType || ""
  );

  const [capacity, setCapacity] = useState(
    boat?.capacity || ""
  );

  const [status, setStatus] = useState(
    boat?.status || "AVAILABLE"
  );

  if (!boat) {
    return null;
  }

  const handleSubmit = () => {
    if (
      !boatName.trim() ||
      !boatType.trim() ||
      !capacity ||
      Number(capacity) < 1
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
    <div className="edit-boat-overlay">
      <div className="edit-boat-modal">
        <div className="edit-boat-header">
          <div>
            <span>FLEET MANAGEMENT</span>
            <h2>Edit boat</h2>
          </div>

          <button
            type="button"
            className="edit-boat-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-boat-summary">
          <div className="edit-boat-summary-icon">
            <Pencil size={20} />
          </div>

          <div>
            <strong>{boat.boatName}</strong>
            <span>Boat #{boat.id}</span>
          </div>
        </div>

        <div className="edit-boat-form">
          <div className="edit-boat-field">
            <label htmlFor="edit-boat-name">
              Boat name
            </label>

            <div className="edit-boat-input">
              <Ship size={18} />

              <input
                id="edit-boat-name"
                type="text"
                value={boatName}
                onChange={(event) =>
                  setBoatName(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-boat-field">
            <label htmlFor="edit-boat-type">
              Boat type
            </label>

            <input
              id="edit-boat-type"
              type="text"
              value={boatType}
              onChange={(event) =>
                setBoatType(event.target.value)
              }
            />
          </div>

          <div className="edit-boat-field">
            <label htmlFor="edit-boat-capacity">
              Passenger capacity
            </label>

            <div className="edit-boat-input">
              <Users size={18} />

              <input
                id="edit-boat-capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(event) =>
                  setCapacity(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-boat-field">
            <label htmlFor="edit-boat-status">
              Status
            </label>

            <select
              id="edit-boat-status"
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

        <div className="edit-boat-actions">
          <button
            type="button"
            className="edit-boat-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-boat-save"
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
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditBoatModal;