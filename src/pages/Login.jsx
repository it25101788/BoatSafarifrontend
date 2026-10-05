import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Waves,
} from "lucide-react";

import "./Login.css";

function Login() {
const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const navigate = useNavigate();

const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await api.post("/users/login", {
      email,
      password,
    });

    const userData = response.data;

    localStorage.setItem("token", userData.token);

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      })
    );

    if (userData.role === "MANAGER") {
      navigate("/manager/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to sign in. Please check your details."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-brand">
          <div className="brand-icon">
            <Waves size={23} />
          </div>

          <h2>Boat Safari</h2>
        </div>

        <div className="login-hero-content">
          <div className="login-badge">
            <Waves size={15} />
            Discover the waterways
          </div>

          <h1>
            Your next safari
            begins on the water.
          </h1>

          <p>
            Plan unforgettable boat safari experiences with
            simple bookings, trusted guides and real-time
            trip information.
          </p>

          <div className="login-benefits">
            <div className="login-benefit">
              <span className="benefit-icon">
                <CalendarDays size={17} />
              </span>
              Easy booking
            </div>

            <div className="login-benefit">
              <span className="benefit-icon">
                <ShieldCheck size={17} />
              </span>
              Safe journeys
            </div>
          </div>
        </div>

        <p className="login-visual-footer">
          Explore responsibly. Travel beautifully.
        </p>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-form-heading">
            <span>WELCOME BACK</span>

            <h2>Sign in to continue</h2>

            <p>
              Enter your account details to manage your
              Boat Safari experience.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">
                <Mail
                  className="input-icon"
                  size={19}
                />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required

                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole
                  className="input-icon"
                  size={19}
                />

               <input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     placeholder="Enter your password"
                     value={password}
                     onChange={(event) => setPassword(event.target.value)}
                     required 

                 />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="#"
                className="forgot-link"
              >
                Forgot password?
              </a>
            </div>

{error && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      fontWeight: "600",
    }}
  >
    {error}
  </p>
)}




           <button
  className="login-button"
  type="submit"
  disabled={loading}
>
  {loading ? "Signing in..." : "Sign in"}

  {!loading && <ArrowRight size={19} />}
</button>
          </form>

          <div className="login-divider">
            New to Boat Safari?
          </div>

         <p className="register-prompt">
  Don't have an account?

  <button
    type="button"
    className="register-link-button"
    onClick={() => navigate("/register")}
  >
    Create account
  </button>
</p>
        </div>
      </section>
    </main>
  );
}

export default Login;