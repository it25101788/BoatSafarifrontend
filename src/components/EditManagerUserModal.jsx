import { useState } from "react";
import {
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import "./EditManagerUserModal.css";

function EditManagerUserModal({
  user,
  loading,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(
    user?.name || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  const [phoneNumber, setPhoneNumber] =
    useState(user?.phoneNumber || "");

  const [role, setRole] = useState(
    user?.role || "CUSTOMER"
  );

  const [password, setPassword] =
    useState("");

  const [validationError, setValidationError] =
    useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = () => {
    setValidationError("");

    if (!name.trim()) {
      setValidationError(
        "Name is required."
      );
      return;
    }

    if (!email.trim()) {
      setValidationError(
        "Email is required."
      );
      return;
    }

    if (!phoneNumber.trim()) {
      setValidationError(
        "Phone number is required."
      );
      return;
    }

    if (
      role !== "CUSTOMER" &&
      role !== "MANAGER"
    ) {
      setValidationError(
        "Please select a valid role."
      );
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      role,
      password,
    });
  };

  return (
    <div className="edit-manager-user-overlay">
      <div className="edit-manager-user-modal">
        <div className="edit-manager-user-header">
          <div>
            <span>ACCOUNT MANAGEMENT</span>

            <h2>Edit user</h2>
          </div>

          <button
            type="button"
            className="edit-manager-user-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-manager-user-summary">
          <div className="edit-manager-user-avatar">
            {user.name
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>

          <div>
            <strong>
              {user.name}
            </strong>

            <span>
              User #{user.id} • {user.role}
            </span>
          </div>
        </div>

        {validationError && (
          <div className="edit-manager-user-error">
            {validationError}
          </div>
        )}

        <div className="edit-manager-user-form">
          <div className="edit-manager-user-field">
            <label htmlFor="edit-user-name">
              Full name
            </label>

            <div className="edit-manager-user-input">
              <UserRound size={18} />

              <input
                id="edit-user-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-manager-user-field">
            <label htmlFor="edit-user-email">
              Email address
            </label>

            <div className="edit-manager-user-input">
              <Mail size={18} />

              <input
                id="edit-user-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>
          </div>

          <div className="edit-manager-user-field">
            <label htmlFor="edit-user-phone">
              Phone number
            </label>

            <div className="edit-manager-user-input">
              <Phone size={18} />

              <input
                id="edit-user-phone"
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

          <div className="edit-manager-user-field">
            <label htmlFor="edit-user-role">
              Role
            </label>

            <div className="edit-manager-user-select">
              <ShieldCheck size={18} />

              <select
                id="edit-user-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
              >
                <option value="CUSTOMER">
                  Customer
                </option>

                <option value="MANAGER">
                  Manager
                </option>
              </select>
            </div>
          </div>

          <div className="edit-manager-user-field">
            <label htmlFor="edit-user-password">
              New password
            </label>

            <div className="edit-manager-user-input">
              <KeyRound size={18} />

              <input
                id="edit-user-password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />
            </div>

            <small className="edit-manager-user-password-note">
              Optional — leave blank if the password
              should not change.
            </small>
          </div>
        </div>

        <div className="edit-manager-user-actions">
          <button
            type="button"
            className="edit-manager-user-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-manager-user-save"
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

export default EditManagerUserModal;