import { useEffect, useState } from "react";
import {
  CalendarDays,
  MessageSquareText,
  Ship,
  Star,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import EditManagerReviewModal from "../components/EditManagerReviewModal";
import DeleteManagerReviewModal from "../components/DeleteManagerReviewModal";

import "./ManagerReviews.css";

function ManagerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] =useState(null);
  const [editReviewLoading, setEditReviewLoading] =useState(false);
  const [deletingReview, setDeletingReview] =useState(null);
  const [deleteReviewLoading, setDeleteReviewLoading] =useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/reviews");

        setReviews(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const averageRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce(
            (total, review) =>
              total +
              Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1);

  const fiveStarReviews = reviews.filter(
    (review) => review.rating === 5
  ).length;

  const fourPlusReviews = reviews.filter(
    (review) => review.rating >= 4
  ).length;

  const formatDate = (dateTime) => {
    if (!dateTime) {
      return "Not available";
    }

    const normalizedDate = String(
      dateTime
    ).replace(
      /(\.\d{3})\d+/,
      "$1"
    );

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return String(dateTime);
    }

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatTripDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating) =>
    Array.from(
      { length: 5 },
      (_, index) => (
        <Star
          key={index}
          size={16}
          fill={
            index < rating
              ? "currentColor"
              : "none"
          }
        />
      )
    );
    const handleUpdateReview = async (reviewData) => {
  if (!editingReview) {
    return;
  }

  try {
    setEditReviewLoading(true);
    setError("");

    const response = await api.put(
      `/reviews/${editingReview.id}`,
      reviewData
    );

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === editingReview.id
          ? response.data
          : review
      )
    );

    setEditingReview(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update review."
    );
  } finally {
    setEditReviewLoading(false);
  }
};
const handleDeleteReview = async () => {
  if (!deletingReview) {
    return;
  }

  try {
    setDeleteReviewLoading(true);
    setError("");

    await api.delete(
      `/reviews/${deletingReview.id}`
    );

    setReviews((currentReviews) =>
      currentReviews.filter(
        (review) =>
          review.id !== deletingReview.id
      )
    );

    setDeletingReview(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete review."
    );

    setDeletingReview(null);
  } finally {
    setDeleteReviewLoading(false);
  }
};

  return (
    <ManagerLayout>
      <div className="manager-reviews-page">
        <section className="manager-reviews-header">
          <div>
            <div className="manager-reviews-eyebrow">
              <MessageSquareText size={15} />
              CUSTOMER FEEDBACK
            </div>

            <h1>Reviews</h1>

            <p>
              Monitor customer experiences,
              ratings and feedback from completed
              safari bookings.
            </p>
          </div>
        </section>

        {error && (
          <div className="manager-reviews-error">
            {error}
          </div>
        )}

        <section className="manager-review-stats">
          <article className="manager-review-stat">
            <div className="manager-review-stat-icon">
              <MessageSquareText size={21} />
            </div>

            <div>
              <span>Total reviews</span>

              <strong>
                {loading ? "—" : reviews.length}
              </strong>

              <small>
                Customer feedback received
              </small>
            </div>
          </article>

          <article className="manager-review-stat">
            <div className="manager-review-stat-icon rating">
              <Star size={21} />
            </div>

            <div>
              <span>Average rating</span>

              <strong>
                {loading
                  ? "—"
                  : `${averageRating}/5`}
              </strong>

              <small>
                Overall customer rating
              </small>
            </div>
          </article>

          <article className="manager-review-stat">
            <div className="manager-review-stat-icon excellent">
              <Star size={21} />
            </div>

            <div>
              <span>5-star reviews</span>

              <strong>
                {loading
                  ? "—"
                  : fiveStarReviews}
              </strong>

              <small>
                Excellent experiences
              </small>
            </div>
          </article>

          <article className="manager-review-stat">
            <div className="manager-review-stat-icon positive">
              <Star size={21} />
            </div>

            <div>
              <span>4+ ratings</span>

              <strong>
                {loading
                  ? "—"
                  : fourPlusReviews}
              </strong>

              <small>
                Positive customer feedback
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-reviews-loading">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="manager-reviews-empty">
            <MessageSquareText size={40} />

            <h2>No reviews yet</h2>

            <p>
              Customer feedback will appear here
              after completed safari experiences.
            </p>
          </div>
        ) : (
          <section className="manager-reviews-grid">
            {reviews.map((review) => (
              <article
                className="manager-review-card"
                key={review.id}
              >
                <div className="manager-review-card-top">
                  <div>
                    <span>
                      REVIEW #{review.id}
                    </span>

                    <div className="manager-review-stars">
                      {renderStars(
                        review.rating
                      )}

                      <strong>
                        {review.rating}/5
                      </strong>
                    </div>
                  </div>

                  <span className="manager-review-rating-badge">
                    {review.rating} STAR
                  </span>
                </div>

                <div className="manager-review-customer">
                  <UserRound size={18} />

                  <div>
                    <span>Customer</span>

                    <strong>
                      {review.booking?.customer
                        ?.name || "—"}
                    </strong>

                    <small>
                      {review.booking?.customer
                        ?.email || "—"}
                    </small>
                  </div>
                </div>

                <div className="manager-review-details">
                  <div>
                    <Ship size={17} />

                    <span>Safari</span>

                    <strong>
                      {review.booking
                        ?.tripSchedule?.boat
                        ?.boatName || "—"}
                    </strong>
                  </div>

                  <div>
                    <CalendarDays size={17} />

                    <span>Trip date</span>

                    <strong>
                      {formatTripDate(
                        review.booking
                          ?.tripSchedule
                          ?.tripDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <MessageSquareText
                      size={17}
                    />

                    <span>Booking</span>

                    <strong>
                      #
                      {review.booking?.id ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <CalendarDays size={17} />

                    <span>Reviewed</span>

                    <strong>
                      {formatDate(
                        review.reviewDate
                      )}
                    </strong>
                  </div>
                </div>

                <div className="manager-review-comment">
                  <span>Customer comment</span>

                  <p>
                    {review.comment ||
                      "No written comment provided."}
                  </p>
                </div>

                <div className="manager-review-actions">
                 <button
  type="button"
  className="manager-review-edit"
  onClick={() =>
    setEditingReview(review)
  }
>
  Edit
</button>
<button
  type="button"
  className="manager-review-delete"
  onClick={() =>
    setDeletingReview(review)
  }
>
  Delete
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      {editingReview && (
  <EditManagerReviewModal
    review={editingReview}
    loading={editReviewLoading}
    onClose={() => {
      if (!editReviewLoading) {
        setEditingReview(null);
        setError("");
      }
    }}
  onSave={handleUpdateReview}
  />
)}
{deletingReview && (
  <DeleteManagerReviewModal
    review={deletingReview}
    loading={deleteReviewLoading}
    onClose={() => {
      if (!deleteReviewLoading) {
        setDeletingReview(null);
        setError("");
      }
    }}
    onDelete={handleDeleteReview}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerReviews;