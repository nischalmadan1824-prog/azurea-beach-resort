import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";

import { gsap } from "../animations/gsapSetup";

import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const bottomRef = useRef(null);
  const orbOneRef = useRef(null);
  const orbTwoRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const ctx = gsap.context(() => {
      /* =========================================
         INITIAL STATES
      ========================================= */

      gsap.set(
        [
          eyebrowRef.current,
          titleRef.current,
          descriptionRef.current,
          buttonsRef.current,
          bottomRef.current,
        ],
        {
          opacity: 0,
        }
      );

      gsap.set(eyebrowRef.current, {
        y: 30,
      });

      gsap.set(titleRef.current, {
        y: 65,
      });

      gsap.set(descriptionRef.current, {
        y: 30,
      });

      gsap.set(buttonsRef.current, {
        y: 30,
      });

      gsap.set(bottomRef.current, {
        y: 20,
      });

      gsap.set(imageRef.current, {
        scale: 1.12,
      });

      gsap.set(orbOneRef.current, {
        x: -30,
        y: 20,
      });

      gsap.set(orbTwoRef.current, {
        x: 30,
        y: -20,
      });

      /* =========================================
         HERO ENTRANCE TIMELINE
      ========================================= */

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(imageRef.current, {
          scale: 1,
          duration: 2.2,
          ease: "power2.out",
        })
        .to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=1.5"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.55"
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.65"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          bottomRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        );

      /* =========================================
         FLOATING ORBS
      ========================================= */

      gsap.to(orbOneRef.current, {
        x: 25,
        y: -25,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orbTwoRef.current, {
        x: -25,
        y: 25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* =========================================
         HERO PARALLAX ON SCROLL
      ========================================= */

      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* =========================================
         MOUSE PARALLAX
      ========================================= */

      const handleMouseMove = (event) => {
        const rect = hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(imageRef.current, {
          x: x * 12,
          y: y * 8,
          duration: 1.2,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(orbOneRef.current, {
          x: x * 35,
          y: y * 35,
          duration: 1.4,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(orbTwoRef.current, {
          x: x * -30,
          y: y * -30,
          duration: 1.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(
          [
            imageRef.current,
            orbOneRef.current,
            orbTwoRef.current,
          ],
          {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            overwrite: "auto",
          }
        );
      };

      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseleave", handleMouseLeave);

      /* =========================================
         CLEANUP
      ========================================= */

      return () => {
        hero.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        hero.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      };
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hero"
      id="home"
      ref={heroRef}
    >
      {/* Background */}

      <div className="hero-background">
        <div
          className="hero-image"
          ref={imageRef}
        ></div>

        <div className="hero-gradient"></div>
      </div>

      {/* Decorative elements */}

      <div
        className="hero-orb hero-orb-one"
        ref={orbOneRef}
      ></div>

      <div
        className="hero-orb hero-orb-two"
        ref={orbTwoRef}
      ></div>

      {/* Main Content */}

      <div
        className="hero-content"
        ref={contentRef}
      >
        <div
          className="hero-eyebrow"
          ref={eyebrowRef}
        >
          <span className="eyebrow-line"></span>

          <span>WELCOME TO AZUREA</span>

          <span className="eyebrow-line"></span>
        </div>

        <h1 ref={titleRef}>
          Escape to
          <span>Paradise.</span>
        </h1>

        <p
          className="hero-description"
          ref={descriptionRef}
        >
          Where turquoise waters, golden sunsets and effortless luxury
          come together to create moments worth remembering.
        </p>

        <div
          className="hero-buttons"
          ref={buttonsRef}
        >
          <button
            className="primary-btn"
            type="button"
            onClick={() => navigate("/rooms")}
          >
            <span>Explore AZUREA</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="secondary-btn"
            type="button"
            onClick={() => navigate("/rooms")}
          >
            Discover Rooms
          </button>
        </div>
      </div>

      {/* Bottom information */}

      <div
        className="hero-bottom"
        ref={bottomRef}
      >
        <div className="hero-location">
          <span className="location-dot"></span>

          <span>YOUR PRIVATE ESCAPE</span>
        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>

          <div className="scroll-icon">
            <ArrowDown size={17} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

