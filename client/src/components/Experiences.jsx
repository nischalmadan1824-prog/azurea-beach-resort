import { useEffect, useRef } from "react";
import {
  Waves,
  Sparkles,
  Utensils,
  Sunset,
  ArrowUpRight,
} from "lucide-react";

import { gsap } from "../animations/gsapSetup";
import "./Experiences.css";

const experiences = [
  {
    title: "Ocean Adventures",
    description:
      "Dive into crystal blue waters and discover adventures beyond the horizon.",
    image:
      "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1200&q=85",
    icon: <Waves size={24} />,
    number: "01",
  },
  {
    title: "Spa & Wellness",
    description:
      "Reconnect with yourself through calming rituals designed for complete relaxation.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    icon: <Sparkles size={24} />,
    number: "02",
  },
  {
    title: "Fine Dining",
    description:
      "Taste unforgettable flavours inspired by the ocean, nature and local culture.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    icon: <Utensils size={24} />,
    number: "03",
  },
  {
    title: "Golden Sunsets",
    description:
      "End your perfect day watching the sky transform into unforgettable colours.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85",
    icon: <Sunset size={24} />,
    number: "04",
  },
];

const Experiences = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  const handleExplore = (experience) => {
    alert(
      `${experience.title}\n\n${experience.description}`
    );
  };

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;

    if (!section || !heading || !grid) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(
        ".experience-card",
        grid
      );

      // =========================================
      // INITIAL STATES
      // =========================================

      gsap.set(heading, {
        opacity: 0,
        y: 50,
      });

      gsap.set(cards, {
        opacity: 0,
        y: 90,
        rotateX: 6,
      });

      // =========================================
      // HEADING REVEAL
      // =========================================

      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",

        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      // =========================================
      // CARD STAGGER
      // =========================================

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.1,
        stagger: 0.16,
        ease: "power4.out",

        scrollTrigger: {
          trigger: grid,
          start: "top 82%",
          once: true,
        },
      });

      // =========================================
      // IMAGE PARALLAX
      // =========================================

      cards.forEach((card) => {
        const image = card.querySelector(
          ".experience-card img"
        );

        if (!image) return;

        gsap.fromTo(
          image,
          {
            scale: 1.15,
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

      // =========================================
      // 3D CARD INTERACTION
      // =========================================

      cards.forEach((card) => {
        const image = card.querySelector(
          ".experience-card img"
        );

        const handleMouseMove = (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
              rect.height -
            0.5;

          gsap.to(card, {
            rotateY: x * 7,
            rotateX: -y * 7,
            y: -8,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (image) {
            gsap.to(image, {
              x: x * 10,
              y: y * 8,
              scale: 1.08,
              duration: 0.7,
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
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (image) {
            gsap.to(image, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.9,
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

        card._experienceCleanup = () => {
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

      // =========================================
      // NUMBER PARALLAX
      // =========================================

      cards.forEach((card) => {
        const number = card.querySelector(
          ".experience-number"
        );

        if (!number) return;

        gsap.fromTo(
          number,
          {
            y: -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",

            scrollTrigger: {
              trigger: card,
              start: "top 78%",
              once: true,
            },
          }
        );
      });

      return () => {
        cards.forEach((card) => {
          if (card._experienceCleanup) {
            card._experienceCleanup();
            delete card._experienceCleanup;
          }
        });
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="experiences-section"
      id="experiences"
      ref={sectionRef}
    >
      <div className="experiences-container">

        {/* HEADING */}

        <div
          className="experiences-heading"
          ref={headingRef}
        >
          <p className="experiences-tag">
            MORE THAN A STAY
          </p>

          <h2>
            Moments You'll{" "}
            <span>Remember.</span>
          </h2>

          <p>
            Every experience at AZUREA is designed to
            make your escape feel extraordinary.
          </p>
        </div>

        {/* EXPERIENCE GRID */}

        <div
          className="experiences-grid"
          ref={gridRef}
        >
          {experiences.map((experience) => (
            <div
              className="experience-card"
              key={experience.number}
            >
              <img
                src={experience.image}
                alt={experience.title}
              />

              <div className="experience-overlay"></div>

              <div className="experience-number">
                {experience.number}
              </div>

              <div className="experience-content">

                <div className="experience-icon">
                  {experience.icon}
                </div>

                <h3>
                  {experience.title}
                </h3>

                <p>
                  {experience.description}
                </p>

                <button
                  className="experience-btn"
                  type="button"
                  onClick={() =>
                    handleExplore(experience)
                  }
                >
                  Explore
                  <ArrowUpRight size={18} />
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experiences;