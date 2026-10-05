import { useState } from "react";
import {
  MessageSquareText,
  Star,
  X,
} from "lucide-react";

import "./ReviewModal.css";

function ReviewModal({
  booking,
  onClose,
  onSubmit,
  loading,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!booking) {
    return null;
  }

  const handleSubmit = () => {
    if (!comment.trim()) {
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="review-modal-header">
          <div>
            <span>SHARE YOUR EXPERIENCE</span>
            <h2>Review your safari</h2>
          </div>

          <button
            type="button"
            className="review-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="review-booking-summary">
          <div className="review-summary-icon">
            <MessageSquareText size={22} />
          </div>

          <div>
            <strong>
              {
                booking.tripSchedule.boat
                  .boatName
              }
            </strong>

            <span>
              Booking #{booking.id}
            </span>
          </div>
        </div>

        <div className="review-rating-section">
          <label>Your rating</label>

          <div className="review-stars">
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

          <span>
            {rating}/5
          </span>
        </div>

        <div className="review-comment-section">
          <label htmlFor="review-comment">
            Tell us about your safari
          </label>

          <textarea
            id="review-comment"
            rows="5"
            placeholder="Share what you enjoyed about your experience..."
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
          />

          <small>
            Your feedback helps improve future safari experiences.
          </small>
        </div>

        <div className="review-modal-actions">
          <button
            type="button"
            className="review-cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="review-submit-button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !comment.trim()
            }
          >
            {loading
              ? "Submitting..."
              : "Submit review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;