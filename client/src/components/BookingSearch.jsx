import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Users,
  ChevronDown,
  Search,
  ArrowRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { gsap } from "../animations/gsapSetup";
import "./BookingSearch.css";

const BookingSearch = () => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const searchBoxRef = useRef(null);
  const resultsRef = useRef(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const [showGuests, setShowGuests] = useState(false);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // GSAP SEARCH BAR ANIMATION
  // =========================================

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        searchBoxRef.current,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // =========================================
  // CHECK AVAILABILITY
  // =========================================

  const handleSearch = async () => {
    setError("");
    setSearched(false);

    if (!checkIn || !checkOut) {
      setError(
        "Please select your check-in and check-out dates."
      );
      return;
    }

    if (checkIn >= checkOut) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    if (guests < 1) {
      setError("Please select at least 1 guest.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.get(
        `/bookings/check-availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );

      const availableRooms =
        response.data.rooms || [];

      setRooms(availableRooms);
      setSearched(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      setTimeout(() => {
        const cards =
          resultsRef.current?.querySelectorAll(
            ".booking-result-card"
          );

        if (cards?.length) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 45,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
            }
          );
        }
      }, 150);
    } catch (err) {
      console.error(
        "Availability search failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to check availability. Please try again."
      );

      setRooms([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SELECT ROOM
  // =========================================

  const handleSelectRoom = (room) => {
    const params = new URLSearchParams({
      room: room._id,
      checkIn,
      checkOut,
      guests: String(guests),
    });

    navigate(`/booking?${params.toString()}`);
  };

  // =========================================
  // TODAY
  // =========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <section
      className="booking-search-section"
      ref={sectionRef}
    >
      <div
        className="booking-search"
        ref={searchBoxRef}
      >
        {/* CHECK IN */}

        <div className="booking-field">
          <div className="field-icon">
            <CalendarDays
              size={21}
              strokeWidth={1.7}
            />
          </div>

          <div className="field-content">
            <span>CHECK IN</span>

            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);

                if (
                  checkOut &&
                  event.target.value >= checkOut
                ) {
                  setCheckOut("");
                }

                setError("");
              }}
            />
          </div>
        </div>

        <div className="booking-divider" />

        {/* CHECK OUT */}

        <div className="booking-field">
          <div className="field-icon">
            <CalendarDays
              size={21}
              strokeWidth={1.7}
            />
          </div>

          <div className="field-content">
            <span>CHECK OUT</span>

            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setError("");
              }}
            />
          </div>
        </div>

        <div className="booking-divider" />

        {/* GUESTS */}

        <div
          className="booking-field guests-field"
          onClick={() =>
            setShowGuests((previous) => !previous)
          }
        >
          <div className="field-icon">
            <Users
              size={21}
              strokeWidth={1.7}
            />
          </div>

          <div className="field-content">
            <span>GUESTS</span>

            <p>
              {guests}{" "}
              {guests === 1
                ? "Guest"
                : "Guests"}
            </p>
          </div>

          <ChevronDown
            className={`guest-arrow ${
              showGuests
                ? "guest-arrow-open"
                : ""
            }`}
            size={18}
            strokeWidth={1.8}
          />

          {/* GUEST SELECTOR */}

          {showGuests && (
            <div
              className="guest-selector"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div>
                <strong>Guests</strong>

                <span>
                  Select number of guests
                </span>
              </div>

              <div className="guest-controls">
                <button
                  type="button"
                  disabled={guests <= 1}
                  onClick={() =>
                    setGuests((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                >
                  −
                </button>

                <strong>{guests}</strong>

                <button
                  type="button"
                  disabled={guests >= 12}
                  onClick={() =>
                    setGuests((value) =>
                      Math.min(12, value + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}

        <button
          className="booking-search-button"
          type="button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="search-spinner" />
              <span>CHECKING...</span>
            </>
          ) : (
            <>
              <Search
                size={18}
                strokeWidth={2}
              />

              <span>
                CHECK AVAILABILITY
              </span>
            </>
          )}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="booking-search-message error-message">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* RESULTS */}

      {searched && (
        <div
          className="booking-results"
          ref={resultsRef}
        >
          <div className="booking-results-header">
            <div>
              <p>YOUR AZUREA ESCAPE</p>

              <h3>
                {rooms.length > 0
                  ? `${rooms.length} ${
                      rooms.length === 1
                        ? "Room"
                        : "Rooms"
                    } Available`
                  : "No Rooms Available"}
              </h3>

              {rooms.length > 0 && (
                <span>
                  Available for {guests}{" "}
                  {guests === 1
                    ? "guest"
                    : "guests"}{" "}
                  · {checkIn} → {checkOut}
                </span>
              )}
            </div>
          </div>

          {rooms.length > 0 ? (
            <div className="booking-results-grid">
              {rooms.map((room) => (
                <article
                  className="booking-result-card"
                  key={room._id}
                >
                  <div className="booking-result-image">
                    <img
                      src={room.image}
                      alt={room.name}
                    />

                    <span>
                      {room.type}
                    </span>
                  </div>

                  <div className="booking-result-content">
                    <h4>{room.name}</h4>

                    <p>
                      {room.description}
                    </p>

                    <div className="booking-result-meta">
                      <span>
                        Up to{" "}
                        {room.maxGuests} Guests
                      </span>

                      <strong>
                        ₹
                        {Number(
                          room.price
                        ).toLocaleString(
                          "en-IN"
                        )}

                        <small>
                          / night
                        </small>
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectRoom(room)
                      }
                    >
                      <span>
                        Select Room
                      </span>

                      <ArrowRight
                        size={17}
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-rooms-message">
              <div>
                <CalendarDays size={30} />
              </div>

              <h4>
                Nothing available for
                these dates.
              </h4>

              <p>
                Try different dates or
                reduce the number of
                guests to discover
                available stays.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default BookingSearch;





