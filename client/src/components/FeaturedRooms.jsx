import { useEffect, useRef, useState } from "react";
import { ArrowRight, Users, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { gsap } from "../animations/gsapSetup";
import "./FeaturedRooms.css";

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const viewAllRef = useRef(null);
  const gridRef = useRef(null);

  const navigate = useNavigate();

  // =========================================
  // FETCH ROOMS
  // =========================================

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get("/rooms");

        setRooms(response.data.rooms || response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // =========================================
  // GSAP ANIMATIONS
  // =========================================

  useEffect(() => {
    if (loading || !rooms.length) return;

    const section = sectionRef.current;
    const header = headerRef.current;
    const viewAll = viewAllRef.current;
    const grid = gridRef.current;

    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".room-card", grid);

      // -----------------------------------------
      // INITIAL STATES
      // -----------------------------------------

      gsap.set(header, {
        opacity: 0,
        y: 45,
      });

      if (viewAll) {
        gsap.set(viewAll, {
          opacity: 0,
          x: 35,
        });
      }

      gsap.set(cards, {
        opacity: 0,
        y: 80,
        rotateX: 5,
      });

      // -----------------------------------------
      // HEADER REVEAL
      // -----------------------------------------

      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      headerTimeline
        .to(header, {
          opacity: 1,
          y: 0,
          duration: 0.9,
        })
        .to(
          viewAll,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
          },
          "-=0.6"
        );

      // -----------------------------------------
      // ROOM CARDS STAGGER
      // -----------------------------------------

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out",

        scrollTrigger: {
          trigger: grid,
          start: "top 82%",
          once: true,
        },
      });

      // -----------------------------------------
      // CARD IMAGE PARALLAX
      // -----------------------------------------

      cards.forEach((card) => {
        const image = card.querySelector(".room-image img");

        if (!image) return;

        gsap.fromTo(
          image,
          {
            scale: 1.12,
          },
          {
            scale: 1,
            ease: "none",

            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // -----------------------------------------
      // 3D MOUSE INTERACTION
      // -----------------------------------------

      cards.forEach((card) => {
        const image = card.querySelector(".room-image img");

        const handleMouseMove = (event) => {
          const rect = card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
              rect.height -
            0.5;

          gsap.to(card, {
            rotateY: x * 5,
            rotateX: -y * 5,
            y: -10,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (image) {
            gsap.to(image, {
              x: x * 8,
              y: y * 6,
              scale: 1.08,
              duration: 0.6,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (image) {
            gsap.to(image, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        card.addEventListener(
          "mousemove",
          handleMouseMove
        );

        card.addEventListener(
          "mouseleave",
          handleMouseLeave
        );

        card._cleanupGSAP = () => {
          card.removeEventListener(
            "mousemove",
            handleMouseMove
          );

          card.removeEventListener(
            "mouseleave",
            handleMouseLeave
          );
        };
      });

      return () => {
        cards.forEach((card) => {
          if (card._cleanupGSAP) {
            card._cleanupGSAP();
            delete card._cleanupGSAP;
          }
        });
      };
    }, section);

    return () => ctx.revert();
  }, [loading, rooms]);

  // =========================================
  // VIEW ALL ROOMS
  // =========================================

  const handleViewAllRooms = () => {
    navigate("/rooms");
  };

  // =========================================
  // EXPLORE ROOM
  // =========================================

  const handleExploreRoom = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <section className="featured-rooms">
        <p className="rooms-loading">
          Discovering your perfect escape...
        </p>
      </section>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <section
      className="featured-rooms"
      id="rooms"
      ref={sectionRef}
    >
      <div
        className="rooms-header"
        ref={headerRef}
      >
        <div>
          <p className="rooms-tag">
            STAY IN PARADISE
          </p>

          <h2>
            Find Your Perfect{" "}
            <span>Stay.</span>
          </h2>

          <p>
            Every room at AZUREA is designed to bring you
            closer to comfort, nature, and unforgettable
            moments.
          </p>
        </div>

        <button
          className="view-all-btn"
          ref={viewAllRef}
          onClick={handleViewAllRooms}
          type="button"
        >
          <span>View All Rooms</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* ROOMS */}

      <div
        className="rooms-grid"
        ref={gridRef}
      >
        {rooms.slice(0, 3).map((room) => (
          <div
            className="room-card"
            key={room._id}
          >
            {/* IMAGE */}

            <div className="room-image">
              <img
                src={room.image}
                alt={room.name}
              />

              <div className="room-type">
                {room.type}
              </div>
            </div>

            {/* INFORMATION */}

            <div className="room-info">
              <h3>{room.name}</h3>

              <p>{room.description}</p>

              {/* META */}

              <div className="room-meta">
                <span>
                  <Users size={17} />
                  Up to {room.maxGuests} Guests
                </span>

                <span>
                  <BedDouble size={17} />
                  Luxury Stay
                </span>
              </div>

              {/* FOOTER */}

              <div className="room-footer">
                <div className="room-price">
                  <strong>
                    ₹
                    {Number(room.price).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <span>/ night</span>
                </div>

                <button
                  className="room-btn"
                  type="button"
                  onClick={() =>
                    handleExploreRoom(room._id)
                  }
                >
                  <span>Explore</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRooms;