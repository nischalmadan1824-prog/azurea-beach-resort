import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
  Download,
  XCircle,
  CheckCircle2,
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

import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const bookingsSectionRef = useRef(null);
  const bookingCardsRef = useRef(null);
  const ctaRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  /* =========================================
     FETCH BOOKINGS
  ========================================= */

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get("/bookings/my-bookings");

        const activeBookings = (response.data?.bookings || []).filter(
          (booking) => booking.status !== "cancelled"
        );

        setBookings(activeBookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  /* =========================================
     GSAP ANIMATIONS
  ========================================= */

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const heroContent = heroContentRef.current;
      const heading = bookingsSectionRef.current?.querySelector(
        ".bookings-heading"
      );
      const cards = bookingCardsRef.current?.querySelectorAll(
        ".booking-card"
      );
      const emptyState = bookingCardsRef.current?.querySelector(
        ".bookings-empty"
      );
      const cta = ctaRef.current;

      /* HERO */

      if (heroContent) {
        const heroTag = heroContent.querySelector("p:first-child");
        const heroTitle = heroContent.querySelector("h1");
        const heroDescription = heroContent.querySelector(
          "div p"
        );

        gsap.set([heroTag, heroTitle, heroDescription], {
          opacity: 0,
          y: 30,
        });

        const heroTimeline = gsap.timeline({
          defaults: {
            ease: "power4.out",
          },
        });

        heroTimeline
          .to(heroTag, {
            opacity: 1,
            y: 0,
            duration: 0.7,
          })
          .to(
            heroTitle,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
            },
            "-=0.4"
          )
          .to(
            heroDescription,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
            },
            "-=0.5"
          );
      }

      /* HERO PARALLAX */

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

      /* SECTION HEADING */

      if (heading) {
        gsap.fromTo(
          heading,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      /* BOOKING CARDS */

      if (cards?.length) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bookingCardsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        cards.forEach((card) => {
          const image = card.querySelector(".booking-image img");

          if (!image) return;

          card.addEventListener("mouseenter", () => {
            gsap.to(image, {
              scale: 1.08,
              duration: 0.7,
              ease: "power3.out",
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(image, {
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
            });
          });
        });
      }

      /* EMPTY STATE */

      if (emptyState) {
        gsap.fromTo(
          emptyState,
          {
            opacity: 0,
            y: 35,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: emptyState,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      /* CTA */

      if (cta) {
        gsap.fromTo(
          cta,
          {
            opacity: 0,
            y: 50,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, [loading, isAuthenticated, bookings.length]);

  /* =========================================
     BUTTON HOVER
  ========================================= */

  const handleButtonEnter = (event) => {
    gsap.to(event.currentTarget, {
      y: -3,
      scale: 1.02,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = (event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  /* =========================================
     CANCEL BOOKING
  ========================================= */

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      setError("");

      await API.put(`/bookings/${bookingId}/cancel`);

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (err) {
      console.error("Cancel booking failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to cancel the booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  /* =========================================
     DATE FORMAT
  ========================================= */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================
     STATUS FORMAT
  ========================================= */

  const formatStatus = (status) => {
    if (!status) return "Confirmed";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="my-bookings-loading">
          <LoaderCircle
            size={45}
            className="booking-loader"
          />

          <p>Loading your reservations...</p>
        </div>

        <Footer />
      </>
    );
  }

  /* =========================================
     NOT LOGGED IN
  ========================================= */

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />

        <main className="my-bookings-page">
          <section className="bookings-hero">
            <div className="bookings-hero-overlay" />

            <div className="bookings-hero-content">
              <p>YOUR AZUREA JOURNEY</p>

              <h1>
                My <span>Bookings.</span>
              </h1>

              <div>
                <p>Sign in to view your reservations.</p>
              </div>
            </div>
          </section>

          <section className="bookings-empty-section">
            <div className="bookings-empty-content">
              <AlertCircle size={45} />

              <h2>Login Required</h2>

              <p>
                Please login to view and manage your
                Azurea reservations.
              </p>

              <button
                className="new-booking-btn"
                onClick={() => navigate("/login")}
                onMouseEnter={handleButtonEnter}
                onMouseLeave={handleButtonLeave}
              >
                Login
                <ArrowRight size={19} />
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  return (
    <>
      <Navbar />

      <main className="my-bookings-page" ref={pageRef}>
        {/* HERO */}

        <section
          className="bookings-hero"
          ref={heroRef}
        >
          <div className="bookings-hero-overlay" />

          <div
            className="bookings-hero-content"
            ref={heroContentRef}
          >
            <p>YOUR AZUREA JOURNEY</p>

            <h1>
              My <span>Bookings.</span>
            </h1>

            <div>
              <p>
                Every reservation is a new memory
                waiting to be created.
              </p>
            </div>
          </div>
        </section>

        {/* BOOKINGS */}

        <section
          className="bookings-section"
          ref={bookingsSectionRef}
        >
          <div className="bookings-container">
            <div className="bookings-heading">
              <div>
                <p className="bookings-tag">
                  RESERVATION HISTORY
                </p>

                <h2>
                  Your <span>Stays</span>
                </h2>
              </div>

              <p className="booking-count">
                {bookings.length}{" "}
                {bookings.length === 1
                  ? "Reservation"
                  : "Reservations"}
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="booking-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* EMPTY */}

            {bookings.length === 0 ? (
              <div
                className="bookings-empty"
                ref={bookingCardsRef}
              >
                <CalendarDays size={50} />

                <h2>No Reservations Yet</h2>

                <p>
                  Your next Azurea escape is
                  waiting for you.
                </p>

                <button
                  className="new-booking-btn"
                  onClick={() => navigate("/rooms")}
                  onMouseEnter={handleButtonEnter}
                  onMouseLeave={handleButtonLeave}
                >
                  Explore Rooms
                  <ArrowRight size={19} />
                </button>
              </div>
            ) : (
              <div
                className="booking-list"
                ref={bookingCardsRef}
              >
                {bookings.map((booking) => {
                  const room = booking.room;

                  const status = formatStatus(
                    booking.status
                  );

                  const isCancelled =
                    booking.status === "cancelled";

                  return (
                    <article
                      className="booking-card"
                      key={booking._id}
                    >
                      {/* IMAGE */}

                      <div className="booking-image">
                        <img
                          src={
                            room?.image ||
                            "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=85"
                          }
                          alt={
                            room?.name ||
                            "Azurea Resort"
                          }
                        />

                        <div
                          className={`booking-status ${
                            isCancelled
                              ? "cancelled"
                              : ""
                          }`}
                        >
                          {isCancelled ? (
                            <XCircle size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}

                          {status}
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="booking-content">
                        <div className="booking-top">
                          <div>
                            <p className="booking-id">
                              BOOKING #
                              {booking._id
                                ?.slice(-8)
                                .toUpperCase()}
                            </p>

                            <h3>
                              {room?.name ||
                                "Azurea Room"}
                            </h3>

                            <div className="booking-location">
                              <MapPin size={16} />

                              <span>
                                AZUREA Beach Resort
                              </span>
                            </div>
                          </div>

                          <div className="booking-price">
                            <span>Total</span>

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

                        {/* DETAILS */}

                        <div className="booking-details">
                          <div className="booking-detail">
                            <CalendarDays size={20} />

                            <div>
                              <span>CHECK-IN</span>

                              <strong>
                                {formatDate(
                                  booking.checkIn
                                )}
                              </strong>
                            </div>
                          </div>

                          <div className="booking-detail">
                            <CalendarDays size={20} />

                            <div>
                              <span>CHECK-OUT</span>

                              <strong>
                                {formatDate(
                                  booking.checkOut
                                )}
                              </strong>
                            </div>
                          </div>

                          <div className="booking-detail">
                            <Users size={20} />

                            <div>
                              <span>GUESTS</span>

                              <strong>
                                {booking.guests}{" "}
                                {booking.guests === 1
                                  ? "Guest"
                                  : "Guests"}
                              </strong>
                            </div>
                          </div>

                          <div className="booking-detail">
                            <Clock3 size={20} />

                            <div>
                              <span>DURATION</span>

                              <strong>
                                {booking.nights}{" "}
                                {booking.nights === 1
                                  ? "Night"
                                  : "Nights"}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="booking-actions">
                          <button
                            className="booking-primary-btn"
                            onClick={() =>
                              room?._id &&
                              navigate(
                                `/rooms/${room._id}`
                              )
                            }
                            onMouseEnter={
                              handleButtonEnter
                            }
                            onMouseLeave={
                              handleButtonLeave
                            }
                          >
                            View Details
                            <ArrowRight size={18} />
                          </button>

                          <button
                            className="booking-secondary-btn"
                            onClick={() =>
                              window.print()
                            }
                            onMouseEnter={
                              handleButtonEnter
                            }
                            onMouseLeave={
                              handleButtonLeave
                            }
                          >
                            <Download size={17} />
                            Download
                          </button>

                          {!isCancelled &&
                            booking.status ===
                              "confirmed" && (
                              <button
                                className="booking-cancel-btn"
                                disabled={
                                  cancellingId ===
                                  booking._id
                                }
                                onClick={() =>
                                  handleCancelBooking(
                                    booking._id
                                  )
                                }
                              >
                                {cancellingId ===
                                booking._id ? (
                                  <>
                                    <LoaderCircle
                                      size={17}
                                      className="booking-loader"
                                    />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={17} />
                                    Cancel Booking
                                  </>
                                )}
                              </button>
                            )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}

        <section
          className="new-booking-section"
          ref={ctaRef}
        >
          <div className="new-booking-content">
            <p>READY FOR YOUR NEXT ESCAPE?</p>

            <h2>
              Discover Your Next
              <span>Azurea Moment.</span>
            </h2>

            <button
              className="new-booking-btn"
              onClick={() => navigate("/rooms")}
              onMouseEnter={handleButtonEnter}
              onMouseLeave={handleButtonLeave}
            >
              Explore Rooms
              <ArrowRight size={19} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MyBookings;