import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login response:", response.data);

      const token = response.data?.token;

      if (!token) {
        throw new Error("Login succeeded, but no authentication token was received.");
      }

      /*
       * Get user information from the backend response if available.
       * If your backend only returns the token, we use the login
       * form information as temporary basic user information.
       */
      const loggedInUser =
        response.data?.user || {
          name: response.data?.name || formData.email.split("@")[0],
          email: response.data?.email || formData.email.trim(),
        };

      // Update AuthContext + localStorage
      login(loggedInUser, token);

      // Go to Home
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="login-page">

        {/* LEFT SIDE - IMAGE */}
        <section className="login-visual">

          <div className="login-overlay"></div>

          <div className="login-visual-content">

            <p>WELCOME BACK TO AZUREA</p>

            <h1>
              Your Paradise
              <span> Awaits.</span>
            </h1>

            <p className="login-quote">
              Escape the ordinary and return to a world designed for
              unforgettable moments.
            </p>

          </div>

        </section>

        {/* RIGHT SIDE - FORM */}
        <section className="login-form-section">

          <div className="login-form-container">

            <p className="login-tag">
              YOUR PRIVATE ESCAPE
            </p>

            <h2>
              Welcome
              <span> Back.</span>
            </h2>

            <p className="login-subtitle">
              Sign in to manage your reservations and continue your journey.
            </p>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="login-message login-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="login-input-group">

                <label>Email Address</label>

                <div className="login-input">

                  <Mail size={20} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="login-input-group">

                <label>Password</label>

                <div className="login-input">

                  <Lock size={20} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
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

              {/* OPTIONS */}
              <div className="login-options">

                <label className="remember-me">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>

                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError("Password reset will be available soon.")
                  }
                >
                  Forgot Password?
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

            {/* SIGNUP */}
            <p className="register-link">

              Don't have an account?

              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>

            </p>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Login;