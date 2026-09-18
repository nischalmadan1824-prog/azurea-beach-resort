import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Users,
  ArrowRight,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
  Sun,
  Leaf,
  Gem,
  Headphones,
  Tag,
  CheckCircle2,
  Clock3,
  CreditCard,
  Smartphone,
  Building2,
  X,
  LockKeyhole,
  Check,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { gsap } from "../animations/gsapSetup";

import "./Booking.css";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const submittingRef = useRef(false);

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroContentRef = useRef(null);

  const bookingMainRef = useRef(null);
  const bookingLeftRef = useRef(null);
  const bookingRightRef = useRef(null);

  const showcaseRef = useRef(null);
  const showcaseImageRef = useRef(null);

  const confirmationPageRef = useRef(null);
  const confirmationCardRef = useRef(null);
  const confirmationIconRef = useRef(null);

  const { isAuthenticated } = useAuth();

  const roomId = searchParams.get("room");
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = Number(searchParams.get("guests")) || 1;

  const [room, setRoom] = useState(null);

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  const [guests, setGuests] = useState(
    Math.max(1, initialGuests)
  );

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // ==========================================
  // LOCAL DATE
  // ==========================================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // FETCH ROOM
  // ==========================================

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setError("No room was selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/rooms/${roomId}`
        );

        const selectedRoom = response.data;

        setRoom(selectedRoom);

        // Keep guests within room capacity
        setGuests(
          Math.min(
            Math.max(1, initialGuests),
            selectedRoom.maxGuests
          )
        );
      } catch (err) {
        console.error(
          "Failed to fetch room:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load the selected room."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // ==========================================
  // CALCULATE NIGHTS
  // ==========================================

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(
      `${checkIn}T00:00:00`
    );

    const end = new Date(
      `${checkOut}T00:00:00`
    );

    const difference = end - start;

    const nights = Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  const total = room
    ? nights * Number(room.price)
    : 0;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatConfirmationDate = (date) => {
    if (!date) return "—";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // MAIN PAGE ANIMATIONS
  // ==========================================

  useEffect(() => {
    if (
      loading ||
      !room ||
      !pageRef.current ||
      success
    ) {
      return;
    }

    const page = pageRef.current;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      // HERO IMAGE
      timeline.fromTo(
        heroImageRef.current,
        {
          scale: 1.12,
        },
        {
          scale: 1,
          duration: 1.7,
        }
      );

      // HERO OVERLAY
      timeline.fromTo(
        ".booking-hero-overlay",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.9,
        },
        "-=1.2"
      );

      // HERO EYEBROW
      timeline.fromTo(
        heroContentRef.current?.querySelector(
          "p"
        ),
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
        "-=0.6"
      );

      // HERO TITLE
      timeline.fromTo(
        heroContentRef.current?.querySelector(
          "h1"
        ),
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.45"
      );

      // HERO PARALLAX
      gsap.to(heroImageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // LEFT CONTENT
      gsap.fromTo(
        bookingLeftRef.current,
        {
          opacity: 0,
          x: -55,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bookingMainRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      // RIGHT CONTENT
      gsap.fromTo(
        bookingRightRef.current,
        {
          opacity: 0,
          x: 55,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bookingMainRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      // SHOWCASE IMAGE
      if (showcaseImageRef.current) {
        gsap.fromTo(
          showcaseImageRef.current,
          {
            scale: 1.12,
          },
          {
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          }
        );
      }

      // SHOWCASE PARALLAX
      if (showcaseRef.current) {
        gsap.to(
          showcaseImageRef.current,
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // FORM SECTIONS
      const formItems =
        bookingLeftRef.current?.querySelectorAll(
          ".booking-input-group, .guest-selector, .booking-security, .availability-btn, .price-guarantee, .booking-services"
        );

      if (formItems?.length) {
        gsap.fromTo(
          formItems,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bookingLeftRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      // FEATURE CARDS
      const featureCards =
        bookingRightRef.current?.querySelectorAll(
          ".booking-feature-card"
        );

      if (featureCards?.length) {
        gsap.fromTo(
          featureCards,
          {
            opacity: 0,
            y: 30,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                bookingRightRef.current,
              start: "top 65%",
              once: true,
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, [loading, room, success]);

  // ==========================================
  // CONFIRMATION ANIMATION
  // ==========================================

  useEffect(() => {
    if (
      !success ||
      !confirmationPageRef.current ||
      !confirmationCardRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        confirmationCardRef.current,
        {
          opacity: 0,
          y: 45,
          scale: 0.94,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
        }
      );

      timeline.fromTo(
        confirmationIconRef.current,
        {
          scale: 0,
          rotation: -25,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.65,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

      const details =
        confirmationCardRef.current.querySelectorAll(
          ".confirmation-room, .confirmation-details, .confirmation-total, .confirmation-actions, .confirmation-security"
        );

      if (details.length) {
        timeline.fromTo(
          details,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.25"
        );
      }
    }, confirmationPageRef.current);

    return () => ctx.revert();
  }, [success]);

  // ==========================================
  // BUTTON HOVER
  // ==========================================

  const handleButtonEnter = (event) => {
    gsap.to(event.currentTarget, {
      y: -3,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = (event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      duration: 0.3,
      ease: "power3.out",
    });
  };
  const handleDemoPayment = async () => {
    if (paymentProcessing || submittingRef.current) {
      return;
    }

    setError("");
    setPaymentProcessing(true);

    try {
      // Small delay to simulate payment processing
      await new Promise((resolve) =>
        setTimeout(resolve, 1800)
      );

      submittingRef.current = true;

      const response = await API.post("/bookings", {
        roomId: room._id,
        checkIn,
        checkOut,
        guests,
        paymentMethod,
      });

      console.log(
        "Booking created after demo payment:",
        response.data
      );

      setShowPayment(false);

      setSuccess(
        "Your reservation has been confirmed successfully!"
      );
    } catch (err) {
      console.error(
        "Payment / booking failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to complete your booking. Please try again."
      );
    } finally {
      setPaymentProcessing(false);
      submittingRef.current = false;
    }
  };
  // ==========================================
  // CONFIRM BOOKING
  // ==========================================

  const handleConfirmBooking = async () => {
    if (submittingRef.current) {
      return;
    }

    setError("");
    setSuccess("");

    // LOGIN CHECK
    if (!isAuthenticated) {
      const params = new URLSearchParams({
        room: room._id,
      });

      if (checkIn) {
        params.set("checkIn", checkIn);
      }

      if (checkOut) {
        params.set("checkOut", checkOut);
      }

      params.set("guests", String(guests));

      const bookingPath = `/booking?${params.toString()}`;

      navigate(
        `/login?redirect=${encodeURIComponent(bookingPath)}`
      );

      return;
    }

    // DATE VALIDATION
    if (!checkIn || !checkOut) {
      setError(
        "Please select your check-in and check-out dates."
      );
      return;
    }

    if (nights <= 0) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    // GUEST VALIDATION
    if (guests < 1) {
      setError("At least one guest is required.");
      return;
    }

    if (guests > room.maxGuests) {
      setError(
        `This room can accommodate a maximum of ${room.maxGuests} guests.`
      );
      return;
    }

    // ROOM AVAILABILITY
    if (!room.available) {
      setError("This room is currently unavailable.");
      return;
    }

    // Open payment modal
    setShowPayment(true);
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="booking-loading">
          <LoaderCircle
            size={45}
            className="booking-loader"
          />

          <p>
            Preparing your reservation...
          </p>
        </div>

        <Footer />
      </>
    );
  }

  // ==========================================
  // ROOM ERROR
  // ==========================================

  if (!room) {
    return (
      <>
        <Navbar />

        <div className="booking-error">
          <AlertCircle size={42} />

          <h2>
            Unable to Continue
          </h2>

          <p>
            {error ||
              "The selected room could not be found."}
          </p>

          <button
            onClick={() =>
              navigate("/rooms")
            }
            onMouseEnter={
              handleButtonEnter
            }
            onMouseLeave={
              handleButtonLeave
            }
          >
            Browse Rooms
            <ArrowRight size={18} />
          </button>
        </div>

        <Footer />
      </>
    );
  }

  // ==========================================
  // CONFIRMATION SCREEN
  // ==========================================

  if (success) {
    return (
      <>
        <Navbar />

        <main
          className="booking-confirmation-page"
          ref={confirmationPageRef}
        >
          <div className="booking-confirmation-bg" />

          <div
            className="booking-confirmation-card"
            ref={confirmationCardRef}
          >
            <div
              className="confirmation-icon"
              ref={confirmationIconRef}
            >
              <CheckCircle2 size={42} />
            </div>

            <p className="confirmation-tag">
              AZUREA BEACH RESORT
            </p>

            <h1>
              Reservation
              <span> Confirmed.</span>
            </h1>

            <p className="confirmation-message">
              Your paradise escape has been
              successfully reserved. We can't
              wait to welcome you.
            </p>

            {/* ROOM */}

            <div className="confirmation-room">
              <img
                src={room.image}
                alt={room.name}
              />

              <div>
                <span>
                  {room.type?.toUpperCase()}
                </span>

                <h3>{room.name}</h3>

                <p>
                  AZUREA Beach Resort
                </p>
              </div>
            </div>

            {/* BOOKING DETAILS */}

            <div className="confirmation-details">
              <div>
                <CalendarDays size={19} />

                <span>CHECK-IN</span>

                <strong>
                  {formatConfirmationDate(
                    checkIn
                  )}
                </strong>
              </div>

              <div>
                <CalendarDays size={19} />

                <span>CHECK-OUT</span>

                <strong>
                  {formatConfirmationDate(
                    checkOut
                  )}
                </strong>
              </div>

              <div>
                <Users size={19} />

                <span>GUESTS</span>

                <strong>
                  {guests}
                  {guests === 1
                    ? " Guest"
                    : " Guests"}
                </strong>
              </div>

              <div>
                <Clock3 size={19} />

                <span>DURATION</span>

                <strong>
                  {nights}
                  {nights === 1
                    ? " Night"
                    : " Nights"}
                </strong>
              </div>
            </div>

            {/* TOTAL */}

            <div className="confirmation-total">
              <div>
                <span>TOTAL STAY</span>

                <small>
                  Best price guaranteed
                </small>
              </div>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            {/* ACTIONS */}

            <div className="confirmation-actions">
              <button
                className="confirmation-primary"
                onClick={() =>
                  navigate(
                    "/my-bookings"
                  )
                }
                onMouseEnter={
                  handleButtonEnter
                }
                onMouseLeave={
                  handleButtonLeave
                }
              >
                View My Bookings
                <ArrowRight size={19} />
              </button>

              <button
                className="confirmation-secondary"
                onClick={() =>
                  navigate("/")
                }
              >
                Back to Resort
              </button>
            </div>

            <div className="confirmation-security">
              <ShieldCheck size={17} />

              <span>
                Your reservation has been
                securely recorded.
              </span>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // MAIN BOOKING PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <main
        className="booking-page"
        ref={pageRef}
      >
        {/* =====================================
            HERO
        ===================================== */}

        <section
          className="booking-hero"
          ref={heroRef}
        >
          <div
            className="booking-hero-image"
            ref={heroImageRef}
          />

          <div className="booking-hero-overlay" />

          <div
            className="booking-hero-content"
            ref={heroContentRef}
          >
            <p>
              PLAN YOUR ESCAPE
            </p>

            <h1>
              Book Your
              <span>
                {" "}
                Paradise.
              </span>
            </h1>
          </div>
        </section>

        {/* =====================================
            MAIN BOOKING AREA
        ===================================== */}

        <section
          className="booking-main"
          ref={bookingMainRef}
        >
          {/* LEFT */}

          <div
            className="booking-left"
            ref={bookingLeftRef}
          >
            <div className="booking-heading">
              <p>
                YOUR RESERVATION
              </p>

              <h2>
                Choose Your
                <span>
                  Perfect Dates.
                </span>
              </h2>

              <p className="booking-intro">
                Plan your getaway to paradise.
                Select your dates and guests
                to experience the best of
                AZUREA.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="booking-message">
                <AlertCircle size={18} />

                <span>{error}</span>
              </div>
            )}

            {/* DATES */}

            <div className="booking-fields">
              <div className="booking-input-group">
                <label>
                  <CalendarDays size={18} />
                  Check In
                </label>

                <input
                  type="date"
                  value={checkIn}
                  min={getToday()}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setCheckIn(value);

                    if (
                      checkOut &&
                      value >= checkOut
                    ) {
                      setCheckOut("");
                    }

                    setError("");
                  }}
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <CalendarDays size={18} />
                  Check Out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  min={
                    checkIn ||
                    getToday()
                  }
                  onChange={(event) => {
                    setCheckOut(
                      event.target.value
                    );

                    setError("");
                  }}
                />
              </div>
            </div>

            {/* GUESTS */}

            <div className="guest-selector">
              <div className="guest-info">
                <Users size={24} />

                <div>
                  <h4>Guests</h4>

                  <p>
                    Maximum{" "}
                    {room.maxGuests} guests
                  </p>
                </div>
              </div>

              <div className="guest-controls">
                <button
                  type="button"
                  disabled={guests <= 1}
                  onClick={() => {
                    setGuests(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    );

                    setError("");
                  }}
                >
                  −
                </button>

                <span>{guests}</span>

                <button
                  type="button"
                  disabled={
                    guests >=
                    room.maxGuests
                  }
                  onClick={() => {
                    setGuests(
                      (current) =>
                        Math.min(
                          room.maxGuests,
                          current + 1
                        )
                    );

                    setError("");
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* SECURITY */}

            <div className="booking-security">
              <ShieldCheck size={22} />

              <p>
                Your reservation details are
                secure and protected.
              </p>
            </div>

            {/* CONFIRM */}

            <button
              className="availability-btn"
              onClick={
                handleConfirmBooking
              }
              disabled={
                !room.available ||
                bookingLoading
              }
              onMouseEnter={
                handleButtonEnter
              }
              onMouseLeave={
                handleButtonLeave
              }
            >
              {bookingLoading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="booking-loader"
                  />

                  Confirming...
                </>
              ) : room.available ? (
                <>
                  {isAuthenticated
                    ? "Confirm Booking"
                    : "Login to Book"}

                  <ArrowRight size={19} />
                </>
              ) : (
                "Currently Unavailable"
              )}
            </button>

            {/* GUARANTEE */}

            <div className="price-guarantee">
              <span />
              <p>
                BEST PRICE GUARANTEED
              </p>
              <span />
            </div>

            {/* SERVICES */}

            <div className="booking-services">
              <div>
                <Tag size={19} />

                <span>
                  No Hidden Fees
                </span>
              </div>

              <div>
                <Headphones size={19} />

                <span>
                  24/7 Support
                </span>
              </div>

              <div>
                <ShieldCheck size={19} />

                <span>
                  Secure Booking
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="booking-right"
            ref={bookingRightRef}
          >
            {/* ROOM SHOWCASE */}

            <div
              className="room-showcase"
              ref={showcaseRef}
            >
              <img
                ref={showcaseImageRef}
                src={room.image}
                alt={room.name}
              />

              <div className="room-showcase-overlay" />

              <div className="room-showcase-content">
                <p>
                  {room.type?.toUpperCase()}
                </p>

                <h3>
                  Unwind in
                  <span>
                    Luxury.
                  </span>
                </h3>

                <div className="showcase-line" />

                <strong>
                  {room.name}
                </strong>
              </div>

              <div className="showcase-quote">
                <span>“</span>

                Wake up to ocean views.
                <br />
                Sleep to the sound of
                waves.

                <span>”</span>
              </div>
            </div>

            {/* PRICE */}

            <div className="room-price-panel">
              <div>
                <p>YOUR STAY</p>

                <h3>
                  ₹
                  {Number(
                    room.price
                  ).toLocaleString(
                    "en-IN"
                  )}

                  <span>
                    {" "}
                    / night
                  </span>
                </h3>
              </div>

              {nights > 0 && (
                <div className="stay-total">
                  <small>
                    {nights}{" "}
                    {nights === 1
                      ? "night"
                      : "nights"}
                  </small>

                  <strong>
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              )}
            </div>

            {/* FEATURES */}

            <div className="booking-feature-grid">
              <div className="booking-feature-card">
                <Sun size={28} />

                <div>
                  <h4>
                    Breathtaking Views
                  </h4>

                  <p>
                    Wake up to stunning
                    ocean scenery.
                  </p>
                </div>
              </div>

              <div className="booking-feature-card">
                <Leaf size={28} />

                <div>
                  <h4>
                    Premium Comfort
                  </h4>

                  <p>
                    Thoughtfully designed
                    for relaxation.
                  </p>
                </div>
              </div>

              <div className="booking-feature-card">
                <Gem size={28} />

                <div>
                  <h4>
                    Unforgettable
                    Experiences
                  </h4>

                  <p>
                    Create memories that
                    last forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
   

  {/* ==========================================
          DEMO PAYMENT MODAL
      ========================================== */}

  {
    showPayment && (
      <div className="payment-modal-backdrop">
        <div className="payment-modal">

          {/* HEADER */}
          <div className="payment-modal-header">
            <div>
              <p>AZUREA BEACH RESORT</p>
              <h2>Complete Your Stay</h2>
            </div>

            <button
              type="button"
              className="payment-close"
              onClick={() => {
                if (!paymentProcessing) {
                  setShowPayment(false);
                }
              }}
              disabled={paymentProcessing}
            >
              <X size={21} />
            </button>
          </div>

          {/* BOOKING SUMMARY */}
          <div className="payment-summary">
            <div>
              <span>ROOM</span>
              <strong>{room.name}</strong>
            </div>

            <div>
              <span>DATES</span>
              <strong>
                {formatConfirmationDate(checkIn)}
                {" → "}
                {formatConfirmationDate(checkOut)}
              </strong>
            </div>

            <div>
              <span>GUESTS</span>
              <strong>
                {guests}{" "}
                {guests === 1 ? "Guest" : "Guests"}
              </strong>
            </div>

            <div className="payment-total">
              <span>TOTAL</span>
              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="payment-section">
            <p className="payment-section-label">
              SELECT PAYMENT METHOD
            </p>

            <div className="payment-methods">

              <button
                type="button"
                className={`payment-method ${paymentMethod === "upi"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setPaymentMethod("upi")
                }
                disabled={paymentProcessing}
              >
                <Smartphone size={23} />

                <div>
                  <strong>UPI</strong>
                  <span>Google Pay · PhonePe · Paytm</span>
                </div>

                {paymentMethod === "upi" && (
                  <Check size={19} />
                )}
              </button>

              <button
                type="button"
                className={`payment-method ${paymentMethod === "card"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setPaymentMethod("card")
                }
                disabled={paymentProcessing}
              >
                <CreditCard size={23} />

                <div>
                  <strong>Card</strong>
                  <span>Credit or debit card</span>
                </div>

                {paymentMethod === "card" && (
                  <Check size={19} />
                )}
              </button>

              <button
                type="button"
                className={`payment-method ${paymentMethod === "netbanking"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setPaymentMethod("netbanking")
                }
                disabled={paymentProcessing}
              >
                <Building2 size={23} />

                <div>
                  <strong>Net Banking</strong>
                  <span>All major banks supported</span>
                </div>

                {paymentMethod === "netbanking" && (
                  <Check size={19} />
                )}
              </button>

            </div>
          </div>

          {/* DEMO NOTICE */}
          <div className="payment-demo-notice">
            <LockKeyhole size={17} />

            <div>
              <strong>Portfolio Demo Payment</strong>
              <span>
                This is a simulated payment. No real
                money or payment details are processed.
              </span>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            type="button"
            className="payment-pay-button"
            onClick={handleDemoPayment}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? (
              <>
                <LoaderCircle
                  size={19}
                  className="booking-loader"
                />

                Processing Secure Payment...
              </>
            ) : (
              <>
                Pay ₹{total.toLocaleString("en-IN")}

                <ArrowRight size={19} />
              </>
            )}
          </button>

          <p className="payment-secure-text">
            <ShieldCheck size={15} />
            Secure demo checkout · AZUREA Beach Resort
          </p>

        </div>
      </div>
    )
  }
    </>
  );
};

export default Booking;