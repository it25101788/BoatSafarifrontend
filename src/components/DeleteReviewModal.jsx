import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteReviewModal.css";

function DeleteReviewModal({
  review,
  onClose,
  onDelete,
  loading,
}) {
  if (!review) {
    return null;
  }

  return (
    <div className="delete-review-overlay">
      <div className="delete-review-modal">
        <div className="delete-review-header">
          <div className="delete-review-warning-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-review-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-review-content">
          <span>DELETE REVIEW</span>

          <h2>Remove this review?</h2>

          <p>
            Your review for{" "}
            <strong>
              {
                review.booking.tripSchedule
                  .boat.boatName
              }
            </strong>{" "}
            will be permanently deleted.
          </p>

          <div className="delete-review-summary">
            <strong>
              Review #{review.id}
            </strong>

            <span>
              Rating: {review.rating}/5
            </span>
          </div>
        </div>

        <div className="delete-review-actions">
          <button
            type="button"
            className="delete-review-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Keep review
          </button>

          <button
            type="button"
            className="delete-review-confirm"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} />

            {loading
              ? "Deleting..."
              : "Delete review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteReviewModal;