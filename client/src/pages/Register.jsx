import { useState } from "react";
import {
  User,
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
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    try {
      setLoading(true);

      // 1. CREATE ACCOUNT
      const registerResponse = await API.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Register response:", registerResponse.data);

      /*
        Some backends return the JWT immediately after registration.
        If yours does, use it.
      */

      let token = registerResponse.data?.token;

      /*
        If registration doesn't return a token,
        automatically log the user in.
      */

      if (!token) {
        const loginResponse = await API.post("/auth/login", {
          email: formData.email.trim(),
          password: formData.password,
        });

        console.log("Auto login response:", loginResponse.data);

        token = loginResponse.data?.token;
      }

      if (!token) {
        throw new Error(
          "Account was created, but no authentication token was returned."
        );
      }

      // 2. SAVE JWT
      localStorage.setItem("token", token);

      // 3. SAVE BASIC USER INFO
     const user = {
  name: formData.name.trim(),
  email: formData.email.trim(),
};

login(user, token);

navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="register-page">

        {/* LEFT VISUAL */}
        <section className="register-visual">
          <div className="register-overlay"></div>

          <div className="register-visual-content">

            <p>BEGIN YOUR AZUREA JOURNEY</p>

            <h1>
              A New Escape
              <span> Awaits.</span>
            </h1>

            <p className="register-quote">
              Create your AZUREA account and make every getaway easier,
              more personal and unforgettable.
            </p>

          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="register-form-section">

          <div className="register-form-container">

            <p className="register-tag">
              JOIN THE AZUREA FAMILY
            </p>

            <h2>
              Create
              <span> Account.</span>
            </h2>

            <p className="register-subtitle">
              Create your account to manage reservations and discover
              everything AZUREA has to offer.
            </p>

            {/* ERROR */}
            {error && (
              <div className="register-message register-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="register-input-group">
                <label>Full Name</label>

                <div className="register-input">
                  <User size={20} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="register-input-group">
                <label>Email Address</label>

                <div className="register-input">
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
              <div className="register-input-group">
                <label>Password</label>

                <div className="register-input">
                  <Lock size={20} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
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

              {/* CONFIRM PASSWORD */}
              <div className="register-input-group">
                <label>Confirm Password</label>

                <div className="register-input">
                  <Lock size={20} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <label className="register-terms">

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) =>
                    setAgreeTerms(e.target.checked)
                  }
                />

                <span>
                  I agree to the AZUREA terms and privacy policy.
                </span>

              </label>

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

            <p className="login-link">
              Already have an account?

              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </p>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Register;