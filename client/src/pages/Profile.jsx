import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  CalendarDays,
  Hotel,
  IndianRupee,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Clock3,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import { gsap } from "../animations/gsapSetup";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     FETCH USER BOOKINGS
  ========================================= */

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) {
        setLoadingBookings(false);
        return;
      }

      try {
        const response = await API.get("/bookings/my-bookings");

        const activeBookings = (
          response.data?.bookings || []
        ).filter(
          (booking) => booking.status !== "cancelled"
        );

        setBookings(activeBookings);
      } catch (err) {
        console.error(
          "Failed to fetch profile bookings:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load booking information."
        );
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  /* =========================================
     GSAP ANIMATIONS
  ========================================= */

  useEffect(() => {
    if (!isAuthenticated || loadingBookings) return;

    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const heroTag = heroRef.current?.querySelector(
        ".profile-hero-tag"
      );

      const heroTitle = heroRef.current?.querySelector(
        "h1"
      );

      const heroText = heroRef.current?.querySelector(
        ".profile-hero-description"
      );

      const cards = contentRef.current?.querySelectorAll(
        ".profile-card"
      );

      const statCards =
        contentRef.current?.querySelectorAll(
          ".profile-stat-card"
        );

      gsap.fromTo(
        [heroTag, heroTitle, heroText],
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
        }
      );

      if (heroRef.current) {
        gsap.to(heroRef.current, {
          backgroundPosition: "50% 58%",
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (statCards?.length) {
        gsap.fromTo(
          statCards,
          {
            opacity: 0,
            y: 35,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statCards[0],
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (cards?.length) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, [
    isAuthenticated,
    loadingBookings,
    bookings.length,
  ]);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* =========================================
     NOT LOGGED IN
  ========================================= */

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />

        <main className="profile-page">
          <section className="profile-hero">
            <div className="profile-hero-overlay" />

            <div className="profile-hero-content">
              <p className="profile-hero-tag">
                AZUREA PRIVATE ESCAPE
              </p>

              <h1>
                Your <span>Profile.</span>
              </h1>

              <p className="profile-hero-description">
                Sign in to access your Azurea account.
              </p>
            </div>
          </section>

          <section className="profile-login-section">
            <div className="profile-login-card">
              <div className="profile-login-icon">
                <User size={32} />
              </div>

              <h2>Welcome to Azurea</h2>

              <p>
                Login to view your profile, reservations
                and account details.
              </p>

              <button
                className="profile-primary-btn"
                onClick={() => navigate("/login")}
              >
                Login to Account
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================================
     STATISTICS
  ========================================= */

  const totalBookings = bookings.length;

  const totalSpent = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalPrice || 0),
    0
  );

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.checkIn &&
      new Date(booking.checkIn) >= new Date()
  ).length;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "Azurea Member";

  return (
    <>
      <Navbar />

      <main
        className="profile-page"
        ref={pageRef}
      >
        {/* =====================================
            HERO
        ===================================== */}

        <section
          className="profile-hero"
          ref={heroRef}
        >
          <div className="profile-hero-overlay" />

          <div className="profile-hero-content">
            <p className="profile-hero-tag">
              AZUREA PRIVATE ESCAPE
            </p>

            <h1>
              Welcome,{" "}
              <span>{user?.name || "Guest"}.</span>
            </h1>

            <p className="profile-hero-description">
              Your personal space at Azurea Beach Resort.
            </p>
          </div>
        </section>

        {/* =====================================
            PROFILE CONTENT
        ===================================== */}

        <section
          className="profile-section"
          ref={contentRef}
        >
          <div className="profile-container">

            {/* PROFILE HEADER */}

            <div className="profile-card profile-main-card">
              <div className="profile-avatar">
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </div>

              <div className="profile-main-info">
                <p className="profile-label">
                  AZUREA MEMBER
                </p>

                <h2>
                  {user?.name || "Azurea Guest"}
                </h2>

                <div className="profile-email">
                  <Mail size={16} />
                  <span>
                    {user?.email || "No email available"}
                  </span>
                </div>

                <div className="profile-member">
                  <CalendarDays size={16} />
                  <span>
                    Member since {memberSince}
                  </span>
                </div>
              </div>

              <div className="profile-role">
                <ShieldCheck size={17} />
                <span>
                  {user?.role === "admin"
                    ? "Administrator"
                    : "Guest"}
                </span>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="profile-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* =================================
                STAT CARDS
            ================================= */}

            <div className="profile-stats">

              <div className="profile-stat-card">
                <div className="profile-stat-icon">
                  <Hotel size={21} />
                </div>

                <div>
                  <span>TOTAL STAYS</span>
                  <strong>{totalBookings}</strong>
                </div>
              </div>

              <div className="profile-stat-card">
                <div className="profile-stat-icon">
                  <Clock3 size={21} />
                </div>

                <div>
                  <span>UPCOMING</span>
                  <strong>
                    {upcomingBookings}
                  </strong>
                </div>
              </div>

              <div className="profile-stat-card">
                <div className="profile-stat-icon">
                  <IndianRupee size={21} />
                </div>

                <div>
                  <span>TOTAL SPENT</span>
                  <strong>
                    ₹
                    {totalSpent.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>

            </div>

            {/* =================================
                ACCOUNT DETAILS
            ================================= */}

            <div className="profile-grid">

              <div className="profile-card">
                <div className="profile-card-heading">
                  <User size={21} />
                  <div>
                    <p>ACCOUNT</p>
                    <h3>Personal Details</h3>
                  </div>
                </div>

                <div className="profile-details">

                  <div className="profile-detail-row">
                    <span>FULL NAME</span>
                    <strong>
                      {user?.name || "—"}
                    </strong>
                  </div>

                  <div className="profile-detail-row">
                    <span>EMAIL ADDRESS</span>
                    <strong>
                      {user?.email || "—"}
                    </strong>
                  </div>

                  <div className="profile-detail-row">
                    <span>ACCOUNT TYPE</span>
                    <strong>
                      {user?.role === "admin"
                        ? "Administrator"
                        : "Guest"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* =================================
                  QUICK ACTIONS
              ================================= */}

              <div className="profile-card">
                <div className="profile-card-heading">
                  <Hotel size={21} />
                  <div>
                    <p>YOUR JOURNEY</p>
                    <h3>Quick Actions</h3>
                  </div>
                </div>

                <div className="profile-actions">

                  <button
                    onClick={() =>
                      navigate("/my-bookings")
                    }
                  >
                    <span>
                      View My Bookings
                    </span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() =>
                      navigate("/rooms")
                    }
                  >
                    <span>
                      Explore Rooms
                    </span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    className="profile-logout-btn"
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                    <LogOut size={18} />
                  </button>

                </div>
              </div>

            </div>

            {/* =================================
                RECENT BOOKING
            ================================= */}

            <div className="profile-card profile-bookings-card">

              <div className="profile-card-heading">
                <CalendarDays size={21} />

                <div>
                  <p>RESERVATIONS</p>
                  <h3>Recent Stay</h3>
                </div>
              </div>

              {loadingBookings ? (
                <div className="profile-booking-loading">
                  <LoaderCircle
                    size={25}
                    className="booking-loader"
                  />
                  <span>
                    Loading reservations...
                  </span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="profile-no-booking">
                  <p>
                    You haven't made a reservation yet.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/rooms")
                    }
                  >
                    Discover Azurea
                    <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <div className="profile-booking-preview">

                  {bookings
                    .slice(0, 3)
                    .map((booking) => (
                      <div
                        className="profile-booking-row"
                        key={booking._id}
                      >
                        <div className="profile-booking-room">
                          <img
                            src={
                              booking.room?.image ||
                              "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=500&q=80"
                            }
                            alt={
                              booking.room?.name ||
                              "Azurea Room"
                            }
                          />

                          <div>
                            <strong>
                              {booking.room?.name ||
                                "Azurea Room"}
                            </strong>

                            <span>
                              {booking.nights}{" "}
                              {booking.nights === 1
                                ? "Night"
                                : "Nights"}
                            </span>
                          </div>
                        </div>

                        <div className="profile-booking-date">
                          <span>
                            CHECK-IN
                          </span>

                          <strong>
                            {booking.checkIn
                              ? new Date(
                                  booking.checkIn
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )
                              : "—"}
                          </strong>
                        </div>

                        <div className="profile-booking-price">
                          <span>TOTAL</span>

                          <strong>
                            ₹
                            {Number(
                              booking.totalPrice || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>
                      </div>
                    ))}

                  {bookings.length > 0 && (
                    <button
                      className="profile-view-all"
                      onClick={() =>
                        navigate("/my-bookings")
                      }
                    >
                      View All Reservations
                      <ArrowRight size={17} />
                    </button>
                  )}

                </div>
              )}

            </div>

          </div>
        </section>

        {/* =====================================
            CTA
        ===================================== */}

        <section className="profile-cta">
          <div className="profile-cta-content">
            <p>YOUR NEXT MEMORY AWAITS</p>

            <h2>
              Return to
              <span>Azurea.</span>
            </h2>

            <button
              onClick={() => navigate("/rooms")}
            >
              Explore Rooms
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Profile;