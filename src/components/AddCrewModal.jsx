import { useState } from "react";
import {
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import "./AddCrewModal.css";

function AddCrewModal({
  role,
  onClose,
  onSave,
  loading,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] =
    useState("");
  const [availabilityStatus, setAvailabilityStatus] =
    useState("AVAILABLE");

  const title =
    role === "GUIDE"
      ? "Add new guide"
      : "Add new driver";

  const handleSubmit = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phoneNumber.trim()
    ) {
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      role,
      availabilityStatus,
    });
  };

  return (
    <div className="add-crew-overlay">
      <div className="add-crew-modal">
        <div className="add-crew-header">
          <div>
            <span>CREW MANAGEMENT</span>
            <h2>{title}</h2>
          </div>

          <button
            type="button"
            className="add-crew-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="add-crew-summary">
          <div className="add-crew-summary-icon">
            <UserRound size={21} />
          </div>

          <div>
            <strong>
              {role === "GUIDE"
                ? "Safari guide"
                : "Safari driver"}
            </strong>

            <span>
              Register a new crew member
            </span>
          </div>
        </div>

        <div className="add-crew-form">
          <div className="add-crew-field">
            <label htmlFor="crew-name">
              Full name
            </label>

            <div className="add-crew-input">
              <UserRound size={18} />

              <input
                id="crew-name"
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          </div>

          <div className="add-crew-field">
            <label htmlFor="crew-email">
              Email address
            </label>

            <div className="add-crew-input">
              <Mail size={18} />

              <input
                id="crew-email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>
          </div>

          <div className="add-crew-field">
            <label htmlFor="crew-phone">
              Phone number
            </label>

            <div className="add-crew-input">
              <Phone size={18} />

              <input
                id="crew-phone"
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="add-crew-field">
            <label htmlFor="crew-status">
              Availability
            </label>

            <select
              id="crew-status"
              value={availabilityStatus}
              onChange={(event) =>
                setAvailabilityStatus(
                  event.target.value
                )
              }
            >
              <option value="AVAILABLE">
                Available
              </option>

              <option value="BUSY">
                Busy
              </option>

              <option value="UNAVAILABLE">
                Unavailable
              </option>
            </select>
          </div>
        </div>

        <div className="add-crew-actions">
          <button
            type="button"
            className="add-crew-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="add-crew-save"
            onClick={handleSubmit}
            disabled={
              loading ||
              !name.trim() ||
              !email.trim() ||
              !phoneNumber.trim()
            }
          >
            {loading
              ? "Adding..."
              : role === "GUIDE"
                ? "Add guide"
                : "Add driver"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCrewModal;