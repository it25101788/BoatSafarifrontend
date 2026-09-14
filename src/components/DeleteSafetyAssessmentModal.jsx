import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteSafetyAssessmentModal.css";

function DeleteSafetyAssessmentModal({
  record,
  loading,
  onClose,
  onDelete,
}) {
  if (!record) {
    return null;
  }

  return (
    <div className="delete-safety-overlay">
      <div className="delete-safety-modal">
        <div className="delete-safety-header">
          <div className="delete-safety-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-safety-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-safety-content">
          <span>DELETE ASSESSMENT</span>

          <h2>Delete this assessment?</h2>

          <p>
            Assessment{" "}
            <strong>#{record.id}</strong>{" "}
            for Trip{" "}
            <strong>
              #{record.tripSchedule?.id}
            </strong>{" "}
            will be permanently removed.
          </p>

          <div className="delete-safety-summary">
            <div>
              <span>Assessment</span>
              <strong>#{record.id}</strong>
            </div>

            <div>
              <span>Weather</span>
              <strong>
                {record.weatherCondition}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {record.safetyStatus}
              </strong>
            </div>
          </div>
        </div>

        <div className="delete-safety-actions">
          <button
            type="button"
            className="delete-safety-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep assessment
          </button>

          <button
            type="button"
            className="delete-safety-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSafetyAssessmentModal;