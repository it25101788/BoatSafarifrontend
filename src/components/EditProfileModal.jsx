import { useState } from "react";
import {
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import "./EditProfileModal.css";

function EditProfileModal({
  profile,
  onClose,
  onSave,
  loading,
}) {
  const [name, setName] = useState(
    profile?.name || ""
  );

  const [phoneNumber, setPhoneNumber] =
    useState(
      profile?.phoneNumber || ""
    );

  if (!profile) {
    return null;
  }

  const handleSubmit = () => {
    if (
      !name.trim() ||
      !phoneNumber.trim()
    ) {
      return;
    }

    onSave({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
    });
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal">
        <div className="edit-profile-header">
          <div>
            <span>ACCOUNT SETTINGS</span>
            <h2>Edit profile</h2>
          </div>

          <button
            type="button"
            className="edit-profile-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-profile-form">
          <div className="edit-profile-field">
            <label htmlFor="profile-name">
              Full name
            </label>

            <div className="edit-profile-input">
              <UserRound size={18} />

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-profile-field">
            <label htmlFor="profile-phone">
              Phone number
            </label>

            <div className="edit-profile-input">
              <Phone size={18} />

              <input
                id="profile-phone"
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

          <div className="edit-profile-field">
            <label>Email address</label>

            <div className="edit-profile-input readonly">
              <Mail size={18} />

              <input
                type="email"
                value={profile.email}
                readOnly
              />
            </div>

            <small>
              Email cannot be changed here.
            </small>
          </div>
        </div>

        <div className="edit-profile-actions">
          <button
            type="button"
            className="edit-profile-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-profile-save"
            onClick={handleSubmit}
            disabled={
              loading ||
              !name.trim() ||
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

export default EditProfileModal;