import { useEffect, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Ship,
  TicketCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";

import "./ManagerDashboard.css";

function ManagerDashboard() {
  const [boats, setBoats] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const manager = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          boatsResponse,
          tripsResponse,
          bookingsResponse,
          paymentsResponse,
          usersResponse,
        ] = await Promise.all([
          api.get("/boats"),
          api.get("/trip-schedules"),
          api.get("/bookings"),
          api.get("/payments"),
          api.get("/users"),
        ]);

        setBoats(boatsResponse.data);
        setTrips(tripsResponse.data);
        setBookings(bookingsResponse.data);
        setPayments(paymentsResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load manager dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "PENDING"
  ).length;

  const successfulPayments = payments.filter(
    (payment) =>
      payment.status === "SUCCESS"
  );

  const totalRevenue =
    successfulPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const customerCount = users.filter(
    (user) => user.role === "CUSTOMER"
  ).length;

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <ManagerLayout>
      <div className="manager-dashboard-page">
        <section className="manager-dashboard-header">
          <div>
            <span className="manager-dashboard-eyebrow">
              OPERATIONS OVERVIEW
            </span>

            <h1>
              Welcome back
              {manager.name
                ? `, ${manager.name.split(" ")[0]}`
                : ""}
            </h1>

            <p>
              Monitor safari operations, bookings,
              payments and resources from one place.
            </p>
          </div>
        </section>

        {error && (
          <div className="manager-dashboard-error">
            {error}
          </div>
        )}

        <section className="manager-dashboard-stats">
          <article className="manager-stat-card">
            <div className="manager-stat-icon boats">
              <Ship size={22} />
            </div>

            <div>
              <span>Total boats</span>

              <strong>
                {loading ? "—" : boats.length}
              </strong>

              <small>
                Registered safari boats
              </small>
            </div>
          </article>

          <article className="manager-stat-card">
            <div className="manager-stat-icon trips">
              <CalendarDays size={22} />
            </div>

            <div>
              <span>Trip schedules</span>

              <strong>
                {loading ? "—" : trips.length}
              </strong>

              <small>
                Total scheduled trips
              </small>
            </div>
          </article>

          <article className="manager-stat-card">
            <div className="manager-stat-icon bookings">
              <TicketCheck size={22} />
            </div>

            <div>
              <span>Bookings</span>

              <strong>
                {loading ? "—" : bookings.length}
              </strong>

              <small>
                {confirmedBookings} confirmed
              </small>
            </div>
          </article>

          <article className="manager-stat-card">
            <div className="manager-stat-icon customers">
              <UsersRound size={22} />
            </div>

            <div>
              <span>Customers</span>

              <strong>
                {loading ? "—" : customerCount}
              </strong>

              <small>
                Registered customers
              </small>
            </div>
          </article>
        </section>

        <section className="manager-dashboard-grid">
          <article className="manager-overview-card">
            <div className="manager-card-heading">
              <div>
                <span>BOOKING STATUS</span>
                <h2>Reservation overview</h2>
              </div>

              <TicketCheck size={21} />
            </div>

            <div className="manager-booking-summary">
              <div>
                <span>Confirmed</span>
                <strong>
                  {loading
                    ? "—"
                    : confirmedBookings}
                </strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>
                  {loading
                    ? "—"
                    : pendingBookings}
                </strong>
              </div>
            </div>
          </article>

          <article className="manager-overview-card">
            <div className="manager-card-heading">
              <div>
                <span>PAYMENT PERFORMANCE</span>
                <h2>Revenue overview</h2>
              </div>

              <CreditCard size={21} />
            </div>

            <div className="manager-revenue">
              <div className="manager-revenue-icon">
                <WalletCards size={23} />
              </div>

              <div>
                <span>Successful payment value</span>

                <strong>
                  {loading
                    ? "—"
                    : formatMoney(totalRevenue)}
                </strong>

                <small>
                  {successfulPayments.length} successful
                  transactions
                </small>
              </div>
            </div>
          </article>
        </section>
      </div>
    </ManagerLayout>
  );
}

export default ManagerDashboard;