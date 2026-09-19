
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CalendarDays,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

    if (window.location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* LOGO */}

      <Link
        to="/"
        className="logo"
        onClick={closeMobileMenu}
      >
        <span>AZUREA</span>
        <small>BEACH RESORT</small>
      </Link>

      {/* DESKTOP NAVIGATION */}

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/rooms">Rooms</Link>

        <button
          type="button"
          onClick={() => scrollToSection("experiences")}
        >
          Experiences
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("about")}
        >
          About
        </button>
      </div>

      {/* RIGHT SIDE */}

      <div className="nav-actions">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="navbar-login-btn"
            >
              Login
            </Link>

            <Link
              to="/booking"
              className="navbar-book-btn"
            >
              Book Your Stay
            </Link>
          </>
        ) : (
          <>
            <div className="profile-wrapper">
              <button
                className="profile-button"
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
              >
                <div className="profile-avatar">
                  <User size={17} />
                </div>

                <span>
                  {user?.name || "My Account"}
                </span>

                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? "profile-chevron open"
                      : "profile-chevron"
                  }
                />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      <User size={20} />
                    </div>

                    <div>
                      <strong>
                        {user?.name || "Guest"}
                      </strong>

                      <span>
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider"></div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={17} />
                    Profile & Details
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setProfileOpen(false)}
                  >
                    <CalendarDays size={17} />
                    My Bookings
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard size={17} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    className="profile-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/booking"
              className="navbar-book-btn"
            >
              Book Your Stay
            </Link>
          </>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() =>
          setMobileMenuOpen((prev) => !prev)
        }
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? (
          <X size={25} />
        ) : (
          <Menu size={25} />
        )}
      </button>

      {/* MOBILE MENU */}

      <motion.div
        className={`mobile-menu ${
          mobileMenuOpen ? "mobile-menu-open" : ""
        }`}
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -15,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.25 }}
      >
        <Link
          to="/"
          onClick={closeMobileMenu}
        >
          Home
        </Link>

        <Link
          to="/rooms"
          onClick={closeMobileMenu}
        >
          Rooms
        </Link>

        <button
          type="button"
          onClick={() =>
            scrollToSection("experiences")
          }
        >
          Experiences
        </button>

        <button
          type="button"
          onClick={() =>
            scrollToSection("about")
          }
        >
          About
        </button>

        <div className="mobile-menu-divider"></div>

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              onClick={closeMobileMenu}
            >
              Login
            </Link>

            <Link
              to="/booking"
              className="mobile-book-btn"
              onClick={closeMobileMenu}
            >
              Book Your Stay
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              onClick={closeMobileMenu}
            >
              <User size={17} />
              Profile
            </Link>

            <Link
              to="/my-bookings"
              onClick={closeMobileMenu}
            >
              <CalendarDays size={17} />
              My Bookings
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
              >
                <LayoutDashboard size={17} />
                Admin Dashboard
              </Link>
            )}

            <button
              type="button"
              className="mobile-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>

            <Link
              to="/booking"
              className="mobile-book-btn"
              onClick={closeMobileMenu}
            >
              Book Your Stay
            </Link>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
