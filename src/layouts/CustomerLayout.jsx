import { useState } from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Star,
  UserRound,
  Waves,
  X,
} from "lucide-react";

import "./CustomerLayout.css";

function CustomerLayout({ children }) {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/customer/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Explore Trips",
      path: "/customer/trips",
      icon: Map,
    },
    {
      label: "My Bookings",
      path: "/customer/bookings",
      icon: CalendarDays,
    },
    {
      label: "Payments",
      path: "/customer/payments",
      icon: CreditCard,
    },
    {
      label: "Reviews",
      path: "/customer/reviews",
      icon: Star,
    },
    {
      label: "Profile",
      path: "/customer/profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="customer-layout">
      <aside
        className={`customer-sidebar ${
          mobileMenuOpen ? "open" : ""
        }`}
      >
        <button
          type="button"
          className="customer-mobile-close"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <div>
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Waves size={23} />
            </div>

            <div>
              <h2>Boat Safari</h2>
              <span>Adventure Portal</span>
            </div>
          </div>

          <nav className="sidebar-navigation">
            <p className="sidebar-label">
              MENU
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    isActive
                      ? "sidebar-link active"
                      : "sidebar-link"
                  }
                >
                  <Icon size={19} />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="sidebar-user-info">
              <strong>
                {user.name || "Customer"}
              </strong>

              <span>Customer</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="customer-mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      <section className="customer-main">
        <header className="customer-topbar">
          <button
            type="button"
            className="customer-mobile-menu"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="customer-topbar-copy">
            <span className="topbar-eyebrow">
              BOAT SAFARI
            </span>

            <h3>
              Your adventure, your way.
            </h3>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            System online
          </div>
        </header>

        <main className="customer-content">
          {children}
        </main>
      </section>
    </div>
  );
}

export default CustomerLayout;