import { NavLink, useNavigate } from "react-router-dom";
import {
  Anchor,
  CalendarDays,
  CreditCard,
  Gauge,
  LifeBuoy,
  LogOut,
  MessageSquareText,
  Ship,
  UsersRound,
  UserRoundCog,
  Menu,
X,
} from "lucide-react";

import "./ManagerLayout.css";
import { useState } from "react";

function ManagerLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const getInitial = (name) => {
    if (!name) {
      return "M";
    }

    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/manager/dashboard",
      icon: Gauge,
    },
    {
      label: "Boats",
      path: "/manager/boats",
      icon: Ship,
    },
    {
      label: "Crew",
      path: "/manager/crew",
      icon: UsersRound,
    },
    {
      label: "Trip Schedules",
      path: "/manager/trips",
      icon: CalendarDays,
    },
    {
      label: "Bookings",
      path: "/manager/bookings",
      icon: Anchor,
    },
    {
      label: "Payments",
      path: "/manager/payments",
      icon: CreditCard,
    },
    {
      label: "Safety & Weather",
      path: "/manager/safety",
      icon: LifeBuoy,
    },
    {
      label: "Reviews",
      path: "/manager/reviews",
      icon: MessageSquareText,
    },
    {
      label: "Users",
      path: "/manager/users",
      icon: UserRoundCog,
    },
  ];

  return (
    <div className="manager-shell">
   <aside
  className={`manager-sidebar ${
    mobileMenuOpen ? "open" : ""
  }`}
>
  <button
    type="button"
    className="manager-mobile-close"
    onClick={() =>
      setMobileMenuOpen(false)
    }
    aria-label="Close menu"
  >
    <X size={20} />
  </button>

  <div className="manager-brand">
    <div className="manager-brand-icon">
      <Ship size={22} />
    </div>

    <div>
      <strong>Boat Safari</strong>
      <span>Management Portal</span>
    </div>
  </div>

        <div className="manager-menu-label">
          MANAGEMENT
        </div>

        <nav className="manager-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                  onClick={() =>
    setMobileMenuOpen(false)
  }
                className={({ isActive }) =>
                  `manager-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="manager-sidebar-bottom">
          <div className="manager-user">
            <div className="manager-user-avatar">
              {getInitial(user.name)}
            </div>

            <div>
              <strong>
                {user.name || "Manager"}
              </strong>

              <span>Manager</span>
            </div>
          </div>

          <button
            type="button"
            className="manager-signout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      {mobileMenuOpen && (
  <button
    type="button"
    className="manager-mobile-overlay"
    onClick={() =>
      setMobileMenuOpen(false)
    }
    aria-label="Close navigation"
  />
)}

      <div className="manager-main">
        <header className="manager-topbar">
          <button
  type="button"
  className="manager-mobile-menu"
  onClick={() =>
    setMobileMenuOpen(true)
  }
  aria-label="Open menu"
>
  <Menu size={20} />
</button>
          <div>
            <span>BOAT SAFARI</span>

            <strong>
              Operations management center.
            </strong>
          </div>

          <div className="manager-system-status">
            <span />
            System online
          </div>
        </header>

        <main className="manager-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ManagerLayout;