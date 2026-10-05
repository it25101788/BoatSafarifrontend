import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import "./DeleteManagerReviewModal.css";

function DeleteManagerReviewModal({
  review,
  loading,
  onClose,
  onDelete,
}) {
  if (!review) {
    return null;
  }

  return (
    <div className="delete-manager-review-overlay">
      <div className="delete-manager-review-modal">
        <div className="delete-manager-review-header">
          <div className="delete-manager-review-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="delete-manager-review-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-manager-review-content">
          <span>DELETE REVIEW</span>

          <h2>Delete this review?</h2>

          <p>
            Review{" "}
            <strong>#{review.id}</strong>{" "}
            from{" "}
            <strong>
              {review.booking?.customer?.name ||
                "this customer"}
            </strong>{" "}
            will be permanently removed.
          </p>

          <div className="delete-manager-review-summary">
            <div>
              <span>Review</span>
              <strong>#{review.id}</strong>
            </div>

            <div>
              <span>Booking</span>
              <strong>
                #{review.booking?.id || "—"}
              </strong>
            </div>

            <div>
              <span>Rating</span>
              <strong>
                {review.rating}/5
              </strong>
            </div>
          </div>
        </div>

        <div className="delete-manager-review-actions">
          <button
            type="button"
            className="delete-manager-review-back"
            onClick={onClose}
            disabled={loading}
          >
            Keep review
          </button>

          <button
            type="button"
            className="delete-manager-review-confirm"
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

export default DeleteManagerReviewModal;