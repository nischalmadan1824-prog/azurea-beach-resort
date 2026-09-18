
import { useEffect } from "react";
import { gsap } from "../animations/gsapSetup";

const GlobalAnimations = () => {
  useEffect(() => {
    /* =========================================
       INITIAL PAGE REVEAL
    ========================================= */

    gsap.fromTo(
      "body",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    /* =========================================
       SMOOTH ANCHOR SCROLLING
    ========================================= */

    const handleAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (!link) return;

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: target,
          offsetY: 80,
        },
        ease: "power3.inOut",
      });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
};

export default GlobalAnimations;

