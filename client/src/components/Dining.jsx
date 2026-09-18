import { useEffect, useRef } from "react";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";

import { gsap } from "../animations/gsapSetup";
import "./Dining.css";

const Dining = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const detailsRef = useRef(null);
  const buttonRef = useRef(null);
  const chefCardRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      // =========================================
      // INITIAL STATES
      // =========================================

      gsap.set(contentRef.current, {
        opacity: 0,
        x: -80,
      });

      gsap.set(visualRef.current, {
        opacity: 0,
        x: 80,
      });

      gsap.set(imageRef.current, {
        scale: 1.15,
      });

      gsap.set(chefCardRef.current, {
        opacity: 0,
        y: 35,
      });

      // =========================================
      // CONTENT REVEAL
      // =========================================

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
        .to(contentRef.current, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power4.out",
        })
        .to(
          visualRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.8"
        )
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
          chefCardRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.8"
        );

      // =========================================
      // TEXT MICRO REVEALS
      // =========================================

      gsap.fromTo(
        [
          tagRef.current,
          headingRef.current,
          descriptionRef.current,
          detailsRef.current,
          buttonRef.current,
        ],
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",

          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 72%",
            once: true,
          },
        }
      );

      // =========================================
      // IMAGE PARALLAX
      // =========================================

      gsap.to(imageRef.current, {
        yPercent: -7,
        ease: "none",

        scrollTrigger: {
          trigger: imageWrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // =========================================
      // CHEF CARD FLOAT
      // =========================================

      gsap.to(chefCardRef.current, {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // =========================================
      // IMAGE 3D MOUSE EFFECT
      // =========================================

      const imageWrapper = imageWrapperRef.current;

      const handleMouseMove = (event) => {
        if (!imageWrapper) return;

        const rect =
          imageWrapper.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
            rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
            rect.height -
          0.5;

        gsap.to(imageWrapper, {
          rotateY: x * 5,
          rotateX: -y * 5,
          rotateZ: 0,
          scale: 1.015,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(imageRef.current, {
          x: x * 8,
          y: y * 6,
          scale: 1.06,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(imageWrapper, {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 1,
          scale: 1,
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

      imageWrapper?.addEventListener(
        "mousemove",
        handleMouseMove
      );

      imageWrapper?.addEventListener(
        "mouseleave",
        handleMouseLeave
      );

      return () => {
        imageWrapper?.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        imageWrapper?.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="dining-section"
      id="dining"
      ref={sectionRef}
    >
      <div className="dining-container">

        {/* LEFT CONTENT */}

        <div
          className="dining-content"
          ref={contentRef}
        >
          <p
            className="dining-tag"
            ref={tagRef}
          >
            A TASTE OF AZUREA
          </p>

          <h2 ref={headingRef}>
            Where Every Meal
            <span>
              Becomes A Memory.
            </span>
          </h2>

          <p
            className="dining-description"
            ref={descriptionRef}
          >
            From ocean-inspired flavours to carefully
            crafted international cuisine, every dish at
            AZUREA is prepared to turn your dining
            experience into something unforgettable.
          </p>

          <div
            className="dining-details"
            ref={detailsRef}
          >
            <div className="dining-detail">
              <div className="detail-icon">
                <Clock size={20} />
              </div>

              <div>
                <span>OPEN DAILY</span>
                <p>
                  7:00 AM – 11:00 PM
                </p>
              </div>
            </div>

            <div className="dining-detail">
              <div className="detail-icon">
                <MapPin size={20} />
              </div>

              <div>
                <span>LOCATION</span>
                <p>
                  AZUREA Beachfront
                </p>
              </div>
            </div>
          </div>

          <button
            className="dining-btn"
            ref={buttonRef}
            type="button"
            onClick={() =>
              alert(
                "AZUREA Dining\n\nOpen daily from 7:00 AM – 11:00 PM."
              )
            }
          >
            Explore Our Dining
            <ArrowUpRight size={19} />
          </button>
        </div>

        {/* RIGHT VISUAL */}

        <div
          className="dining-visual"
          ref={visualRef}
        >
          <div
            className="dining-image-wrapper"
            ref={imageWrapperRef}
          >
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury dining at AZUREA"
            />

            <div className="dining-image-overlay" />
          </div>

          {/* FLOATING CHEF CARD */}

          <div
            className="chef-card"
            ref={chefCardRef}
          >
            <span>
              CHEF'S SIGNATURE
            </span>

            <h3>
              Flavours Inspired By The Ocean
            </h3>

            <div className="chef-card-line" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Dining;