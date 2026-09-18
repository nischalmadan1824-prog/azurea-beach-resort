import { useEffect, useRef } from "react";
import {
  Camera,
  Globe,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

import { gsap } from "../animations/gsapSetup";
import "./Footer.css";

const Footer = () => {
  const footerRef = useRef(null);
  const containerRef = useRef(null);
  const brandRef = useRef(null);
  const columnsRef = useRef(null);
  const bottomRef = useRef(null);
  const socialsRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const ctx = gsap.context(() => {
      const columns = gsap.utils.toArray(
        ".footer-column",
        columnsRef.current
      );

      const socialLinks = gsap.utils.toArray(
        ".footer-socials a",
        socialsRef.current
      );

      // =========================================
      // INITIAL STATES
      // =========================================

      gsap.set(brandRef.current, {
        opacity: 0,
        y: 45,
      });

      gsap.set(columns, {
        opacity: 0,
        y: 40,
      });

      gsap.set(bottomRef.current, {
        opacity: 0,
        y: 25,
      });

      gsap.set(socialLinks, {
        opacity: 0,
        scale: 0.7,
      });

      // =========================================
      // FOOTER REVEAL
      // =========================================

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 82%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(brandRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
        })
        .to(
          columns,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.55"
        )
        .to(
          socialLinks,
          {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: "back.out(1.6)",
          },
          "-=0.45"
        )
        .to(
          bottomRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.35"
        );

      // =========================================
      // SOCIAL HOVER
      // =========================================

      socialLinks.forEach((link) => {
        const icon = link.querySelector("svg");

        const handleMouseEnter = () => {
          gsap.to(link, {
            y: -5,
            scale: 1.05,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          });

          gsap.to(icon, {
            rotate: 8,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(link, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });

          gsap.to(icon, {
            rotate: 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        link.addEventListener(
          "mouseenter",
          handleMouseEnter
        );

        link.addEventListener(
          "mouseleave",
          handleMouseLeave
        );

        link._footerCleanup = () => {
          link.removeEventListener(
            "mouseenter",
            handleMouseEnter
          );

          link.removeEventListener(
            "mouseleave",
            handleMouseLeave
          );
        };
      });

      return () => {
        socialLinks.forEach((link) => {
          if (link._footerCleanup) {
            link._footerCleanup();
            delete link._footerCleanup;
          }
        });
      };
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      className="footer"
      ref={footerRef}
    >
      <div
        className="footer-container"
        ref={containerRef}
      >
        {/* BRAND */}

        <div
          className="footer-brand"
          ref={brandRef}
        >
          <h2>AZUREA</h2>

          <p className="footer-brand-tagline">
            Where the ocean meets unforgettable moments.
          </p>

          <p>
            Escape into a world of calm waters, warm
            sunsets, luxurious stays, and experiences
            designed to stay with you forever.
          </p>

          <div
            className="footer-socials"
            ref={socialsRef}
          >
            <a
              href="#"
              aria-label="Instagram"
            >
              <Camera size={20} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
            >
              <Globe size={20} />
            </a>

            <a
              href="#"
              aria-label="Twitter"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* EXPLORE */}

        <div
          className="footer-column"
          ref={columnsRef}
        >
          <h4>EXPLORE</h4>

          <a href="#about">About Us</a>
          <a href="#rooms">Rooms & Suites</a>
          <a href="#experiences">
            Experiences
          </a>
          <a href="#dining">Dining</a>
          <a href="#gallery">Gallery</a>
        </div>

        {/* YOUR STAY */}

        <div className="footer-column">
          <h4>YOUR STAY</h4>

          <a href="#booking">
            Book Your Stay
          </a>

          <a href="#">
            Special Offers
          </a>

          <a href="#">
            Resort Map
          </a>

          <a href="#">
            FAQs
          </a>
        </div>

        {/* CONTACT */}

        <div className="footer-column footer-contact">
          <h4>CONTACT</h4>

          <div>
            <MapPin size={18} />
            <span>
              Paradise Coast, India
            </span>
          </div>

          <div>
            <Phone size={18} />
            <span>
              +91 98765 43210
            </span>
          </div>

          <div>
            <Mail size={18} />
            <span>
              stay@azurearesort.com
            </span>
          </div>

          <a
            className="footer-contact-link"
            href="#contact"
          >
            Get in Touch
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* BOTTOM */}

      <div
        className="footer-bottom"
        ref={bottomRef}
      >
        <p>
          © {new Date().getFullYear()} AZUREA
          Beach Resort. All rights reserved.
        </p>

        <div>
          <a href="#">
            Privacy Policy
          </a>

          <a href="#">
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;