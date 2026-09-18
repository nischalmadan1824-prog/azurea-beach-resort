import { useEffect, useRef, useState } from "react";
import { Search, Users, ArrowRight, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { gsap } from "../animations/gsapSetup";
import "./Rooms.css";

const Rooms = () => {
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const heroContentRef = useRef(null);
  const searchBoxRef = useRef(null);
  const filterSectionRef = useRef(null);
  const filterButtonsRef = useRef(null);
  const gridRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  // ==========================================
  // FETCH ROOMS
  // ==========================================

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/rooms");

        setRooms(response.data?.rooms || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load rooms. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // ==========================================
  // HERO + PAGE ANIMATIONS
  // ==========================================

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      heroTimeline
        .fromTo(
          heroImageRef.current,
          {
            scale: 1.12,
          },
          {
            scale: 1,
            duration: 1.8,
          }
        )
        .fromTo(
          heroOverlayRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 1,
          },
          "-=1.3"
        )
        .fromTo(
          heroContentRef.current?.querySelector(
            ".rooms-hero-eyebrow"
          ),
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.7"
        )
        .fromTo(
          heroContentRef.current?.querySelector("h1"),
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.45"
        )
        .fromTo(
          searchBoxRef.current,
          {
            opacity: 0,
            y: 30,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
          },
          "-=0.55"
        );

      // Hero image parallax
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

      // Filter section reveal
      gsap.fromTo(
        filterSectionRef.current,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: filterSectionRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, page);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // FILTER BUTTON ANIMATION
  // ==========================================

  useEffect(() => {
    if (!filterButtonsRef.current) return;

    const buttons =
      filterButtonsRef.current.querySelectorAll(
        ".room-type-filters button"
      );

    if (!buttons.length) return;

    gsap.fromTo(
      buttons,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.out",
      }
    );
  }, [roomTypesLength(rooms)]);

  // ==========================================
  // ROOM CARD ANIMATIONS
  // ==========================================

  useEffect(() => {
    if (loading || error || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".room-card");

    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 55,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform",
        }
      );

      cards.forEach((card) => {
        const image = card.querySelector(".room-card-image img");

        // Image movement
        if (image) {
          gsap.fromTo(
            image,
            {
              scale: 1.08,
            },
            {
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
            }
          );
        }

        // 3D card interaction
        const handleMove = (event) => {
          const rect = card.getBoundingClientRect();

          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const rotateY =
            ((x / rect.width) - 0.5) * 5;

          const rotateX =
            ((y / rect.height) - 0.5) * -5;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 900,
            duration: 0.35,
            ease: "power2.out",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power3.out",
          });
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);

        card._roomsMove = handleMove;
        card._roomsLeave = handleLeave;
      });
    }, gridRef.current);

    return () => {
      cards.forEach((card) => {
        if (card._roomsMove) {
          card.removeEventListener(
            "mousemove",
            card._roomsMove
          );
        }

        if (card._roomsLeave) {
          card.removeEventListener(
            "mouseleave",
            card._roomsLeave
          );
        }
      });

      ctx.revert();
    };
  }, [rooms, search, filterType, loading, error]);

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
      ease: "power2.out",
    });
  };

  // ==========================================
  // FILTER DATA
  // ==========================================

  const roomTypes = [
    "All",
    ...new Set(
      rooms
        .map((room) => room.type)
        .filter(Boolean)
    ),
  ];

  const filteredRooms = rooms.filter((room) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      room.name?.toLowerCase().includes(searchValue) ||
      room.description
        ?.toLowerCase()
        .includes(searchValue);

    const matchesType =
      filterType === "All" ||
      room.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <Navbar />

      <main
        className="rooms-page"
        ref={pageRef}
      >
        {/* ==================================
            HERO
        ================================== */}

        <section
          className="rooms-hero"
          ref={heroRef}
        >
          <div
            ref={heroImageRef}
            className="rooms-hero-image"
          />

          <div
            className="rooms-hero-overlay"
            ref={heroOverlayRef}
          />

          <div
            className="rooms-hero-content"
            ref={heroContentRef}
          >
            <p className="rooms-hero-eyebrow">
              STAY IN PARADISE
            </p>

            <h1>
              Find Your Perfect
              <span> Escape</span>
            </h1>

            <div
              className="rooms-search-box"
              ref={searchBoxRef}
            >
              <Search size={20} />

              <input
                type="text"
                placeholder="Search rooms..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* ==================================
            FILTERS
        ================================== */}

        <section
          className="rooms-filter-section"
          ref={filterSectionRef}
        >
          <div className="rooms-filter-container">
            <div>
              <p className="rooms-filter-label">
                EXPLORE OUR ROOMS
              </p>

              <h2>Choose Your Stay</h2>
            </div>

            <div
              className="room-type-filters"
              ref={filterButtonsRef}
            >
              {roomTypes.map((type) => (
                <button
                  key={type}
                  className={
                    filterType === type
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFilterType(type)
                  }
                  onMouseEnter={
                    handleButtonEnter
                  }
                  onMouseLeave={
                    handleButtonLeave
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================
            ROOMS
        ================================== */}

        <section className="rooms-grid-section">
          {loading ? (
            <div className="rooms-loading">
              <LoaderCircle
                className="rooms-loader"
                size={40}
              />

              <p>
                Discovering your perfect stay...
              </p>
            </div>
          ) : error ? (
            <div className="rooms-error">
              <h3>
                Something went wrong
              </h3>

              <p>{error}</p>

              <button
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="rooms-empty">
              <h3>No rooms found</h3>

              <p>
                Try changing your search or room
                category.
              </p>
            </div>
          ) : (
            <div
              className="rooms-grid"
              ref={gridRef}
            >
              {filteredRooms.map((room) => (
                <article
                  key={room._id}
                  className="room-card"
                >
                  <div className="room-card-image">
                    <img
                      src={room.image}
                      alt={room.name}
                    />

                    {!room.available && (
                      <span className="room-unavailable">
                        Currently Unavailable
                      </span>
                    )}

                    {room.available && (
                      <span className="room-available">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="room-card-content">
                    <p className="room-card-type">
                      {room.type}
                    </p>

                    <h3>{room.name}</h3>

                    <p className="room-card-description">
                      {room.description}
                    </p>

                    <div className="room-card-details">
                      <span>
                        <Users size={16} />
                        Up to {room.maxGuests} guests
                      </span>

                      <span>
                        ₹
                        {Number(
                          room.price
                        ).toLocaleString("en-IN")}
                        <small>
                          {" "}
                          / night
                        </small>
                      </span>
                    </div>

                    <button
                      className="room-view-btn"
                      onClick={() =>
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
                      View Room
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

// Small helper so the filter animation
// re-runs when backend room types change.
const roomTypesLength = (rooms) =>
  new Set(
    rooms
      .map((room) => room.type)
      .filter(Boolean)
  ).size;

export default Rooms;