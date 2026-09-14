import {
  CalendarDays,
  Clock3,
  Compass,
  Ship,
  UserRound,
  Users,
  X,
} from "lucide-react";

import "./BookingDetailsModal.css";

function BookingDetailsModal({
  booking,
  onClose,
}) {
  if (!booking) {
    return null;
  }

  return (
    <div className="details-modal-overlay">
      <div className="details-modal">
        <div className="details-modal-header">
          <div>
            <span>BOOKING DETAILS</span>
            <h2>
              Booking #{booking.id}
            </h2>
          </div>

          <button
            type="button"
            className="details-close-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="details-boat-card">
          <div className="details-boat-icon">
            <Ship size={25} />
          </div>

          <div>
            <strong>
              {
                booking.tripSchedule.boat
                  .boatName
              }
            </strong>

            <span>
              {
                booking.tripSchedule.boat
                  .boatType
              }
            </span>
          </div>

          <span
            className={`details-status ${booking.status.toLowerCase()}`}
          >
            {booking.status}
          </span>
        </div>

        <div className="details-grid">
          <div>
            <CalendarDays size={18} />

            <span>
              <small>Safari date</small>
              <strong>
                {booking.tripSchedule.tripDate}
              </strong>
            </span>
          </div>

          <div>
            <Clock3 size={18} />

            <span>
              <small>Time</small>
              <strong>
                {booking.tripSchedule.startTime}
                {" – "}
                {booking.tripSchedule.endTime}
              </strong>
            </span>
          </div>

          <div>
            <Users size={18} />

            <span>
              <small>Passengers</small>
              <strong>
                {booking.numberOfPassengers}
              </strong>
            </span>
          </div>

          <div>
            <Compass size={18} />

            <span>
              <small>Guide</small>
              <strong>
                {booking.tripSchedule.guide.name}
              </strong>
            </span>
          </div>

          <div>
            <UserRound size={18} />

            <span>
              <small>Driver</small>
              <strong>
                {booking.tripSchedule.driver.name}
              </strong>
            </span>
          </div>

          <div>
            <Ship size={18} />

            <span>
              <small>Capacity</small>
              <strong>
                {
                  booking.tripSchedule.boat
                    .capacity
                }{" "}
                guests
              </strong>
            </span>
          </div>
        </div>

        <div className="details-booked-date">
          <span>Booking created</span>

          <strong>
            {booking.bookingDate}
          </strong>
        </div>

        <button
          type="button"
          className="details-done-button"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default BookingDetailsModal;