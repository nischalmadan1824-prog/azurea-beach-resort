import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { gsap } from "../animations/gsapSetup";
import "./About.css";

const About = () => {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionsRef = useRef(null);
  const highlightsRef = useRef(null);
  const buttonRef = useRef(null);
  const floatingCardRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrapper = imageWrapperRef.current;

    if (!section || !imageWrapper) return;

    const ctx = gsap.context(() => {
      // -----------------------------------------
      // INITIAL STATES
      // -----------------------------------------

      gsap.set(imageWrapperRef.current, {
        opacity: 0,
        x: -90,
        rotateY: -8,
      });

      gsap.set(imageRef.current, {
        scale: 1.15,
      });

      gsap.set(
        [
          tagRef.current,
          titleRef.current,
          descriptionsRef.current,
          highlightsRef.current,
          buttonRef.current,
        ],
        {
          opacity: 0,
          y: 35,
        }
      );

      gsap.set(floatingCardRef.current, {
        opacity: 0,
        y: 25,
      });

      // -----------------------------------------
      // MAIN SCROLL REVEAL
      // -----------------------------------------

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(imageWrapperRef.current, {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: "power4.out",
        })
        .to(
          imageRef.current,
          {
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          "-=1"
        )
        .to(
          tagRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.8"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.5"
        )
        .to(
          descriptionsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          highlightsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .to(
          floatingCardRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          "-=0.7"
        );

      // -----------------------------------------
      // IMAGE PARALLAX
      // -----------------------------------------

      gsap.to(imageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // -----------------------------------------
      // FLOATING CARD
      // -----------------------------------------

      gsap.to(floatingCardRef.current, {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // -----------------------------------------
      // MOUSE 3D EFFECT
      // -----------------------------------------

      const handleMouseMove = (event) => {
        const rect = imageWrapper.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(imageWrapperRef.current, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(imageRef.current, {
          x: x * 8,
          y: y * 6,
          scale: 1.025,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(imageWrapperRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(imageRef.current, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      imageWrapper.addEventListener(
        "mousemove",
        handleMouseMove
      );

      imageWrapper.addEventListener(
        "mouseleave",
        handleMouseLeave
      );

      return () => {
        imageWrapper.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        imageWrapper.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      };
    }, section);

    return () => ctx.revert();
  }, []);

  const handleDiscover = () => {
    navigate("/rooms");
  };

  return (
    <section
      className="about-section"
      id="about"
      ref={sectionRef}
    >
      <div className="about-container">

        {/* IMAGE */}

        <div
          className="about-image-wrapper"
          ref={imageWrapperRef}
        >
          <img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=90"
            alt="AZUREA Beach Resort"
          />

          <div
            className="about-floating-card"
            ref={floatingCardRef}
          >
            <span>🌊</span>

            <div>
              <strong>Endless Blue</strong>

              <p>
                Ocean. Sky. Peace.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div
          className="about-content"
          ref={contentRef}
        >
          <p
            className="about-tag"
            ref={tagRef}
          >
            A PLACE TO BREATHE
          </p>

          <h2 ref={titleRef}>
            Where Time{" "}
            <span>Slows Down.</span>
          </h2>

          <div ref={descriptionsRef}>
            <p className="about-description">
              At AZUREA, every sunrise begins with the
              sound of gentle waves and every evening melts
              into colours you'll never forget.
            </p>

            <p className="about-description">
              Escape the rush of everyday life and discover
              a place where luxury feels natural, moments
              feel longer, and the ocean is always close.
            </p>
          </div>

          {/* HIGHLIGHTS */}

          <div
            className="about-highlights"
            ref={highlightsRef}
          >
            <div>
              <strong>🌴</strong>
              <span>Tropical Calm</span>
            </div>

            <div>
              <strong>🌊</strong>
              <span>Ocean Views</span>
            </div>

            <div>
              <strong>☀️</strong>
              <span>Golden Days</span>
            </div>
          </div>

          {/* CTA */}

          <button
            className="about-btn"
            type="button"
            ref={buttonRef}
            onClick={handleDiscover}
          >
            <span>Discover AZUREA</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;