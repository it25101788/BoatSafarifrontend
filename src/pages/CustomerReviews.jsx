import { useEffect, useState } from "react";
import {
  MessageSquareText,
  Sparkles,
  Star,
  Pencil,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import CustomerLayout from "../layouts/CustomerLayout";
import ReviewModal from "../components/ReviewModal";
import EditReviewModal from "../components/EditReviewModal";
import DeleteReviewModal from "../components/DeleteReviewModal";


import "./CustomerReviews.css";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
const [selectedBooking, setSelectedBooking] = useState(null);
const [reviewLoading, setReviewLoading] = useState(false);
const [reviewError, setReviewError] = useState("");
const [editingReview, setEditingReview] = useState(null);
const [editLoading, setEditLoading] = useState(false);
const [deletingReview, setDeletingReview] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
  const loadReviewData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reviewsResponse, bookingsResponse] =
        await Promise.all([
          api.get(
            `/reviews/customer/${user.id}`
          ),
          api.get("/bookings"),
        ]);

      setReviews(reviewsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load your review information."
      );
    } finally {
      setLoading(false);
    }
  };

  loadReviewData();
}, [user.id]);

  const averageRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce(
            (total, review) =>
              total + review.rating,
            0
          ) / reviews.length
        ).toFixed(1);

        const reviewedBookingIds = reviews.map(
  (review) => review.booking.id
);

const eligibleBookings = bookings.filter(
  (booking) => {
    if (booking.status !== "CONFIRMED") {
      return false;
    }

    if (reviewedBookingIds.includes(booking.id)) {
      return false;
    }

    const tripEnd = new Date(
      `${booking.tripSchedule.tripDate}T${booking.tripSchedule.endTime}`
    );

    return tripEnd <= new Date();
  }
);


const handleSubmitReview = async ({
  rating,
  comment,
}) => {
  if (!selectedBooking) {
    return;
  }

  try {
    setReviewLoading(true);
    setReviewError("");

   const response = await api.post(
  "/reviews",
  {
    rating,
    comment,
    booking: {
      id: selectedBooking.id,
    },
  }
);

    setReviews((currentReviews) => [
      ...currentReviews,
      response.data,
    ]);

    setSelectedBooking(null);
  } catch (err) {
    setReviewError(
      err.response?.data?.error ||
        "Unable to submit your review."
    );
  } finally {
    setReviewLoading(false);
  }
};

const formatReviewDate = (dateTime) => {
  if (!dateTime) {
    return "Not available";
  }

  const normalizedDate = dateTime.replace(
    /(\.\d{3})\d+/,
    "$1"
  );

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
const handleUpdateReview = async ({
  rating,
  comment,
}) => {
  if (!editingReview) {
    return;
  }

  try {
    setEditLoading(true);
    setReviewError("");

    const response = await api.put(
      `/reviews/${editingReview.id}`,
      {
        rating,
        comment,
        booking: {
          id: editingReview.booking.id,
        },
      }
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
    setReviewError(
      err.response?.data?.error ||
        "Unable to update your review."
    );
  } finally {
    setEditLoading(false);
  }
};
const handleDeleteReview = async () => {
  if (!deletingReview) {
    return;
  }

  try {
    setDeleteLoading(true);
    setReviewError("");

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
    setReviewError(
      err.response?.data?.error ||
        "Unable to delete your review."
    );
  } finally {
    setDeleteLoading(false);
  }
};

  return (
    <CustomerLayout>
      <div className="reviews-page">
        <section className="reviews-header">
          <div>
            <div className="reviews-eyebrow">
              <Sparkles size={15} />
              YOUR EXPERIENCE
            </div>

            <h1>My reviews</h1>

            <p>
              Share your safari experiences and manage
              feedback from your previous journeys.
            </p>
          </div>
        </section>

        {error && (
          <div className="reviews-error">
            {error}
          </div>

          
        )}
        {reviewError && (
  <div className="reviews-error">
    {reviewError}
  </div>
)}

        <section className="review-stats">
          <div className="review-stat-card">
            <div className="review-stat-icon">
              <MessageSquareText size={21} />
            </div>

            <div>
              <span>Total reviews</span>

              <strong>
                {loading ? "—" : reviews.length}
              </strong>

              <small>
                Reviews you've submitted
              </small>
            </div>
          </div>

          <div className="review-stat-card">
            <div className="review-stat-icon rating">
              <Star size={21} />
            </div>

            <div>
              <span>Average rating</span>

              <strong>
                {loading
                  ? "—"
                  : reviews.length === 0
                    ? "—"
                    : `${averageRating}/5`}
              </strong>

              <small>
                Your average safari score
              </small>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="reviews-loading">
            Loading your reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            <div className="reviews-empty-icon">
              <Star size={31} />
            </div>

            <h2>No reviews yet</h2>

            <p>
              Once you've experienced a safari, you can
              share your rating and feedback here.
            </p>

            <button
  type="button"
  disabled={eligibleBookings.length === 0}
  onClick={() =>
    setSelectedBooking(
      eligibleBookings[0]
    )
  }
>
  {eligibleBookings.length > 0
    ? "Write your first review"
    : "No completed safari to review"}
</button>
          </div>
        ) : (
          <section className="reviews-list">
            {reviews.map((review) => (
              <article
                className="review-card"
                key={review.id}
              >
                <div className="review-card-top">
                  <div>
                    <span>
                      REVIEW #{review.id}
                    </span>

                    <h2>
                      {
                        review.booking.tripSchedule
                          .boat.boatName
                      }
                    </h2>
                  </div>

                  <div className="review-rating">
                    <Star size={17} />
                    {review.rating}/5
                  </div>
                </div>

                <p className="review-comment">
                  {review.comment}
                </p>

               <div className="review-footer">
  <div className="review-footer-info">
    <span>
      Booking #{review.booking.id}
    </span>

    <span>
      {formatReviewDate(review.reviewDate)}
    </span>
  </div>

  <div className="review-actions">
   <button
  type="button"
  className="review-edit-button"
  onClick={() => setEditingReview(review)}
>
  <Pencil size={14} />
  Edit
</button>

   <button
  type="button"
  className="review-delete-button"
  onClick={() => setDeletingReview(review)}
>
  <Trash2 size={14} />
  Delete
</button>
  </div>
</div>
              </article>
            ))}
          </section>
        )}
      </div>
      {selectedBooking && (
  <ReviewModal
    booking={selectedBooking}
    loading={reviewLoading}
    onClose={() => {
      if (!reviewLoading) {
        setSelectedBooking(null);
        setReviewError("");
      }
    }}
    onSubmit={handleSubmitReview}
  />
)}
{editingReview && (
  <EditReviewModal
    review={editingReview}
    loading={editLoading}
    onClose={() => {
      if (!editLoading) {
        setEditingReview(null);
        setReviewError("");
      }
    }}
    onSave={handleUpdateReview}
  />
)}
{deletingReview && (
  <DeleteReviewModal
    review={deletingReview}
    loading={deleteLoading}
    onClose={() => {
      if (!deleteLoading) {
        setDeletingReview(null);
        setReviewError("");
      }
    }}
    onDelete={handleDeleteReview}
  />
)}
    </CustomerLayout>
  );
}

export default CustomerReviews;