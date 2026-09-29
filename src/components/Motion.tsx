"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

declare global {
  interface Window {
    __motionFailsafe?: ReturnType<typeof setTimeout>;
  }
}

/**
 * The page's one authored moment: the wordmark settles into place while the
 * phoenix rises into its cover plate. Results rows post in order as the board
 * scrolls into view. Nothing runs under prefers-reduced-motion.
 */
export function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = document.documentElement;
      let split: SplitText | undefined;
      let cancelled = false;

      const intro = () => {
        if (cancelled) return;
        clearTimeout(window.__motionFailsafe);
        // If the failsafe already revealed the hero, don't hide it again.
        if (!root.classList.contains("motion-ok")) return;

        gsap.set("[data-hero-reveal]", { visibility: "visible" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        const title = document.querySelector<HTMLElement>("[data-hero-title]");
        if (title) {
          split = SplitText.create(title, { type: "chars", mask: "chars", aria: "none" });
          tl.from(split.chars, { yPercent: 108, duration: 1.15, stagger: 0.03 }, 0);
        }

        tl.from("[data-hero-plate]", { opacity: 0, y: 18, duration: 1 }, 0.15).from(
          "[data-hero-phoenix]",
          { clipPath: "inset(100% 0% 0% 0%)", y: 40, duration: 1.7 },
          0.35,
        );
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(intro);
      } else {
        intro();
      }

      gsap.from("[data-result-row] > *", {
        opacity: 0,
        x: -20,
        duration: 0.9,
        ease: "expo.out",
        stagger: { each: 0.035, grid: "auto" },
        scrollTrigger: { trigger: "#results table", start: "top 80%", once: true },
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    });

    return () => mm.revert();
  });

  return null;
}
