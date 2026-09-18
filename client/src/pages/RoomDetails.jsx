import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { gsap } from "../animations/gsapSetup";

import {
  Users,
  BedDouble,
  Maximize,
  Wifi,
  Tv,
  Coffee,
  Bath,
  Wind,
  ArrowRight,
  Check,
  LoaderCircle,
} from "lucide-react";

import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroContentRef = useRef(null);
  const summaryRef = useRef(null);
  const priceCardRef = useRef(null);
  const amenitiesRef = useRef(null);
  const experienceRef = useRef(null);
  const experienceImageRef = useRef(null);
  const galleryRef = useRef(null);
  const finalCtaRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ROOM
  // ==========================================

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/rooms/${id}`);

        setRoom(response.data);
      } catch (err) {
        console.error("Failed to fetch room:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load room details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // ==========================================
  // AMENITY ICON
  // ==========================================

  const getAmenityIcon = (amenity) => {
    const value = amenity.toLowerCase();

    if (value.includes("wifi")) {
      return <Wifi size={22} />;
    }

    if (value.includes("tv")) {
      return <Tv size={22} />;
    }

    if (value.includes("coffee")) {
      return <Coffee size={22} />;
    }

    if (
      value.includes("bath") ||
      value.includes("bathroom")
    ) {
      return <Bath size={22} />;
    }

    if (
      value.includes("air") ||
      value.includes("conditioning") ||
      value.includes("ac")
    ) {
      return <Wind size={22} />;
    }

    return <Check size={22} />;
  };

  // ==========================================
  // PAGE ANIMATIONS
  // ==========================================

  useEffect(() => {
    if (!room || loading || !pageRef.current) {
      return;
    }

    const page = pageRef.current;

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      // HERO IMAGE
      heroTimeline.fromTo(
        heroImageRef.current,
        {
          scale: 1.15,
        },
        {
          scale: 1,
          duration: 1.8,
        }
      );

      // HERO OVERLAY
      heroTimeline.fromTo(
        ".room-details-overlay",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        },
        "-=1.3"
      );

      // HERO TEXT
      heroTimeline.fromTo(
        heroContentRef.current?.querySelector(
          ".room-details-hero-type"
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
      );

      heroTimeline.fromTo(
        heroContentRef.current?.querySelector("h1"),
        {
          opacity: 0,
          y: 55,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.45"
      );

      // HERO PARALLAX
      gsap.to(heroImageRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // SUMMARY
      gsap.fromTo(
        summaryRef.current?.querySelector(
          ".room-summary-left"
        ),
        {
          opacity: 0,
          x: -60,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: summaryRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      // PRICE CARD
      gsap.fromTo(
        priceCardRef.current,
        {
          opacity: 0,
          x: 60,
          y: 20,
          scale: 0.96,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: summaryRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // ROOM SPECS
      const specs =
        summaryRef.current?.querySelectorAll(
          ".room-specs > div"
        );

      if (specs?.length) {
        gsap.fromTo(
          specs,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: summaryRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      // AMENITIES HEADING
      gsap.fromTo(
        amenitiesRef.current?.querySelector(
          ".amenities-heading"
        ),
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
            trigger: amenitiesRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // AMENITY CARDS
      const amenityCards =
        amenitiesRef.current?.querySelectorAll(
          ".amenity-card"
        );

      if (amenityCards?.length) {
        gsap.fromTo(
          amenityCards,
          {
            opacity: 0,
            y: 35,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: amenitiesRef.current,
              start: "top 65%",
              once: true,
            },
          }
        );
      }

      // EXPERIENCE IMAGE
      gsap.fromTo(
        experienceImageRef.current,
        {
          opacity: 0,
          x: -60,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: experienceRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // EXPERIENCE IMAGE PARALLAX
      const experienceImage =
        experienceImageRef.current?.querySelector("img");

      if (experienceImage) {
        gsap.fromTo(
          experienceImage,
          {
            scale: 1.15,
          },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: experienceRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // EXPERIENCE TEXT
      gsap.fromTo(
        experienceRef.current?.querySelector(
          ".experience-text"
        ),
        {
          opacity: 0,
          x: 60,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: experienceRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // GALLERY HEADING
      gsap.fromTo(
        galleryRef.current?.querySelector(
          ".gallery-heading"
        ),
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // GALLERY IMAGES
      const galleryImages =
        galleryRef.current?.querySelectorAll(
          ".room-gallery-grid img"
        );

      if (galleryImages?.length) {
        gsap.fromTo(
          galleryImages,
          {
            opacity: 0,
            y: 50,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      // FINAL CTA
      gsap.fromTo(
        finalCtaRef.current?.querySelector(
          ".room-final-cta-content"
        ),
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: finalCtaRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // FINAL CTA BACKGROUND PARALLAX
      gsap.to(finalCtaRef.current, {
        backgroundPosition: "50% 65%",
        ease: "none",
        scrollTrigger: {
          trigger: finalCtaRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, page);

    return () => ctx.revert();
  }, [room, loading]);

  // ==========================================
  // BUTTON INTERACTION
  // ==========================================

  const handleButtonEnter = (event) => {
    gsap.to(event.currentTarget, {
      y: -4,
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="room-details-loading">
          <LoaderCircle
            className="room-details-loader"
            size={45}
          />

          <p>
            Preparing your perfect stay...
          </p>
        </div>

        <Footer />
      </>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !room) {
    return (
      <>
        <Navbar />

        <div className="room-details-error">
          <h2>Room Not Found</h2>

          <p>
            {error ||
              "This room could not be found."}
          </p>

          <button
            onClick={() => navigate("/rooms")}
          >
            Back to Rooms
            <ArrowRight size={18} />
          </button>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main
        className="room-details-page"
        ref={pageRef}
      >
        {/* ==================================
            HERO
        ================================== */}

        <section
          className="room-details-hero"
          ref={heroRef}
        >
          <img
            ref={heroImageRef}
            src={room.image}
            alt={room.name}
          />

          <div className="room-details-overlay" />

          <div
            className="room-details-hero-content"
            ref={heroContentRef}
          >
            <p className="room-details-hero-type">
              {room.type?.toUpperCase()}
            </p>

            <h1>
              {room.name}
              <span>.</span>
            </h1>
          </div>
        </section>

        {/* ==================================
            ROOM SUMMARY
        ================================== */}

        <section
          className="room-summary"
          ref={summaryRef}
        >
          <div className="room-summary-left">
            <p className="room-category-tag">
              AZUREA SIGNATURE STAY
            </p>

            <h2>
              Your Private Paradise.
            </h2>

            <p className="room-summary-description">
              {room.description}
            </p>

            <div className="room-specs">
              <div>
                <Users size={22} />

                <span>
                  Up to {room.maxGuests} Guests
                </span>
              </div>

              <div>
                <BedDouble size={22} />

                <span>
                  Premium Bedding
                </span>
              </div>

              <div>
                <Maximize size={22} />

                <span>
                  Luxury Space
                </span>
              </div>
            </div>
          </div>

          {/* PRICE CARD */}

          <div
            className="room-price-card"
            ref={priceCardRef}
          >
            <p>STARTING FROM</p>

            <h3>
              ₹
              {Number(
                room.price
              ).toLocaleString("en-IN")}

              <span>/ night</span>
            </h3>

            <button
              onClick={() =>
                navigate(
                  `/booking?room=${room._id}`
                )
              }
              disabled={!room.available}
              onMouseEnter={
                handleButtonEnter
              }
              onMouseLeave={
                handleButtonLeave
              }
            >
              {room.available
                ? "Book This Stay"
                : "Currently Unavailable"}

              {room.available && (
                <ArrowRight size={19} />
              )}
            </button>

            <small>
              Best price guaranteed when
              booking directly.
            </small>
          </div>
        </section>

        {/* ==================================
            AMENITIES
        ================================== */}

        <section
          className="amenities-section"
          ref={amenitiesRef}
        >
          <div className="amenities-heading">
            <p>DESIGNED FOR COMFORT</p>

            <h2>
              Everything You
              <span> Need.</span>
            </h2>
          </div>

          <div className="amenities-grid">
            {room.amenities?.map(
              (amenity, index) => (
                <div
                  className="amenity-card"
                  key={index}
                >
                  <div className="amenity-icon">
                    {getAmenityIcon(amenity)}
                  </div>

                  <p>{amenity}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* ==================================
            EXPERIENCE
        ================================== */}

        <section
          className="room-experience"
          ref={experienceRef}
        >
          <div
            className="experience-image"
            ref={experienceImageRef}
          >
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85"
              alt="Luxury resort experience"
            />
          </div>

          <div className="experience-text">
            <p>MORE THAN A ROOM</p>

            <h2>
              A Stay You'll
              <span>
                Never Forget.
              </span>
            </h2>

            <p>
              Every detail has been carefully
              designed to create moments of
              comfort, connection and complete
              relaxation. From peaceful mornings
              to unforgettable sunsets, this is
              your space to simply escape.
            </p>

            <button
              onClick={() =>
                navigate("/#experiences")
              }
              onMouseEnter={
                handleButtonEnter
              }
              onMouseLeave={
                handleButtonLeave
              }
            >
              Explore Experiences
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* ==================================
            GALLERY
        ================================== */}

        <section
          className="room-gallery"
          ref={galleryRef}
        >
          <div className="gallery-heading">
            <p>INSIDE YOUR STAY</p>

            <h2>
              Explore Your Stay.
            </h2>
          </div>

          <div className="room-gallery-grid">
            <img
              src={room.image}
              alt={`${room.name} interior`}
            />

            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
              alt="Luxury resort interior"
            />

            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85"
              alt="Luxury bedroom"
            />
          </div>
        </section>

        {/* ==================================
            FINAL CTA
        ================================== */}

        <section
          className="room-final-cta"
          ref={finalCtaRef}
        >
          <div className="room-final-cta-content">
            <p>YOUR ESCAPE AWAITS</p>

            <h2>
              Ready to experience
              <span> AZUREA?</span>
            </h2>

            <button
              onClick={() =>
                navigate(
                  `/booking?room=${room._id}`
                )
              }
              disabled={!room.available}
              onMouseEnter={
                handleButtonEnter
              }
              onMouseLeave={
                handleButtonLeave
              }
            >
              {room.available
                ? "Reserve Your Stay"
                : "Currently Unavailable"}

              {room.available && (
                <ArrowRight size={19} />
              )}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RoomDetails;