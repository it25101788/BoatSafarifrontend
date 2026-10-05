import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  Waves,
} from "lucide-react";

import api from "../services/api";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/users", {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      });

      setSuccess(
        "Account created successfully. Redirecting to sign in..."
      );

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-brand-panel">
        <div className="register-brand">
          <div className="register-brand-icon">
            <Waves size={23} />
          </div>

          <h2>Boat Safari</h2>
        </div>

        <div className="register-hero">
          <span>START YOUR JOURNEY</span>

          <h1>
            Create your Boat Safari account.
          </h1>

          <p>
            Discover unforgettable safari trips,
            manage bookings and keep your journey
            details in one place.
          </p>
        </div>
      </section>

      <section className="register-form-section">
        <div className="register-form-wrapper">
          <button
            type="button"
            className="register-back"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={17} />
            Back to sign in
          </button>

          <div className="register-heading">
            <span>NEW CUSTOMER</span>

            <h2>Create account</h2>

            <p>
              Enter your details to start booking
              Boat Safari experiences.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-field">
              <label htmlFor="register-name">
                Full name
              </label>

              <div className="register-input">
                <UserRound size={18} />

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-email">
                Email address
              </label>

              <div className="register-input">
                <Mail size={18} />

                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-phone">
                Phone number
              </label>

              <div className="register-input">
                <Phone size={18} />

                <input
                  id="register-phone"
                  type="text"
                  placeholder="07XXXXXXXX"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input">
                <LockKeyhole size={18} />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {success && (
              <div className="register-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;