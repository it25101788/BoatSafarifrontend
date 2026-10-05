import { useState } from "react";
import {
  Pencil,
  Star,
  X,
} from "lucide-react";

import "./EditReviewModal.css";

function EditReviewModal({
  review,
  onClose,
  onSave,
  loading,
}) {
  const [rating, setRating] = useState(
    review?.rating || 5
  );

  const [comment, setComment] = useState(
    review?.comment || ""
  );

  if (!review) {
    return null;
  }

  const handleSave = () => {
    if (!comment.trim()) {
      return;
    }

    onSave({
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <div className="edit-review-overlay">
      <div className="edit-review-modal">
        <div className="edit-review-header">
          <div>
            <span>UPDATE FEEDBACK</span>

            <h2>Edit your review</h2>
          </div>

          <button
            type="button"
            className="edit-review-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="edit-review-summary">
          <div className="edit-review-summary-icon">
            <Pencil size={20} />
          </div>

          <div>
            <strong>
              {
                review.booking.tripSchedule
                  .boat.boatName
              }
            </strong>

            <span>
              Review #{review.id}
            </span>
          </div>
        </div>

        <div className="edit-review-rating">
          <label>Your rating</label>

          <div className="edit-review-stars">
            {[1, 2, 3, 4, 5].map(
              (value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() =>
                    setRating(value)
                  }
                  className={
                    value <= rating
                      ? "active"
                      : ""
                  }
                >
                  <Star size={25} />
                </button>
              )
            )}
          </div>

          <span>{rating}/5</span>
        </div>

        <div className="edit-review-comment">
          <label htmlFor="edit-review-comment">
            Your feedback
          </label>

          <textarea
            id="edit-review-comment"
            rows="5"
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
          />

          <small>
            Update your rating or feedback about this safari.
          </small>
        </div>

        <div className="edit-review-actions">
          <button
            type="button"
            className="edit-review-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-review-save"
            onClick={handleSave}
            disabled={
              loading ||
              !comment.trim()
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

export default EditReviewModal;