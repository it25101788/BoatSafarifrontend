import { useState } from "react";
import {
  MessageSquareText,
  Star,
  X,
} from "lucide-react";

import "./EditManagerReviewModal.css";

function EditManagerReviewModal({
  review,
  loading,
  onClose,
  onSave,
}) {
  const [rating, setRating] = useState(
    review?.rating || 5
  );

  const [comment, setComment] = useState(
    review?.comment || ""
  );

  const [validationError, setValidationError] =
    useState("");

  if (!review) {
    return null;
  }

  const handleSubmit = () => {
    setValidationError("");

    const numericRating = Number(rating);

    if (
      numericRating < 1 ||
      numericRating > 5
    ) {
      setValidationError(
        "Rating must be between 1 and 5."
      );
      return;
    }

    onSave({
      rating: numericRating,
      comment: comment.trim(),
    });
  };

  return (
    <div className="edit-manager-review-overlay">
      <div className="edit-manager-review-modal">
        <div className="edit-manager-review-header">
          <div>
            <span>REVIEW MANAGEMENT</span>

            <h2>Edit review</h2>
          </div>

          <button
            type="button"
            className="edit-manager-review-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-manager-review-summary">
          <div className="edit-manager-review-summary-icon">
            <MessageSquareText size={21} />
          </div>

          <div>
            <strong>
              Review #{review.id}
            </strong>

            <span>
              {review.booking?.customer?.name ||
                "Customer"}{" "}
              • Booking #
              {review.booking?.id || "—"}
            </span>
          </div>
        </div>

        {validationError && (
          <div className="edit-manager-review-error">
            {validationError}
          </div>
        )}

        <div className="edit-manager-review-form">
          <div className="edit-manager-review-field">
            <label>Rating</label>

            <div className="edit-manager-review-stars">
              {[1, 2, 3, 4, 5].map(
                (starValue) => (
                  <button
                    type="button"
                    key={starValue}
                    className={
                      starValue <= rating
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setRating(starValue)
                    }
                    disabled={loading}
                  >
                    <Star
                      size={26}
                      fill={
                        starValue <= rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                )
              )}

              <strong>{rating}/5</strong>
            </div>
          </div>

          <div className="edit-manager-review-field">
            <label htmlFor="manager-review-comment">
              Comment
            </label>

            <textarea
              id="manager-review-comment"
              rows="5"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder="Customer review comment..."
            />
          </div>
        </div>

        <div className="edit-manager-review-actions">
          <button
            type="button"
            className="edit-manager-review-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-manager-review-save"
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

export default EditManagerReviewModal;