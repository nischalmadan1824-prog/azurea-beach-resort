import { useEffect, useRef } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { gsap } from "../animations/gsapSetup";
import "./BookingCTA.css";

const BookingCTA = () => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      // =========================================
      // INITIAL STATES
      // =========================================

      gsap.set(overlayRef.current, {
        opacity: 0,
      });

      gsap.set(contentRef.current, {
        opacity: 0,
        y: 60,
      });

      gsap.set(tagRef.current, {
        opacity: 0,
        y: 25,
      });

      gsap.set(headingRef.current, {
        opacity: 0,
        y: 45,
        scale: 0.97,
      });

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.92,
      });

      // =========================================
      // CINEMATIC SECTION REVEAL
      // =========================================

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(overlayRef.current, {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        })
        .to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.8"
        )
        .to(
          tagRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.65"
        )
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.45"
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.55"
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          "-=0.45"
        );

      // =========================================
      // BACKGROUND PARALLAX
      // =========================================

      gsap.to(section, {
        backgroundPosition: "50% 65%",
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // =========================================
      // BUTTON HOVER
      // =========================================

      const button = buttonRef.current;

      const handleMouseEnter = () => {
        gsap.to(button, {
          y: -5,
          scale: 1.03,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(button.querySelector("svg:last-child"), {
          x: 5,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(button.querySelector("svg:last-child"), {
          x: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      button?.addEventListener(
        "mouseenter",
        handleMouseEnter
      );

      button?.addEventListener(
        "mouseleave",
        handleMouseLeave
      );

      return () => {
        button?.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );

        button?.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="booking-cta"
      id="booking"
      ref={sectionRef}
    >
      <div
        className="booking-cta-overlay"
        ref={overlayRef}
      />

      <div
        className="booking-cta-content"
        ref={contentRef}
      >
        <p
          className="booking-cta-tag"
          ref={tagRef}
        >
          YOUR PERFECT ESCAPE AWAITS
        </p>

        <h2 ref={headingRef}>
          Your Next Chapter
          <span> Begins Here.</span>
        </h2>

        <p ref={descriptionRef}>
          Leave the ordinary behind and discover a place
          where every sunrise, every wave, and every
          moment becomes unforgettable.
        </p>

        <button
          className="booking-cta-btn"
          type="button"
          ref={buttonRef}
          onClick={() => navigate("/booking")}
        >
          <CalendarDays size={20} />
          <span>Book Your Stay</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default BookingCTA;