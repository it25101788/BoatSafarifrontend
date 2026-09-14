import { useState } from "react";
import {
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import "./EditCrewModal.css";

function EditCrewModal({
  member,
  onClose,
  onSave,
  loading,
}) {
  const [name, setName] = useState(
    member?.name || ""
  );

  const [email, setEmail] = useState(
    member?.email || ""
  );

  const [phoneNumber, setPhoneNumber] =
    useState(
      member?.phoneNumber || ""
    );

  const [
    availabilityStatus,
    setAvailabilityStatus,
  ] = useState(
    member?.availabilityStatus ||
      "AVAILABLE"
  );

  if (!member) {
    return null;
  }

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
      role: member.role,
      availabilityStatus,
    });
  };

  return (
    <div className="edit-crew-overlay">
      <div className="edit-crew-modal">
        <div className="edit-crew-header">
          <div>
            <span>CREW MANAGEMENT</span>

            <h2>
              Edit{" "}
              {member.role === "GUIDE"
                ? "guide"
                : "driver"}
            </h2>
          </div>

          <button
            type="button"
            className="edit-crew-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-crew-summary">
          <div className="edit-crew-summary-icon">
            <UserRound size={21} />
          </div>

          <div>
            <strong>{member.name}</strong>

            <span>
              {member.role} #{member.id}
            </span>
          </div>
        </div>

        <div className="edit-crew-form">
          <div className="edit-crew-field">
            <label htmlFor="edit-crew-name">
              Full name
            </label>

            <div className="edit-crew-input">
              <UserRound size={18} />

              <input
                id="edit-crew-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-crew-field">
            <label htmlFor="edit-crew-email">
              Email address
            </label>

            <div className="edit-crew-input">
              <Mail size={18} />

              <input
                id="edit-crew-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-crew-field">
            <label htmlFor="edit-crew-phone">
              Phone number
            </label>

            <div className="edit-crew-input">
              <Phone size={18} />

              <input
                id="edit-crew-phone"
                type="text"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="edit-crew-field">
            <label htmlFor="edit-crew-status">
              Availability
            </label>

            <select
              id="edit-crew-status"
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

        <div className="edit-crew-actions">
          <button
            type="button"
            className="edit-crew-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-crew-save"
            onClick={handleSubmit}
            disabled={
              loading ||
              !name.trim() ||
              !email.trim() ||
              !phoneNumber.trim()
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

export default EditCrewModal;